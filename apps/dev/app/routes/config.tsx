import { CirclePlus, Eye, Loader2, Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import ConfigEditor from "~/components/ConfigEditor";

import Config from "~/logic/config";
import type { Route } from "./+types/config";
import type { AppResponse, ConfigLoaderRes } from "~/types";
import { rawConfigSchema } from "~/zod";
import useAppToast from "~/hooks/useAppToast";
import ConfigDeleteModal from "~/components/ConfigDeleteModal";
import { useNavigation } from "react-router";
import { useActions, useConfigMode } from "~/zustand/store";
import ConfigViewer from "~/components/ConfigViewer";

export async function action({
  request,
}: Route.ActionArgs): Promise<AppResponse<null>> {
  try {
    // await new Promise((res) => setTimeout(res, 3000));
    const formData = await request.formData();

    switch (request.method.toUpperCase()) {
      case "POST": {
        const rawConfigZodObj = rawConfigSchema.safeParse({
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          fields: (formData.getAll("field") as string[]).map((field) =>
            JSON.parse(field),
          ),
        });

        if (!rawConfigZodObj.success) {
          return {
            status: "fail",
            message: "Invalid form data.",
            timestamp: Date.now(),
          };
        }

        const result = await Config.createBeta(rawConfigZodObj.data);
        if (!result) {
          return {
            status: "fail",
            message: "Failed to create config.",
            timestamp: Date.now(),
          };
        }

        return {
          status: "success",
          message: "Config created successfully.",
          data: null,
          timestamp: Date.now(),
        };
      }

      case "PUT": {
        const configId = formData.get("configId") as string | null;
        if (!configId) {
          return {
            status: "fail",
            message: "Invalid config ID.",
            timestamp: Date.now(),
          };
        }

        const isValid = await Config.isValidConfigId(configId);
        if (!isValid) {
          return {
            status: "fail",
            message: "Config not found.",
            timestamp: Date.now(),
          };
        }

        const rawConfigZodObj = rawConfigSchema.safeParse({
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          fields: (formData.getAll("field") as string[]).map((field) =>
            JSON.parse(field),
          ),
        });

        if (!rawConfigZodObj.success) {
          return {
            status: "fail",
            message: "Invalid form data.",
            timestamp: Date.now(),
          };
        }

        const result = await Config.updateBeta(configId, rawConfigZodObj.data);
        if (!result) {
          return {
            status: "fail",
            message: "Failed to update config.",
            timestamp: Date.now(),
          };
        }

        return {
          status: "success",
          message: "Config updated successfully.",
          data: null,
          timestamp: Date.now(),
        };
      }

      case "DELETE": {
        const configId = formData.get("configId") as string;

        if (!configId) {
          return {
            status: "fail",
            message: "Invalid config ID.",
            timestamp: Date.now(),
          };
        }

        const isValid = await Config.isValidConfigId(configId);
        if (!isValid) {
          return {
            status: "fail",
            message: "Config not found.",
            timestamp: Date.now(),
          };
        }

        const success = await Config.remove(configId);
        if (!success) {
          return {
            status: "fail",
            message: "Failed to delete config.",
            timestamp: Date.now(),
          };
        }

        return {
          status: "success",
          message: "Config deleted successfully.",
          data: null,
          timestamp: Date.now(),
        };
      }

      default:
        return {
          code: 500,
          status: "error",
          message: "Invaild HTTP verb.",
          timestamp: Date.now(),
        };
    }
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
      timestamp: Date.now(),
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

export default function Component({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { state } = useNavigation();
  const mode = useConfigMode();
  const { setConfigMode, fetchConfiglet, resetConfig } = useActions();

  const handleCreate = () => {
    if (mode !== "CREATE") {
      resetConfig();
    }

    setConfigMode("CREATE");
  };

  const handleEdit = (configId: string) => {
    resetConfig();
    setConfigMode("EDIT");
    fetchConfiglet(configId);
  };

  const handleView = (configId: string) => {
    resetConfig();
    setConfigMode("VIEW");
    fetchConfiglet(configId);
  };

  useAppToast<any>(actionData);

  return (
    <section className="space-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <p className="text-2xl font-medium">Configurations </p>
          {state === "submitting" && <Loader2 className="animate-spin" />}
        </span>

        <ConfigEditor>
          <Button onClick={handleCreate}>
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
                    <ConfigViewer>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleView(config.configId)}
                      >
                        <Eye />
                      </Button>
                    </ConfigViewer>

                    <ConfigEditor configId={config.configId}>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(config.configId)}
                      >
                        <Pencil />
                      </Button>
                    </ConfigEditor>

                    <ConfigDeleteModal configId={config.configId}>
                      <Button variant="destructive" size="icon">
                        <Trash2 />
                      </Button>
                    </ConfigDeleteModal>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </section>
  );
}
