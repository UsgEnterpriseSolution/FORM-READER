import { Outlet, useNavigation } from "react-router";
import AppSpinner from "~/components/AppSpinner";
import Navbar from "~/components/Navbar";
import { Toaster } from "~/components/ui/sonner";

export default function AppLayout() {
  const navigation = useNavigation();

  return (
    <main className="mx-auto h-full max-w-[1280px]">
      <Navbar />
      <Outlet />
      <Toaster richColors position="top-center" />
      {navigation.state === "loading" && <AppSpinner />}
    </main>
  );
}
