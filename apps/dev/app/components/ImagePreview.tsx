import { cn } from "~/lib/utils";
import { ImageZoom } from "./ui/image-zoom";

type ImagePreviewProps = {
  images: string[];
  className?: string;
};

export default function ImagePreview({ images, className }: ImagePreviewProps) {
  return (
    <div
      className={cn(
        "flex h-fit gap-4 border-2 border-dashed p-4 md:hidden md:space-y-4",
      )}
    >
      {images.map((image, index) => (
        <ImageZoom zoomMargin={20} key={index}>
          <img src={image} className="w-[192px] rounded-md md:w-full" />
        </ImageZoom>
      ))}
    </div>
  );
}
