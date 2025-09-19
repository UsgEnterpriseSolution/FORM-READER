import crypto from "node:crypto";
import { Form, href, redirect } from "react-router";

import type { Route } from "./+types/upload";
import type { AppResponse, Engine, EngineList, UploadLoaderRes } from "~/types";

import UploadTable from "~/components/UploadTable";
import UploadError from "~/components/UploadErrors";
import UploadImage from "~/components/UploadImage";
import { useFileUpload } from "~/hooks/useFileUpload";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import LLM from "~/logic/llm";
import Config from "~/logic/config";
import { appCache } from "~/services/cache";
import useAppToast from "~/hooks/useAppToast";
import { useActions, useSettings } from "~/zustand";
import { uploadFormSchema } from "~/zod";
import useConfigRef from "~/hooks/useConfigRef";
import { Input } from "~/components/ui/input";
import { useNavigation } from "react-router";

export async function action({
  request,
}: Route.ActionArgs): Promise<Response | AppResponse<null>> {
  const url = new URL(request.url);
  const formData = await request.formData();

  try {
    const searchParams = url.searchParams;
    const branchCode = searchParams.get("branchCode");
    const username = searchParams.get("username");

    if (!branchCode || !username) {
      return {
        status: "fail",
        message: "Undefined branch code or username",
        timestamp: Date.now(),
      };
    }

    const uploadFormZodObj = uploadFormSchema.safeParse({
      configRef: formData.get("configRef") as string,
      engine: formData.get("engine") as Engine,
      images: JSON.parse(formData.get("images") as string),
    });

    if (!uploadFormZodObj.success) {
      return {
        status: "fail",
        message: "Invalid form data",
        timestamp: Date.now(),
      };
    }

    const config = await Config.get(uploadFormZodObj.data.configRef);

    if (config === null) {
      return {
        status: "fail",
        message: "Invalid config Id",
        timestamp: Date.now(),
      };
    }

    const fieldData = await LLM.extract(
      uploadFormZodObj.data.engine,
      uploadFormZodObj.data.images,
      config.ajvSchema,
    );

    const cacheKey = crypto.randomUUID();
    appCache.put(cacheKey, {
      configRef: uploadFormZodObj.data.configRef,
      images: uploadFormZodObj.data.images,
      fieldData,
    });

    return redirect(href("/review/:key", { key: cacheKey }) + url.search);
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
      timestamp: Date.now(),
    };
  }
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<AppResponse<UploadLoaderRes>> {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const searchParamsObj = Object.fromEntries(searchParams);
  const formCode = searchParamsObj["formCode"];

  const engines: EngineList = [
    { label: "OpenAI", value: "OPENAI", isLocal: false },
    { label: "Google", value: "GOOGLE", isLocal: false },
    { label: "LM Studio", value: "LMSTUDIO", isLocal: true },
    { label: "Ollama", value: "OLLAMA", isLocal: true },
  ];

  try {
    const formCodeVerdict = await Config.formCodeCheck(formCode ?? "");
    if (formCodeVerdict.exists) {
      const config = await Config.get(formCodeVerdict.configRef);

      if (config) {
        return {
          status: "success",
          data: {
            configs: [
              {
                label: config.title,
                value: config.configRef,
              },
            ],
            engines,
          },
          timestamp: Date.now(),
        };
      }
    }

    const configs = await Config.all();
    if (configs === null) {
      throw new Error("Failed to load configs");
    }

    return {
      status: "success",
      data: {
        configs: configs.map((config) => ({
          label: config.title,
          value: config.configRef,
        })),
        engines,
      },
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

export default function Upload({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const navigation = useNavigation();
  const isPageSubmitting = navigation.state === "submitting";

  const maxSize = 10 * 1024 * 1024;
  const maxFiles = 10;

  const [{ files, isDragging, errors }, actions] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: "image/*",
  });

  const settings = useSettings();
  const { setSettings } = useActions();

  useConfigRef();
  useAppToast(actionData);

  return (
    <Form
      id="upload-form"
      method="POST"
      encType="multipart/form-data"
      className="mx-4 h-fit max-w-[608px] pt-10 sm:mx-auto"
    >
      <fieldset className="space-y-10" disabled={isPageSubmitting}>
        <div className="flex items-center gap-2">
          {settings.hideConfigRef ? (
            <>
              <Input
                type="hidden"
                name="configRef"
                value={settings.configRef === null ? "" : settings.configRef}
              />
              {loaderData.status === "success" && (
                <p className="mr-auto">{loaderData.data.configs[0].label}</p>
              )}
            </>
          ) : (
            <Select
              name="configRef"
              defaultValue={
                settings.configRef === null ? "" : settings.configRef
              }
              onValueChange={(value) =>
                setSettings({ key: "configRef", value })
              }
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Form Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Forms</SelectLabel>
                  {loaderData.status === "success" &&
                    loaderData.data.configs.map((config, index) => (
                      <SelectItem key={index} value={config.value}>
                        {config.label}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Select
            name="engine"
            defaultValue={settings.engine === null ? "" : settings.engine}
            onValueChange={(engine) =>
              setSettings({ key: "engine", value: engine as Engine })
            }
            required
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Engine Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Online</SelectLabel>
                {loaderData.status === "success" &&
                  loaderData.data.engines
                    .filter((item) => item.isLocal === false)
                    .map((engine, index) => (
                      <SelectItem key={index} value={engine.value}>
                        {engine.label}
                      </SelectItem>
                    ))}
              </SelectGroup>

              <SelectGroup>
                <SelectLabel>Local</SelectLabel>
                {loaderData.status === "success" &&
                  loaderData.data.engines
                    .filter((item) => item.isLocal)
                    .map((engine, index) => (
                      <SelectItem key={index} value={engine.value}>
                        {engine.label}
                      </SelectItem>
                    ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <UploadImage
          actions={actions}
          files={files}
          isDragging={isDragging}
          maxFiles={maxFiles}
          maxSize={maxSize}
        />

        <UploadTable
          files={files}
          openFileDialog={actions.openFileDialog}
          clearFiles={actions.clearFiles}
          removeFile={actions.removeFile}
        />
        {errors.length > 0 && <UploadError error={errors[0]} />}
      </fieldset>
    </Form>
  );
}
