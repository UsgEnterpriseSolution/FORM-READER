import { useEffect, useState } from "react";
import { Settings, Sparkles } from "lucide-react";
import { href, NavLink } from "react-router";

import Stepper from "./Stepper";

export default function Navbar() {
  const [path, setPath] = useState<string>();
  let pathname = "/";

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
      <div className="flex h-16 items-center justify-between gap-4">
        <NavLink to={href("/")} className="cursor-pointer">
          <Sparkles />
        </NavLink>

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

        <NavLink to={href("/config")} className="cursor-pointer">
          <Settings />
        </NavLink>
      </div>
    </header>
  );
}
