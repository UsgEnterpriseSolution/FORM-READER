import { FileIcon, UploadIcon } from "lucide-react";

import {
  formatBytes,
  type FileUploadActions,
  type FileWithPreview,
} from "~/hooks/useFileUpload";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { convertToDataUrl } from "~/utils/functions";
import { useActions } from "~/zustand";

type UploadImageProps = {
  actions: FileUploadActions;
  isDragging: boolean;
  files: FileWithPreview[];
  maxFiles: number;
  maxSize: number;
};

export default function UploadImage({
  actions,
  isDragging,
  files,
  maxFiles,
  maxSize,
}: UploadImageProps) {
  const [imgUrls, setImgUrls] = useState<string>("");
  const { setSettings } = useActions();

  useEffect(() => {
    async function convertToFile(files: File[]) {
      const imgDataUrls = await Promise.all(files.map(convertToDataUrl));
      setImgUrls(JSON.stringify(imgDataUrls));
      setSettings({ key: "imgCount", value: files.length });
    }

    convertToFile(files.map((fileObj) => fileObj.file as File));
  }, [files]);

  return (
    <div
      onDragEnter={actions.handleDragEnter}
      onDragLeave={actions.handleDragLeave}
      onDragOver={actions.handleDragOver}
      onDrop={actions.handleDrop}
      data-dragging={isDragging || undefined}
      data-files={files.length > 0 || undefined}
      className="bg-background border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-56 flex-col items-center justify-center rounded-md p-4 transition-colors has-[input:focus]:ring-[3px]"
    >
      <input
        {...actions.getInputProps({ name: "image" })}
        className="sr-only"
        aria-label="Upload files"
      />

      <input type="hidden" name="images" value={imgUrls} required />

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
    </div>
  );
}
