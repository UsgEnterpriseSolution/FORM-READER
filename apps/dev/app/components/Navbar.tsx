import { Sparkles } from "lucide-react";

import Progress from "./Progress";

export default function Navbar() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles />
          <span className="font-medium">AI Extractor</span>
        </div>

        <Progress />
      </div>
    </header>
  );
}
