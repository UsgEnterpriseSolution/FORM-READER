import { InfoIcon } from "lucide-react";

type UploadDescProps = {};

export default function UploadDesc({}: UploadDescProps) {
  return (
    <div className="dark bg-muted text-foreground flex items-center justify-center gap-2 px-4 py-3 text-sm">
      <InfoIcon
        className="stroke-3 text-blue-500"
        size={16}
        aria-hidden="true"
      />
      <p>All images uploaded will be treated as part of a single form entry </p>
    </div>
  );
}
