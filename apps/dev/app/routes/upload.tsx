import type { Route } from "./+types/upload";
import { FileIcon, UploadIcon } from "lucide-react";
import { formatBytes, useFileUpload } from "~/hooks/use-file-upload";
import { Button } from "~/components/ui/button";
import { Form, href } from "react-router";
import UploadTable from "~/components/UploadTable";
import UploadError from "~/components/UploadErrors";
import UploadDesc from "~/components/UploadDesc";

export default function Upload({}: Route.ComponentProps) {
  const maxSize = 10 * 1024 * 1024; // 10MB default
  const maxFiles = 10;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: "image/*",
  });

  return (
    <section className="mx-4 flex h-fit max-w-[608px] flex-col gap-4 pt-10 sm:mx-auto">
      <Form
        id="image-form"
        method="POST"
        action={href("/review")}
        encType="multipart/form-data"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-56 flex-col items-center border-2 border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] data-[files]:hidden"
      >
        <input
          {...getInputProps({ name: "images" })}
          className="sr-only"
          aria-label="Upload files"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FileIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload files</p>
          <p className="text-muted-foreground text-xs">
            Max {maxFiles} files ∙ Up to {formatBytes(maxSize)}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={openFileDialog}
          >
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Select files
          </Button>
        </div>
      </Form>

      {files.length > 0 && (
        <UploadTable
          files={files}
          openFileDialog={openFileDialog}
          clearFiles={clearFiles}
          removeFile={removeFile}
        />
      )}

      {errors.length > 0 && <UploadError error={errors[0]} />}

      {files.length === 0 && <UploadDesc />}
    </section>
  );
}
