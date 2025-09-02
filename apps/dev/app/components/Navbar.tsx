import { useEffect, useState } from "react";
import { Settings, Sparkles } from "lucide-react";
import { href, NavLink, useBlocker, useNavigate } from "react-router";

import Stepper from "./Stepper";
import HomeBlockerModel from "./HomeBlockerModel";
import { Button } from "./ui/button";
import ReviewSubmitModal from "./ReviewSubmitModal";

export default function Navbar() {
  const [path, setPath] = useState<string>();
  const navigate = useNavigate();
  let pathname = "/";

  const homePageBlocker = useBlocker(({ nextLocation, currentLocation }) => {
    if (
      currentLocation.pathname.includes("/review/") &&
      nextLocation.pathname === href("/")
    ) {
      return true;
    }

    return false;
  });

  try {
    pathname = window.location.pathname;
  } catch (error) {
    console.error("Window not defined.");
  }

  useEffect(() => {
    setPath(window.location.pathname);
  }, [pathname]);

  return (
    <header className="border-b px-4 md:px-6">
      {homePageBlocker.state === "blocked" && (
        <HomeBlockerModel blocker={homePageBlocker} />
      )}

      <div className="flex h-16 items-center justify-between gap-4">
        {path?.includes("/review/") ? (
          <Button variant="secondary" onClick={() => navigate(href("/"))}>
            Back
          </Button>
        ) : (
          <NavLink to={href("/")} className="cursor-pointer">
            <Sparkles />
          </NavLink>
        )}

        <div className="flex gap-6">
          <Stepper index={1} isActive={path === href("/")}>
            Upload
          </Stepper>
          <Stepper index={2} isActive={path?.includes("/review/")}>
            Review
          </Stepper>
          <Stepper index={3} isActive={path === href("/submit")}>
            Submit
          </Stepper>
        </div>

        {path?.includes("/review/") ? (
          <ReviewSubmitModal />
        ) : (
          <NavLink to={href("/config")} className="cursor-pointer">
            <Settings />
          </NavLink>
        )}
      </div>
    </header>
  );
}
