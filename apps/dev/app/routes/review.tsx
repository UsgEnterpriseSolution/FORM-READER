import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { href, redirect } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import { fieldDataSchema, imgFieldDataSchema } from "~/zod";
import type { Route } from "./+types/review";

import ReviewForm from "~/components/ReviewForm";
import ReviewImage from "~/components/ReviewImage";
import { Button } from "~/components/ui/button";
import { AppCache } from "~/services/cache";
import type { AppResponse, FieldData, ImgFieldData } from "~/types";

export async function action({}: Route.ActionArgs) {
  await new Promise((res) => setTimeout(res, 3000));

  return redirect(href("/submit"));
}

export async function loader({
  params,
}: Route.LoaderArgs): Promise<Response | AppResponse<ImgFieldData>> {
  try {
    const cacheKey = params.key;

    if (cacheKey === undefined || !AppCache.has(cacheKey)) {
      return redirect(href("/"));
    }

    return {
      status: "success",
      data: AppCache.get(cacheKey) as ImgFieldData,
    };
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
    };
  }
}

export default function Review({ loaderData }: Route.ComponentProps) {
  const [fieldData, setFieldData] = useState<FieldData | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof fieldDataSchema>>({
    resolver: zodResolver(fieldDataSchema),
    defaultValues: fieldData,
  });

  useEffect(() => {
    if (loaderData && loaderData.status === "success") {
      const zodObj = imgFieldDataSchema.safeParse(loaderData.data);

      if (!zodObj.success) {
        toast.error("Response data validation failed.");
      } else {
        const data = zodObj.data;
        console.log(data);

        setImages(data.images);
        setFieldData(data.fieldData);
        toast.success("Image(s) processed successfully.");
      }
    }

    if (loaderData && loaderData.status === "fail") {
      toast.warning(loaderData.message);
    }

    if (loaderData && loaderData.status === "error") {
      toast.error(loaderData.message);
    }
  }, [loaderData.status]);

  return (
    <section id="Review" className="space-y-4 px-4 py-6">
      <div className="mx-auto flex h-fit max-w-[814px] justify-between">
        <Button variant="secondary">Back</Button>
        <Button type="submit" form="review-form" variant="default">
          Submit
        </Button>
      </div>
      <div className="grid max-w-[814px] grid-cols-1 place-content-center gap-6 md:mx-auto md:grid-cols-2">
        <ReviewImage images={images} />
        <ReviewForm hookForm={form} />
      </div>
    </section>
  );
}
