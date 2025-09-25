import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useActions, useConfigDetails } from "~/zustand";

export default function ConfigDetails() {
  const details = useConfigDetails();
  const { setConfigDetails } = useActions();

  return (
    <div className="space-y-3">
      <Label className="block space-y-2">
        <p className="text-muted-foreground">Title</p>
        <Input
          type="text"
          id="title"
          name="title"
          placeholder="eg: Bank - Debit Card Form"
          defaultValue={details.title ?? ""}
          onChange={(e) => setConfigDetails("title", e.target.value)}
          required
        />
      </Label>

      <Label className="block space-y-2">
        <p className="text-muted-foreground">Description</p>
        <Textarea
          id="description"
          name="description"
          placeholder="eg: This form collects..."
          defaultValue={details.description ?? ""}
          onChange={(e) => setConfigDetails("description", e.target.value)}
          required
        />
      </Label>

      <Label className="block space-y-2">
        <p className="text-muted-foreground">Form Code</p>
        <Input
          type="text"
          id="formCode"
          name="formCode"
          placeholder="eg: 0000"
          defaultValue={details.formCode ?? ""}
          onChange={(e) => setConfigDetails("formCode", e.target.value)}
          required
        />
      </Label>
    </div>
  );
}
