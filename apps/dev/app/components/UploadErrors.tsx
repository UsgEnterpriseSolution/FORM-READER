import { AlertCircleIcon } from "lucide-react";

type UploadErrorProps = {
  error: string;
};

export default function UploadError({ error }: UploadErrorProps) {
  return (
    <div
      className="text-destructive flex items-center gap-1 text-xs"
      role="alert"
    >
      <AlertCircleIcon className="size-3 shrink-0" />
      <span>{error}</span>
    </div>
  );
}
