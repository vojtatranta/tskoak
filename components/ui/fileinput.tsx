import * as React from "react";
import { cn } from "@/web/lib/utils";

export interface FileInputProps {
  className?: string;
  currentFileName?: string | null;
  placeholder?: string;
  children?: React.ReactNode;
  accept?: string;
  onFileSelect?: (file: File | null) => void;
}

export const FileInput = React.forwardRef<HTMLDivElement, FileInputProps>(
  (
    {
      accept = "image/*",
      className,
      currentFileName,
      placeholder,
      children,
      onFileSelect,
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);

    const handleFile = React.useCallback(
      (file: File) => {
        onFileSelect?.(file);
      },
      [onFileSelect]
    );

    const onDrop = React.useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
          handleFile(file);
        }
      },
      [handleFile]
    );

    const onFileChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("e.target.files", e.target.files);
        const file = e.target.files?.[0];
        if (file) {
          handleFile(file);
        }
      },
      [handleFile]
    );

    return (
      <>
        <div
          ref={ref}
          className={cn(
            "relative flex h-[80px] w-full items-center rounded-md border border-dashed border-input bg-transparent p-4 text-sm shadow-sm transition-colors hover:border-accent",
            isDragging && "border-primary",
            className
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <input
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={onFileChange}
            accept={accept === "*" ? undefined : accept}
          />

          {currentFileName && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => onFileSelect?.(null)}
                  className="absolute -right-2 -top-2 z-10 rounded-full bg-destructive p-1 text-white hover:bg-destructive/90"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
                <div
                  className="h-12 w-12 rounded-full bg-cover bg-center bg-gray-100"
                  style={{
                    backgroundImage: `url(${currentFileName})`,
                  }}
                />
              </div>
            </div>
          )}
          <p className="text-muted-foreground w-full text-center">
            {placeholder ?? "Drag and drop an image or click to select"}
          </p>
        </div>
        {children}
      </>
    );
  }
);

FileInput.displayName = "FileInput";
