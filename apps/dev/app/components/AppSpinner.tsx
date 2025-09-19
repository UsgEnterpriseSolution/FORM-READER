import { LoaderCircle } from "lucide-react";

export default function AppSpinner() {
  return (
    <div className="bg-secondary/80 fixed inset-0 grid h-full w-full place-content-center">
      <LoaderCircle className="animate-spin" size={40} />
    </div>
  );
}
