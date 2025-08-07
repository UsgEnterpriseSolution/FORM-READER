import { ImageZoom } from "~/components/ui/image-zoom";
import { Spinner } from "./ui/Spinner";

type ReviewImageProp = {
  images: string[];
};

export default function ReviewImage({ images }: ReviewImageProp) {
  return (
    <section className="space-y-2">
      <h3 className="text-lg">Image preview</h3>
      <p className="text-muted-foreground">Preview of the image uploaded</p>
      <div className="flex h-fit gap-4 border-2 border-dashed p-4 md:block md:space-y-4">
        {images.length > 0 ? (
          images.map((image, index) => (
            <ImageZoom zoomMargin={20} key={index}>
              <img src={image} className="w-[192px] rounded-md md:w-full" />
            </ImageZoom>
          ))
        ) : (
          <div className="flex w-full justify-center">
            <Spinner variant="circle" size={40} />
          </div>
        )}
      </div>
    </section>
  );
}
