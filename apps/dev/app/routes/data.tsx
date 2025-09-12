import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { Route } from "./+types/data";
import { Button } from "~/components/ui/button";
import { Clipboard, Eye } from "lucide-react";
import Data from "~/logic/data";
import type { AppResponse, DataLog } from "~/types";
import { formateDate } from "~/utils/functions";
import Config from "~/logic/config";
import DataLogViewer from "~/components/DataLogViewer";
import DataLogSearch from "~/components/DataLogSearch";

export async function loader(): Promise<AppResponse<DataLog[]> | Response> {
  try {
    const data = await Data.getAll();
    if (!data) {
      return {
        status: "fail",
        message: "No data found",
        timestamp: Date.now(),
      };
    }

    const dataLogs: DataLog[] = [];
    for (const dataLog of data) {
      const configId = dataLog.configId;
      if (!configId) continue;

      dataLogs.push({
        id: dataLog.id,
        dataId: dataLog.dataId,
        formTitle: (await Config.title(configId)) ?? configId,
        extDate: dataLog.date_extracted,
        data: dataLog.data as { [k: PropertyKey]: any },
      });
    }

    return {
      status: "success",
      data: dataLogs,
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
      timestamp: Date.now(),
    };
  }
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <section className="space-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-medium">Data Logs </p>
        <DataLogSearch />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Extraction Date</TableHead>
            <TableHead>Data Id</TableHead>
            <TableHead>Config</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loaderData &&
            loaderData.status === "success" &&
            loaderData.data.map((item) => (
              <TableRow key={item.dataId}>
                <TableCell className="max-w-[100px]">
                  {formateDate(item.extDate)}
                </TableCell>
                <TableCell className="truncate">{item.dataId}</TableCell>
                <TableCell className="truncate">{item.formTitle}</TableCell>
                <TableCell>
                  <span className="space-x-2">
                    <Button variant="outline" size="icon">
                      <Clipboard />
                    </Button>

                    <DataLogViewer
                      dataId={item.dataId}
                      formTitle={item.formTitle}
                      extDate={item.extDate}
                      data={item.data}
                    >
                      <Button variant="outline" size="icon">
                        <Eye />
                      </Button>
                    </DataLogViewer>
                  </span>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </section>
  );
}
