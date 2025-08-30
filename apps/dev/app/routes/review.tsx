import { useEffect, useState } from "react";
import { href, redirect } from "react-router";

import type { Route } from "./+types/review";

import ReviewImage from "~/components/ReviewImage";
import { appCache, type AppCache } from "~/services/cache";
import type { AppResponse, ReviewLoaderRes } from "~/types";
import Config from "~/logic/config";
import ReviewForm from "~/components/ReviewForm";
import type { SelectConfig } from "~/db/schema/tbConfig";
import { Spinner } from "~/components/ui/Spinner";
import useAppToast from "~/hooks/useAppToast";

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
        message: "Image(s) processed successfully.",
        data: {
          images: cacheData.images,
          config: await Config.get(cacheData.configId),
          fieldData: cacheData.fieldData,
        },
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
      timestamp: Date.now(),
    };
  }
}

export default function Review({ loaderData }: Route.ComponentProps) {
  const [config, setConfig] = useState<SelectConfig | undefined>();
  const [images, setImages] = useState<string[]>([]);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (loaderData && loaderData.status === "success") {
      if (loaderData.data.config) setConfig(loaderData.data.config);
      if (loaderData.data.images) setImages(loaderData.data.images);
      if (loaderData.data.fieldData) setData(loaderData.data.fieldData);
    }
  }, [loaderData.timestamp]);

  useAppToast(loaderData);

  return (
    <div className="max-height grid max-w-[816px] grid-cols-1 gap-6 px-6 pt-6 md:mx-auto md:grid-cols-[296px_1fr]">
      {images.length > 0 ? (
        <ReviewImage images={images} className="" />
      ) : (
        <div className="flex w-full justify-center">
          <Spinner variant="circle" size={40} />
        </div>
      )}
      {config ? (
        <ReviewForm config={config} data={data} className="space-y-2 pb-4" />
      ) : (
        <div className="flex w-full justify-center">
          <Spinner variant="circle" size={40} />
        </div>
      )}
    </div>
  );
}
