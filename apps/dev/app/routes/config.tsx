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
import { useActions, useConfigMode } from "~/zustand";
import ConfigViewer from "~/components/ConfigViewer";
import { formateDate } from "~/utils/functions";

export async function action({
  request,
}: Route.ActionArgs): Promise<AppResponse<null>> {
  try {
    // await new Promise((res) => setTimeout(res, 3000));
    const formData = await request.formData();

    switch (request.method.toUpperCase()) {
      case "POST": {
        const images = formData.get("images") as string | null;
        const fields = formData.getAll("field") as string[];
        const endpoint = formData.get("endpoint") as string | null;

        const rawConfigZodObj = rawConfigSchema.safeParse({
          images: JSON.parse(images ?? "[]") as object[],
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          endpoint: JSON.parse(endpoint ?? "{}") as object,
          formCode: formData.get("formCode") as string,
          fields: fields.map((field) => JSON.parse(field)) as object[],
        });

        if (!rawConfigZodObj.success) {
          return {
            status: "fail",
            message: "Invalid form data.",
            timestamp: Date.now(),
          };
        }

        const formCode = await Config.formCodeCheck(
          rawConfigZodObj.data.formCode,
        );
        if (formCode.exists) {
          return {
            status: "fail",
            message: "Form code already in use.",
            timestamp: Date.now(),
          };
        }

        const result = await Config.create(rawConfigZodObj.data);
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
        const configRef = formData.get("configRef") as string | null;
        if (!configRef) {
          return {
            status: "fail",
            message: "Invalid config ID.",
            timestamp: Date.now(),
          };
        }

        const isValid = await Config.isValid(configRef);
        if (!isValid) {
          return {
            status: "fail",
            message: "Config not found.",
            timestamp: Date.now(),
          };
        }

        const images = formData.get("images") as string | null;
        const endpoint = formData.get("endpoint") as string | null;
        const fields = formData.getAll("field") as string[];

        const rawConfigZodObj = rawConfigSchema.safeParse({
          images: JSON.parse(images ?? "[]") as object[],
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          endpoint: JSON.parse(endpoint ?? "{}") as object,
          formCode: formData.get("formCode") as string,
          fields: fields.map((field) => JSON.parse(field)) as object[],
        });

        if (!rawConfigZodObj.success) {
          return {
            status: "fail",
            message: "Invalid form data.",
            timestamp: Date.now(),
          };
        }

        const formCode = await Config.formCodeCheck(
          rawConfigZodObj.data.formCode,
        );
        if (formCode.exists && formCode.configRef !== configRef) {
          return {
            status: "fail",
            message: "Form code already in use.",
            timestamp: Date.now(),
          };
        }

        const result = await Config.update(configRef, rawConfigZodObj.data);
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
        const configRef = formData.get("configRef") as string;

        if (!configRef) {
          return {
            status: "fail",
            message: "Invalid config ID.",
            timestamp: Date.now(),
          };
        }

        const isValid = await Config.isValid(configRef);
        if (!isValid) {
          return {
            status: "fail",
            message: "Config not found.",
            timestamp: Date.now(),
          };
        }

        const success = await Config.remove(configRef);
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
    const configs = await Config.all();

    if (configs === null) {
      throw new Error("Failed to load configs");
    }

    return {
      status: "success",
      data: configs.map((config) => ({
        configRef: config.configRef,
        title: config.title,
        description: config.description,
        endpoint: config.endpoint.url,
        formCode: config.formCode,
        lastUpdated: config.updatedOn ?? "---",
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

  const handleEdit = (configRef: string) => {
    resetConfig();
    setConfigMode("EDIT");
    fetchConfiglet(configRef);
  };

  const handleView = (configRef: string) => {
    resetConfig();
    setConfigMode("VIEW");
    fetchConfiglet(configRef);
  };

  useAppToast<any>(actionData);

  return (
    <section className="space-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <p className="text-2xl font-medium">Configurations </p>
          {state === "submitting" && <Loader2 className="animate-spin" />}
        </span>

        <ConfigEditor
          method="POST"
          title="Add form"
          desc="Create a new form by providing a title, description, and adding fields below."
          submitLabel="Submit form"
        >
          <Button onClick={handleCreate}>
            <CirclePlus />
            <p>Add Form</p>
          </Button>
        </ConfigEditor>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Form Code</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loaderData.status === "success" &&
            loaderData.data.map((config) => (
              <TableRow key={config.configRef}>
                <TableCell>{config.title}</TableCell>
                <TableCell className="max-w-[312px]">
                  {config.description}
                </TableCell>
                <TableCell>{config.endpoint}</TableCell>
                <TableCell>{config.formCode}</TableCell>
                <TableCell>{formateDate(config.lastUpdated)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ConfigViewer>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleView(config.configRef)}
                      >
                        <Eye />
                      </Button>
                    </ConfigViewer>

                    <ConfigEditor
                      configRef={config.configRef}
                      method="PUT"
                      title="Edit form"
                      desc="Update the form by modifying the title, description, and fields below."
                      submitLabel="Save changes"
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(config.configRef)}
                      >
                        <Pencil />
                      </Button>
                    </ConfigEditor>

                    <ConfigDeleteModal configRef={config.configRef}>
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
