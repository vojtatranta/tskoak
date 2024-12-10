import { Database } from "@/database.types";
import { createSupabaseServerClient, getUser } from "@/lib/supabase-server";
import { SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuid } from "uuid";
import {
  convertPptxToGoogleSlides,
  getEmbeddings,
  getPresentation,
  getThumbnail,
  uploadPresentation,
} from "@/lib/google-drive";
import { Maybe } from "actual-maybe";

const UPLOAD_DIR = path.join(process.cwd(), "./public/uploads");

type FileEntity = Database["public"]["Tables"]["files"]["Row"];

async function processFile(
  fileEntity: FileEntity,
  supabase: SupabaseClient<Database>,
  options: {
    presentationTitle?: string;
  },
) {
  console.log("fileEntity", fileEntity);

  if (!fs.existsSync(fileEntity.local_file_path)) {
    console.log("File does not exist");
    return;
  }

  const result = await uploadPresentation(fileEntity.local_file_path, {
    name: fileEntity.filename,
    fileUuid: fileEntity.uuid,
  });

  if (!result.googleDriveId) {
    throw new Error("Failed to upload file to Google Drive");
  }

  await supabase
    .from("files")
    .update({
      google_drive_id: result.googleDriveId,
    })
    .eq("uuid", fileEntity.uuid);

  const conversionResult = await convertPptxToGoogleSlides(
    result.googleDriveId,
  );

  if (!conversionResult.presentationFileId) {
    throw new Error("Failed to convert file to Google Slides");
  }

  await supabase
    .from("files")
    .update({
      presentation_file_id: conversionResult.presentationFileId,
    })
    .eq("uuid", fileEntity.uuid);

  const presentation = await getPresentation(
    conversionResult.presentationFileId,
  );

  const slidesData = await Promise.all(
    (
      presentation.slides?.map((slide, index) => {
        const elements = slide.pageElements || [];
        const texts = elements
          .flatMap(
            (element) =>
              element.shape?.text?.textElements?.map(
                (te) => te.textRun?.content || "",
              ) ?? [],
          )
          .filter((text) => text); // Remove null/undefined

        return {
          slideIndex: index + 1,
          objectId: slide.objectId,
          texts,
          elements,
        };
      }) ?? []
    ).map((slide) =>
      Promise.all([
        getThumbnail(
          String(conversionResult.presentationFileId),
          String(slide.objectId),
        ),
        getEmbeddings(slide.texts.join(".")),
      ]).then(([{ thumbnailUrl: exportUrl }, vector]) => ({
        ...slide,
        exportUrl,
        vector,
      })),
    ),
  );

  const allPresentationTexts = slidesData
    .flatMap((slide) => slide.texts)
    .join(".");

  const presentationTextVector = await getEmbeddings(allPresentationTexts);

  const { data: savedPresentation, error: presentationSaveError } =
    await supabase
      .from("presentations")
      .insert([
        {
          file: fileEntity.id,
          all_text: allPresentationTexts,
          title: options.presentationTitle ?? presentation.title,
          user_id: fileEntity.user_id,
          text_vector: presentationTextVector as unknown as string,
        },
      ])
      .select()
      .single();

  if (!savedPresentation || presentationSaveError) {
    console.error("Failed to save presentation", presentationSaveError);
    throw new Error("Failed to save presentation");
  }

  const { data: savedSlides, error: slideSaveError } = await supabase
    .from("slides")
    .insert(
      slidesData.map((slide) => ({
        presentation_id: savedPresentation?.id,
        object_id: slide.objectId,
        text: slide.texts.join("."),
        thumbnail_url: slide.exportUrl,
        user_id: fileEntity.user_id,
        text_vector: slide.vector as unknown as string,
      })),
    )
    .select();

  await Maybe.fromFirst(slidesData)
    .map(({ exportUrl }) =>
      supabase
        .from("presentations")
        .update({
          thumbnail_url: exportUrl,
        })
        .eq("id", savedPresentation.id),
    )
    .getValue(Promise.resolve({}));

  //   const arrayBuffer = fs.readFileSync(fileEntity.local_file_path);

  //   const zip = new JSZip();
  //   await zip.loadAsync(arrayBuffer);

  //   const text = await zip.loadAsync("text");

  //   console.log("zip", zip);
  //   console.log("text", text);

  //
}

export async function POST(request: Request) {
  const [user, supabase] = await Promise.all([
    getUser(),
    createSupabaseServerClient(),
  ]);

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return new Response("Not a valid file to upload", { status: 400 });
  }

  const fileUuid = uuid();
  const fileName = `${fileUuid}.pptx`;

  const filePath = path.join(UPLOAD_DIR, fileName);

  const buffer = new Uint8Array(await file.arrayBuffer());

  fs.writeFileSync(filePath, buffer);

  const { error: fileSaveError, data: savedFileEntity } = await supabase
    .from("files")
    .insert([
      {
        user_id: user.id,
        filename: fileName,
        local_file_path: filePath,
        file_uuid: fileUuid,
      },
    ])
    .select()
    .single();

  if (fileSaveError) {
    return NextResponse.json(
      {
        message: fileSaveError.message,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  await processFile(savedFileEntity, supabase, {
    presentationTitle: file.name,
  });

  return NextResponse.json(
    {
      message: "File uploaded successfully",
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
