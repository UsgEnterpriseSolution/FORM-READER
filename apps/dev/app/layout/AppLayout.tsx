import { Outlet } from "react-router";
import Navbar from "~/components/Navbar";

export default function AppLayout() {
  return (
    <main className="mx-auto h-full max-w-[1280px]">
      <Navbar />
      <Outlet />
    </main>
  );
}
