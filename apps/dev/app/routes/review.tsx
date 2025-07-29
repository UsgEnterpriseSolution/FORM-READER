import { z } from "zod";
import { useForm } from "react-hook-form";
import { href, redirect } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import { fieldDataSchema } from "~/zod";
import type { Route } from "./+types/review";
import { useAppStore, useFieldData, useImages } from "~/zustand/store";

import ReviewForm from "~/components/ReviewForm";
import ReviewImage from "~/components/ReviewImage";
import { Button } from "~/components/ui/button";

export async function action({}: Route.ActionArgs) {
  await new Promise((res) => setTimeout(res, 3000));

  return redirect(href("/submit"));
}

export function clientLoader({}: Route.ClientLoaderArgs) {
  const store = useAppStore.getState();

  if (store.state.images.length === 0 || store.state.fieldData === undefined) {
    return redirect(href("/"));
  }
}

export default function Review({}: Route.ComponentProps) {
  const fieldData = useFieldData();
  const images = useImages();

  const form = useForm<z.infer<typeof fieldDataSchema>>({
    resolver: zodResolver(fieldDataSchema),
    defaultValues: fieldData,
  });

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
