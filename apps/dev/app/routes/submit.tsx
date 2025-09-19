import { href, redirect, useNavigate, useSearchParams } from "react-router";
import { BadgeAlert, BadgeCheck, BadgeX, Eye } from "lucide-react";

import type { Route } from "./+types/submit";
import { Button } from "~/components/ui/button";
import CopyField from "~/components/CopyField";
import type { AppResponse } from "~/types";
import Data from "~/logic/data";

export async function loader({
  params,
  request,
}: Route.LoaderArgs): Promise<AppResponse<string> | Response> {
  const url = new URL(request.url);

  try {
    const dataRef = params.dataRef;
    if (!dataRef) {
      return redirect(href("/") + url.search);
    }

    const isValid = await Data.isValid(dataRef);
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
      data: dataRef,
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
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const handleView = () => {
    navigate(href("/data") + `?${search}`);
  };

  return (
    <section className="mx-4 mt-10 flex h-fit max-w-[400px] flex-col items-center gap-4 rounded-md border-2 border-dashed p-4 sm:mx-auto">
      <div className="w-full space-y-2">
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

      <CopyField value={params.dataRef ?? ""} />

      <Button className="w-full" variant="outline" onClick={handleView}>
        <Eye />
        <span>View data logs</span>
      </Button>
    </section>
  );
}
