import { Spinner } from "./ui/Spinner";

export default function AppSpinner() {
  return (
    <div className="bg-secondary/80 fixed inset-0 grid h-full w-full place-content-center">
      <Spinner variant="circle" size={40} />
    </div>
  );
}
