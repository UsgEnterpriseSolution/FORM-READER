import { Outlet, useNavigation, useSearchParams } from "react-router";
import AppSpinner from "~/components/AppSpinner";
import AuthModal from "~/components/AuthModal";
import Navbar from "~/components/Navbar";
import NavMenu from "~/components/NavMenu";
import { Toaster } from "~/components/ui/sonner";

export default function AppLayout() {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const branchCode = searchParams.get("branchCode");
  const username = searchParams.get("username");
  const showAuthModal = !branchCode || !username;

  return (
    <>
      <Navbar />

      <main className="relative mx-auto max-w-[1280px]">
        {showAuthModal && <AuthModal />}

        <Outlet />
        <NavMenu />

        <Toaster richColors position="top-center" />
        {navigation.state === "loading" && <AppSpinner />}
      </main>
    </>
  );
}
