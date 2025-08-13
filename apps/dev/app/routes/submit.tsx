import { href, useBlocker, useNavigate } from "react-router";
import { BadgeCheck, FilePlus } from "lucide-react";

import type { Route } from "./+types/submit";
import { Button } from "~/components/ui/button";
import { useAppStore } from "~/zustand/store";
import ReviewBlockerModel from "~/components/ReviewBlockerModal";

export function clientLoader() {
  useAppStore.setState(() => ({
    state: {
      images: [],
      fieldData: undefined,
      settings: { engine: null, configId: null },
    },
  }));
}

export default function Submit({}: Route.ComponentProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(href("/"));
  };

  const blocker = useBlocker(({ nextLocation }) =>
    nextLocation.pathname.includes("/review"),
  );

  return (
    <section className="mx-4 mt-10 flex h-fit max-w-[608px] flex-col items-center justify-center gap-6 rounded-md border-2 border-dashed p-4 sm:mx-auto">
      {blocker.state === "blocked" && <ReviewBlockerModel blocker={blocker} />}

      <div className="flex flex-col items-center justify-center gap-2">
        <BadgeCheck size={40} className="stroke-green-400" />
        <h3>Entries submitted successfully</h3>
      </div>

      <Button variant="default" onClick={handleClick}>
        <FilePlus />
        <span>New document</span>
      </Button>
    </section>
  );
}
