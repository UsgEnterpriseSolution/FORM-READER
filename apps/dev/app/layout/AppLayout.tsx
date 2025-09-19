import { Outlet, useNavigation } from "react-router";
import AppSpinner from "~/components/AppSpinner";
import Navbar from "~/components/Navbar";
import NavMenu from "~/components/NavMenu";
import { Toaster } from "~/components/ui/sonner";

export default function AppLayout() {
  const navigation = useNavigation();

  return (
    <main className="relative mx-auto h-full max-w-[1280px]">
      <Navbar />
      <Outlet />
      <NavMenu />
      <Toaster richColors position="top-center" />
      {navigation.state === "loading" && <AppSpinner />}
    </main>
  );
}
