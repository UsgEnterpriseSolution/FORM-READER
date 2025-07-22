import { useEffect, useState } from "react";
import { Form } from "react-router";
import { FileIcon, UploadIcon } from "lucide-react";

import type { Route } from "./+types/upload";
import type { ActionRes, UploadActionRes } from "~/types";
import { formatBytes, useFileUpload } from "~/hooks/useFileUpload";

import { Button } from "~/components/ui/button";
import UploadTable from "~/components/UploadTable";
import UploadError from "~/components/UploadErrors";
import UploadDesc from "~/components/UploadDesc";
import useUploadActionData from "~/hooks/useUploadActionData";
import { convertToDataUrl } from "~/utils/functions";

export async function action({
  request,
}: Route.ActionArgs): Promise<ActionRes<UploadActionRes>> {
  await new Promise((res) => setTimeout(res, 3000));

  const formData = await request.formData();
  const images: string[] = JSON.parse(formData.get("images") as string);

  return {
    status: "fail",
    message: "This is just a test.",
  };
}

export default function Upload({ actionData }: Route.ComponentProps) {
  useUploadActionData(actionData);

  const maxSize = 10 * 1024 * 1024;
  const maxFiles = 10;

  const [imgUrls, setImgUrls] = useState<string>("");
  const [{ files, isDragging, errors }, actions] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: "image/*",
  });

  useEffect(() => {
    async function convertToFile(files: File[]) {
      const imgDataUrls = await Promise.all(files.map(convertToDataUrl));
      setImgUrls(JSON.stringify(imgDataUrls));
    }

    convertToFile(files.map((fileObj) => fileObj.file as File));
  }, [files]);

  return (
    <section className="mx-4 flex h-fit max-w-[608px] flex-col gap-4 pt-10 sm:mx-auto">
      <Form
        id="image-form"
        method="POST"
        encType="multipart/form-data"
        onDragEnter={actions.handleDragEnter}
        onDragLeave={actions.handleDragLeave}
        onDragOver={actions.handleDragOver}
        onDrop={actions.handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-56 flex-col items-center border-2 border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] data-[files]:hidden"
      >
        <input
          {...actions.getInputProps({ name: "image" })}
          className="sr-only"
          aria-label="Upload files"
        />
        <input type="hidden" name="images" value={imgUrls} />
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
            onClick={actions.openFileDialog}
          >
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Select files
          </Button>
        </div>
      </Form>

      {files.length > 0 && (
        <UploadTable
          files={files}
          openFileDialog={actions.openFileDialog}
          clearFiles={actions.clearFiles}
          removeFile={actions.removeFile}
        />
      )}

      {errors.length > 0 && <UploadError error={errors[0]} />}

      {files.length === 0 && <UploadDesc />}
    </section>
  );
}
