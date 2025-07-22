import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { href } from "react-router";

import Stepper from "./Stepper";

export default function Navbar() {
  const [path, setPath] = useState<string>();
  let pathname = "/";

  try {
    pathname = window.location.pathname;
  } catch (error) {
    console.error(error);
  }

  useEffect(() => {
    setPath(window.location.pathname);
  }, [pathname]);

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles />
          <span className="font-medium">AI Extractor</span>
        </div>

        <div className="flex gap-6">
          <Stepper index={1} isActive={path === href("/")}>
            Upload
          </Stepper>
          <Stepper index={2} isActive={path === href("/review")}>
            Review
          </Stepper>
          <Stepper index={3} isActive={path === href("/submit")}>
            Submit
          </Stepper>
        </div>
      </div>
    </header>
  );
}
