import { Button } from "~/components/ui/button";
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import type { Route } from "./+types/config-beta";
import type { AppResponse, ConfigLoaderRes } from "~/types";
import Config from "~/logic/config";
import ConfigEditor from "~/components/ConfigEditor";

export async function action({ request }: Route.ActionArgs) {
  try {
    // await new Promise((res) => setTimeout(res, 2000));
    const formData = await request.formData();
    const configTitle = formData.get("title") as string | null;
    const configDescription = formData.get("description") as string | null;
    const fields = formData.getAll("field") as string[] | null;

    console.log({ configTitle, configDescription, fields });

    // switch (request.method.toUpperCase()) {
    //   case "POST":
    //   case "PUT":
    //   case "DELETE":
    //   default:
    //     return {
    //       code: 500,
    //       status: "fail",
    //       message: "Invaild HTTP verb.",
    //     };
    // }
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
    };
  }
}

export async function loader(): Promise<AppResponse<ConfigLoaderRes>> {
  try {
    const configs = await Config.getAll();

    if (configs === null) {
      throw new Error("Failed to load configs");
    }

    return {
      status: "success",
      data: configs.map((config) => ({
        configId: config.configId,
        title: config.title,
        description: config.description,
        lastUpdated: "00/00/2025",
      })),
    };
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
    };
  }
}

export default function ConfigBeta({ loaderData }: Route.ComponentProps) {
  return (
    <section className="space-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-medium">Configurations</p>

        <ConfigEditor
          mode="CREATE"
          title="Add Form"
          description="Complete the fields below to add the new form to the app."
        >
          <Button>
            <CirclePlus />
            <p>Add Form</p>
          </Button>
        </ConfigEditor>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NO</TableHead>
            <TableHead>Config Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loaderData.status === "success" &&
            loaderData.data.map((config, index) => (
              <TableRow key={config.configId}>
                <TableCell>
                  <div className="bg-primary text-secondary grid size-8 place-content-center rounded-full">
                    {index + 1}
                  </div>
                </TableCell>
                <TableCell className="max-w-[192px] truncate">
                  {config.configId}
                </TableCell>
                <TableCell>{config.title}</TableCell>
                <TableCell className="max-w-[312px]">
                  {config.description}
                </TableCell>
                <TableCell>{config.lastUpdated}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Eye />
                    </Button>

                    <Button variant="outline" size="icon">
                      <Pencil />
                    </Button>

                    <Button variant="destructive" size="icon">
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </section>
  );
}
