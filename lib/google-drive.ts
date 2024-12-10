import { google } from "googleapis";
import fs from "fs";
import path from "path";

// @ts-expect-error: doen't have the declarations
import { pipeline } from "@xenova/transformers";

type GenerateEmbedding = (
  text: string,
  options?: any
) => Promise<{ data: Iterable<number> }>;

let generateEmbedding: GenerateEmbedding | null = null;

const getGenerateEmbedding = async (): Promise<GenerateEmbedding> => {
  if (!generateEmbedding) {
    generateEmbedding = (await pipeline(
      "feature-extraction",
      "Supabase/gte-small"
    )) as GenerateEmbedding;
  }
  return generateEmbedding;
};

export const getEmbeddings = async (text: string) => {
  const embedingCreator = await getGenerateEmbedding();
  const embeddings = await embedingCreator(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(embeddings.data);
};

// Path to your service account key file
const SERVICE_ACCOUNT_FILE = path.join(
  process.cwd(),
  "./plugs-map-3b0e180f43ce.json"
);

// Authenticate with a service account
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/presentations",
  ], // Adjust scopes as needed
});

export async function getThumbnail(
  presentationId: string,
  pageObjectId: string
) {
  try {
    // Request thumbnail for the specific slide
    const response = await slides.presentations.pages.getThumbnail({
      presentationId, // ID of the Google Slides presentation
      pageObjectId, // Object ID of the slide
      "thumbnailProperties.thumbnailSize": "MEDIUM",
    });

    // Thumbnail URL
    const thumbnailUrl = response.data.contentUrl;

    console.log(`Thumbnail URL for slide ${pageObjectId}:`, thumbnailUrl);
    return {
      thumbnailUrl,
    };
  } catch (err) {
    console.error("Error fetching thumbnail:", String(err));
    return {
      thumbnailUrl: null,
    };
  }
}

// Create a Drive client
export const drive = google.drive({ version: "v3", auth });
const slides = google.slides({ version: "v1", auth });

export async function getPresentation(presentationFileId: string) {
  const presentation = await slides.presentations.get({
    presentationId: presentationFileId, // ID of the Google Slides file
  });

  return presentation.data;
}

export async function convertPptxToGoogleSlides(fileId: string) {
  try {
    const fileMetadata = {
      name: `converted_${fileId}`,
      mimeType: "application/vnd.google-apps.presentation", // Convert to Google Slides format
    };

    const response = await drive.files.copy({
      fileId, // The original .pptx file ID
      requestBody: fileMetadata,
    });

    console.log("Converted File ID:", response.data.id);
    return { presentationFileId: response.data.id }; //response.data.id; // Return the new file ID in Google Slides format
  } catch (err) {
    console.error("Error converting file:", String(err));
    throw err;
  }
}

export async function uploadPresentation(
  filePath: string,
  metadata: Record<string, any>
) {
  try {
    const fileMetadata = {
      ...metadata,
    };
    const media = {
      mimeType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // MIME type of the file
      body: fs.createReadStream(filePath), // File stream
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id", // Return the file ID
    });

    return {
      googleDriveId: response.data.id,
    };
  } catch (err) {
    return {
      error: err,
    };
  }
}
