import { href, redirect, useBlocker, useNavigate } from "react-router";
import { BadgeAlert, BadgeCheck, BadgeX, Eye, FilePlus } from "lucide-react";

import type { Route } from "./+types/submit";
import { Button } from "~/components/ui/button";
import ReviewBlockerModel from "~/components/ReviewBlockerModal";
import CopyField from "~/components/CopyField";
import type { AppResponse } from "~/types";
import Data from "~/logic/data";

export async function loader({
  params,
}: Route.LoaderArgs): Promise<AppResponse<string> | Response> {
  try {
    const dataId = params.dataId;

    if (!dataId) {
      return redirect(href("/"));
    }

    const isValid = await Data.isValidId(dataId);
    console.log("isValid", isValid);
    if (!isValid) {
      return {
        status: "fail",
        message: "Data submission failed",
        timestamp: Date.now(),
      };
    }

    return {
      status: "success",
      message: "Data submitted successfully",
      data: dataId,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
      timestamp: Date.now(),
    };
  }
}

export default function Submit({ params, loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const handleNewDoc = () => {
    navigate(href("/"));
  };

  const handleView = () => {
    navigate(href("/data/:dataId?", { dataId: params.dataId }));
  };

  const blocker = useBlocker(({ nextLocation }) =>
    nextLocation.pathname.includes("/review"),
  );

  return (
    <section className="mx-4 mt-10 flex h-fit max-w-[608px] flex-col items-center gap-6 rounded-md border-2 border-dashed p-4 sm:mx-auto">
      {blocker.state === "blocked" && <ReviewBlockerModel blocker={blocker} />}

      <div className="flex w-full items-center justify-between">
        {loaderData && loaderData.status === "success" && (
          <div className="flex items-center gap-2">
            <BadgeCheck size={18} className="stroke-green-400" />
            <p className="text-sm">Success</p>
          </div>
        )}

        {loaderData && loaderData.status === "fail" && (
          <div className="flex items-center gap-2">
            <BadgeX size={18} className="stroke-yellow-400" />
            <p className="text-sm">Failed</p>
          </div>
        )}

        {loaderData && loaderData.status === "error" && (
          <div className="flex items-center gap-2">
            <BadgeAlert size={18} className="stroke-red-400" />
            <p className="text-sm">Error</p>
          </div>
        )}

        <p className="text-muted-foreground text-sm">{loaderData?.message}</p>
      </div>

      <CopyField value={params.dataId ?? ""} />

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleNewDoc}>
          <FilePlus />
          <span>New document</span>
        </Button>

        <Button variant="default" onClick={handleView}>
          <Eye />
          <span>View submission</span>
        </Button>
      </div>
    </section>
  );
}
