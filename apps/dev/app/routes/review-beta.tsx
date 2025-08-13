import { ImageCarousel } from "~/components/ImageCarousel";
import ReviewImage from "~/components/ReviewImage";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function ReviewBeta() {
  return (
    <div className="max-height grid max-w-[814px] grid-cols-1 place-content-center gap-6 px-6 pt-6 md:mx-auto md:grid-cols-2">
      <div>
        <ImageCarousel
          className="hidden md:block"
          images={["/mock_form_A.jpg", "/mock_form_B.jpg"]}
        />
        <ReviewImage
          className="block md:hidden"
          images={["/mock_form_A.jpg", "/mock_form_B.jpg"]}
        />
      </div>

      <div className="space-y-2 overflow-y-scroll pb-4">
        <div>
          <h3 className="text-lg">Form data</h3>
          <p className="text-muted-foreground">
            Data written on image uploaded
          </p>
        </div>

        <div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
          <div>
            <Label>Example</Label>
            <Input type="input" placeholder="example" />
          </div>
        </div>
      </div>
    </div>
  );
}
