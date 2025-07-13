import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import Upload from "~/components/Upload";

export default function Home({}: Route.ComponentProps) {
  return (
    <main className="mx-auto h-full max-w-[1280px]">
      <Navbar />
      <Upload />
    </main>
  );
}
