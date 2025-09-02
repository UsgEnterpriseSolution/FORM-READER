import crypto from "node:crypto";
import { href, redirect } from "react-router";

import type { Route } from "./+types/upload";
import type { AppResponse, Engine, UploadLoaderRes } from "~/types";

import UploadTable from "~/components/UploadTable";
import UploadError from "~/components/UploadErrors";
import UploadDesc from "~/components/UploadDesc";
import UploadForm from "~/components/UploadForm";
import { useFileUpload } from "~/hooks/useFileUpload";

import LLM from "~/logic/llm";
import Config from "~/logic/config";
import { appCache } from "~/services/cache";
import useAppToast from "~/hooks/useAppToast";

export async function action({
  request,
}: Route.ActionArgs): Promise<Response | AppResponse<null>> {
  try {
    // await new Promise((res) => setTimeout(res, 2000));

    const formData = await request.formData();

    const images: string[] = JSON.parse(formData.get("images") as string);
    const engine = formData.get("engine") as Engine;
    const configId = formData.get("configId") as string;

    const config = await Config.get(configId);

    if (config === null) {
      return {
        status: "fail",
        message: "Invalid config Id",
        timestamp: Date.now(),
      };
    }

    const fieldData = await LLM.extract(engine, images, config.schema);

    const cacheKey = crypto.randomUUID();
    appCache.put(cacheKey, { configId, images, fieldData });

    return redirect(href("/review/:key?", { key: cacheKey }));
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
      timestamp: Date.now(),
    };
  }
}

export async function loader(): Promise<AppResponse<UploadLoaderRes>> {
  try {
    const configs = await Config.getAll();

    if (configs === null) {
      throw new Error("Failed to load configs");
    }

    return {
      status: "success",
      data: {
        configs: configs.map((config) => ({
          label: config.title,
          value: config.configId,
        })),
        engines: [
          { label: "(Online) - Google", value: "GOOGLE" },
          { label: "(Local) - LM Studio", value: "LMSTUDIO" },
          { label: "(Local) - Ollama", value: "OLLAMA" },
        ],
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

export default function Upload({ actionData }: Route.ComponentProps) {
  const maxSize = 10 * 1024 * 1024;
  const maxFiles = 10;

  const [{ files, isDragging, errors }, actions] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: "image/*",
  });

  useAppToast(actionData);

  return (
    <section className="mx-4 flex h-fit max-w-[608px] flex-col gap-4 pt-10 sm:mx-auto">
      <UploadForm
        actions={actions}
        files={files}
        isDragging={isDragging}
        maxFiles={maxFiles}
        maxSize={maxSize}
      />

      {files.length > 0 && (
        <UploadTable
          files={files}
          openFileDialog={actions.openFileDialog}
          clearFiles={actions.clearFiles}
          removeFile={actions.removeFile}
        />
      )}

      {errors.length > 0 && <UploadError error={errors[0]} />}

      {files.length === 0 && <UploadDesc />}
    </section>
  );
}
