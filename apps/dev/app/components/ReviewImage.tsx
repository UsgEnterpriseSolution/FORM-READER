import { ImageZoom } from "~/components/ui/image-zoom";

type ReviewImageProp = {
  images: string[];
};

export default function ReviewImage({ images }: ReviewImageProp) {
  return (
    <section className="space-y-2">
      <p className="text-sm text-zinc-600">Preview</p>
      <div className="flex h-fit gap-4 border-2 border-dashed p-4 md:block md:space-y-4">
        {images.map((image, index) => (
          <ImageZoom key={index}>
            <img src={image} className="w-[192px] rounded-md md:w-full" />
          </ImageZoom>
        ))}
      </div>
    </section>
  );
}
