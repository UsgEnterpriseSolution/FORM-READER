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
import { Eye } from "lucide-react";
import Data from "~/logic/data";
import type { AppResponse } from "~/types";
import type { SelectData } from "~/db/schema/tbData";
import { href, useNavigate } from "react-router";

export async function action({ params }: Route.ActionArgs) {
  try {
    const { dataId } = params;
    if (!dataId) {
      return {
        status: "fail",
        message: "No data ID provided",
        timestamp: Date.now(),
      };
    }

    const data = await Data.get(dataId);
    if (!data) {
      return {
        status: "fail",
        message: "No data found",
        timestamp: Date.now(),
      };
    }

    return {
      status: "success",
      data: [data],
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
      timestamp: Date.now(),
    };
  }
}

export async function loader({
  params,
}: Route.LoaderArgs): Promise<AppResponse<SelectData[]> | Response> {
  try {
    if (params.dataId) {
      const data = await Data.get(params.dataId);
      if (!data) {
        return {
          status: "fail",
          message: "No data found",
          timestamp: Date.now(),
        };
      }

      return {
        status: "success",
        data: [data],
        timestamp: Date.now(),
      };
    }

    const data = await Data.getAll();
    if (!data) {
      return {
        status: "fail",
        message: "No data found",
        timestamp: Date.now(),
      };
    }

    return {
      status: "success",
      data,
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
  const navigate = useNavigate();

  return (
    <section className="space-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-medium">Data Logs </p>

        <Button onClick={() => navigate(href("/data/:dataId?"))}>
          View All
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>Data Id</TableHead>
            <TableHead>Config Id</TableHead>
            <TableHead>Extraction Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loaderData &&
            loaderData.status === "success" &&
            loaderData.data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="bg-primary text-secondary grid size-8 place-content-center rounded-full">
                    {index + 1}
                  </div>
                </TableCell>
                <TableCell className="max-w-[140px] truncate">
                  {item.dataId}
                </TableCell>
                <TableCell className="max-w-[140px] truncate">
                  {item.configId}
                </TableCell>
                <TableCell>{item.date_extracted}</TableCell>
                <TableCell>
                  <Button variant="default">
                    <Eye />
                    <span>View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </section>
  );
}
