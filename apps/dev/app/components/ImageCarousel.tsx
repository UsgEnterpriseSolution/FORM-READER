"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { ImageZoom } from "./ui/image-zoom";
import { cn } from "~/lib/utils";

type ImageCarouselProps = {
  images: string[];
  className?: string;
};

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className={cn("mx-auto", className)}>
      <Carousel setApi={setApi} className="w-full space-y-4">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <ImageZoom zoomMargin={20} key={index}>
                <img src={image} className="w-[192px] rounded-md md:w-full" />
              </ImageZoom>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex w-full justify-between px-10">
          <CarouselPrevious />
          <div className="text-muted-foreground py-2 text-center text-sm">
            Slide {current} of {images.length}
          </div>
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
}
