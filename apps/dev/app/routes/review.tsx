import { useEffect, useState } from "react";
import { toast } from "sonner";
import { href, redirect, useBlocker, useNavigate } from "react-router";

import type { Route } from "./+types/review";

import ReviewImage from "~/components/ReviewImage";
import { Button } from "~/components/ui/button";
import { appCache, type AppCache } from "~/services/cache";
import type { AppResponse, ReviewLoaderRes } from "~/types";
import Config from "~/logic/config";
import ReviewForm from "~/components/ReviewForm";
import type { SelectConfig } from "~/db/schema/tbConfig";
import ReviewBackModal from "~/components/ReviewBackModal";
import ReviewSubmitModal from "~/components/ReviewSubmitModal";

export async function action({}: Route.ActionArgs) {
  await new Promise((res) => setTimeout(res, 3000));

  return redirect(href("/submit"));
}

export async function loader({
  params,
}: Route.LoaderArgs): Promise<Response | AppResponse<ReviewLoaderRes>> {
  try {
    const cacheKey = params.key;

    if (cacheKey === undefined || !appCache.has(cacheKey)) {
      return redirect(href("/"));
    } else {
      const cacheData = appCache.get(cacheKey) as AppCache;

      return {
        status: "success",
        data: {
          images: cacheData.images,
          config: await Config.get(cacheData.configId),
          fieldData: cacheData.fieldData,
        },
      };
    }
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
    };
  }
}

export default function Review({ loaderData }: Route.ComponentProps) {
  const [config, setConfig] = useState<SelectConfig | undefined>();
  const [images, setImages] = useState<string[]>([]);
  const [data, setData] = useState<any>({});
  const navigate = useNavigate();

  const backBlocker = useBlocker(
    ({ nextLocation }) => nextLocation.pathname === href("/"),
  );

  useEffect(() => {
    if (loaderData && loaderData.status === "success") {
      if (loaderData.data.config) setConfig(loaderData.data.config);
      if (loaderData.data.images) setImages(loaderData.data.images);
      if (loaderData.data.fieldData) setData(loaderData.data.fieldData);

      toast.success("Image(s) processed successfully.");
    }

    if (loaderData && loaderData.status === "fail") {
      toast.warning(loaderData.message);
    }

    if (loaderData && loaderData.status === "error") {
      toast.error(loaderData.message);
    }

    console.log(loaderData);
  }, [loaderData.status]);

  return (
    <section id="Review" className="space-y-4 px-4 py-6">
      {backBlocker.state === "blocked" && (
        <ReviewBackModal blocker={backBlocker} />
      )}

      <div className="mx-auto flex h-fit max-w-[814px] justify-between">
        <Button variant="secondary" onClick={() => navigate(href("/"))}>
          Back
        </Button>
        <ReviewSubmitModal />
      </div>

      <div className="grid max-w-[814px] grid-cols-1 place-content-center gap-6 md:mx-auto md:grid-cols-2">
        <ReviewImage images={images} />
        <ReviewForm config={config} data={data} />
      </div>
    </section>
  );
}
