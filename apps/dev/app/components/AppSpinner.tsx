import { Spinner } from "./ui/Spinner";

export default function AppSpinner() {
  return (
    <div className="bg-foreground/80 absolute inset-0 grid h-full w-full place-content-center">
      <Spinner variant="circle" className="stroke-secondary" size={40} />
    </div>
  );
}
