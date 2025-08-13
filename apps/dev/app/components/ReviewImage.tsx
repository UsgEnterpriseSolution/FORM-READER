import { ImageZoom } from "~/components/ui/image-zoom";
import { cn } from "~/lib/utils";
import { ImageCarousel } from "./ImageCarousel";

type ReviewImageProp = {
  images: string[];
  className?: string;
};

export default function ReviewImage({ images, className }: ReviewImageProp) {
  return (
    <section className={cn(className)}>
      <ImageCarousel className="hidden md:block" images={images} />

      <div className="flex h-fit gap-4 border-2 border-dashed p-4 md:hidden md:space-y-4">
        {images.map((image, index) => (
          <ImageZoom zoomMargin={20} key={index}>
            <img src={image} className="w-[192px] rounded-md md:w-full" />
          </ImageZoom>
        ))}
      </div>
    </section>
  );
}
