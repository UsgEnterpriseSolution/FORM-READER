import { startTransition, useActionState, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useActions } from "~/zustand/store";
import DataLogViewer from "./DataLogViewer";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type DataLogSearchProps = {};

export default function DataLogSearch({}: DataLogSearchProps) {
  const [dataId, setDataId] = useState("");
  const { fetchDataLog } = useActions();

  const [data, getLog, isLoading] = useActionState(async () => {
    try {
      return await fetchDataLog(dataId);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else console.error(error as string);
    }
  }, null);

  useEffect(() => {
    if (data && data.status === "error") {
      toast.error(data.message);
    }

    if (data && data.status === "fail") {
      toast.warning(data.message);
    }
  }, [data]);

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Data ID: 7ff56659-47f6-4c31-934a-891c677bb73e"
        onChange={(e) => setDataId(e.target.value)}
        value={dataId}
        disabled={isLoading}
      />

      <Button
        disabled={isLoading || !dataId}
        onClick={() => startTransition(() => getLog())}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <p>View</p>}
      </Button>

      {!isLoading && data && data.status === "success" && (
        <DataLogViewer
          open={true}
          dataId={data.data.dataId}
          formTitle={data.data.formTitle}
          extDate={data.data.extDate}
          data={data.data.data}
        />
      )}
    </div>
  );
}
