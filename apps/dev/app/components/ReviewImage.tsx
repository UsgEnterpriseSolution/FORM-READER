import { ImageZoom } from "~/components/ui/image-zoom";
import { cn } from "~/lib/utils";
import { ImageCarousel } from "./ImageCarousel";
import ImagePreview from "./ImagePreview";

type ReviewImageProp = {
  images: string[];
  className?: string;
};

export default function ReviewImage({ images, className }: ReviewImageProp) {
  return (
    <section className={cn(className)}>
      <ImageCarousel className="hidden md:block" images={images} />
      <ImagePreview images={images} />
    </section>
  );
}
