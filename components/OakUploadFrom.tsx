"use client";

import { useState } from "react";
import { FileInput } from "./ui/fileinput";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function OakUploadFrom({ refreshOnDone }: { refreshOnDone?: boolean }) {
  const router = useRouter();
  const [formState, setFormState] = useState<{
    file: File | null;
    uploading: boolean;
  }>({
    file: null,
    uploading: false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formState.file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", formState.file);

    setFormState({
      ...formState,
      uploading: true,
    });

    fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFormState({
          file: null,
          uploading: false,
        });
        toast.success("File uploaded successfully");
      })
      .catch((err) => {
        toast.error("Failed to upload file");
        setFormState({
          file: null,
          uploading: false,
        });
      })
      .finally(() => {
        if (refreshOnDone) {
          router.refresh();
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FileInput
        placeholder="Drag and drop you presentation or click to select"
        currentFileName={formState.file?.name ?? null}
        accept="*"
        onFileSelect={(file) => {
          console.log("file", file);
          setFormState((prev) => ({
            ...prev,
            file,
          }));
        }}
      />
      <Button type="submit" disabled={!formState.file || formState.uploading}>
        {formState.uploading && <Loader2 className="mr-2 animate-spin" />}{" "}
        Upload your presentation
      </Button>
    </form>
  );
}
