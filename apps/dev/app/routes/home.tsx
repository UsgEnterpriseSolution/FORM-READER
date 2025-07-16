import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import Upload from "~/components/Upload";
import DataTable from "~/components/DataTable";
import { Button } from "~/components/ui/button";
import { BadgeCheck } from "lucide-react";

export default function Home({}: Route.ComponentProps) {
  return (
    <main className="mx-auto h-full max-w-[1280px]">
      <Navbar />
      {/* <DocUpload /> */}
      {/* <DocReview /> */}
      <DocSubmit />
    </main>
  );
}

function DocUpload() {
  return <Upload />;
}

function DocReview() {
  return (
    <section className="space-y-4 px-4 py-6">
      <div className="flex h-fit justify-between">
        <Button variant="link">Back</Button>
        <Button variant="default">Submit (3)</Button>
      </div>

      <div className="mx-auto grid max-w-[608px] grid-cols-1 gap-4 lg:mx-0 lg:max-w-full lg:grid-cols-2">
        <DataTable />
        <DataTable />
        <DataTable />
      </div>
    </section>
  );
}

function DocSubmit() {
  return (
    <section className="mx-4 mt-10 flex h-fit max-w-[608px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 sm:mx-auto">
      <BadgeCheck size={40} className="stroke-green-400" />
      <h3>Entries submitted successfully</h3>
    </section>
  );
}
