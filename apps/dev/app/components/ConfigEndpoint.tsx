import { useActions, useConfigEndpoint } from "~/zustand";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

type ConfigEndpointProps = {};

export default function ConfigEndpoint(props: ConfigEndpointProps) {
  const endpoint = useConfigEndpoint();
  const { setConfigEndpoint } = useActions();

  return (
    <div className="space-y-2">
      <input type="hidden" name="endpoint" value={JSON.stringify(endpoint)} />

      <Label className="block space-y-2">
        <p className="text-muted-foreground">Endpoint url</p>
        <Input
          type="text"
          id="endpoint"
          name="endpoint"
          placeholder="eg: localhost:8000/api/cbm"
          defaultValue={endpoint.url ?? ""}
          onChange={(e) =>
            setConfigEndpoint({ key: "url", value: e.target.value })
          }
          required
        />
      </Label>

      <EndpointHeaders />
    </div>
  );
}

type EndpointHeadersProps = {};

function EndpointHeaders(props: EndpointHeadersProps) {
  const endpoint = useConfigEndpoint();
  const { setConfigEndpoint } = useActions();

  const headers = endpoint.headers ?? [];

  const addHeader = () =>
    setConfigEndpoint({
      key: "headers",
      value: [...headers, { key: "", value: "" }],
    });

  const updateHeader = (
    idx: number,
    k: keyof (typeof headers)[number],
    val: string,
  ) => {
    const next = headers.map((h, i) => (i === idx ? { ...h, [k]: val } : h));
    setConfigEndpoint({ key: "headers", value: next });
  };

  const removeHeader = (idx: number) =>
    setConfigEndpoint({
      key: "headers",
      value: headers.filter((_, i) => i !== idx),
    });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h6 className="text-muted-foreground text-sm font-medium">
          Endpoint headers <span className="text-red-500">*</span>
        </h6>
        <Button
          type="button"
          variant={"outline"}
          size={"icon"}
          onClick={addHeader}
        >
          <Plus />
        </Button>
      </div>

      {headers.length === 0 && (
        <p className="text-muted-foreground text-sm">No headers yet.</p>
      )}

      {headers.map((h, idx) => (
        <div key={idx} className="flex items-end gap-2">
          <Button
            type="button"
            className="aspect-square"
            variant="outline"
            size="icon"
            onClick={() => removeHeader(idx)}
          >
            <Trash2 className="stroke-red-500" />
          </Button>

          <Label className="block space-y-2">
            <p className="text-muted-foreground">
              Label <span className="text-red-500">*</span>
            </p>
            <Input
              type="text"
              placeholder="eg: Authorization"
              value={h.key}
              onChange={(e) => updateHeader(idx, "key", e.target.value)}
              required
            />
          </Label>

          <Label className="block space-y-2">
            <p className="text-muted-foreground">
              Value <span className="text-red-500">*</span>
            </p>
            <Input
              type="text"
              placeholder="eg: Bearer TOKEN"
              value={h.value}
              onChange={(e) => updateHeader(idx, "value", e.target.value)}
              required
            />
          </Label>
        </div>
      ))}
    </div>
  );
}
