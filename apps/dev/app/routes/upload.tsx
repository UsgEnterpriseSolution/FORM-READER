import type { Route } from "./+types/upload";
import type { ActionRes, Engine, UploadActionRes } from "~/types";
import { useFileUpload } from "~/hooks/useFileUpload";

import UploadTable from "~/components/UploadTable";
import UploadError from "~/components/UploadErrors";
import UploadDesc from "~/components/UploadDesc";
import useUploadActionData from "~/hooks/useUploadActionData";
import UploadForm from "~/components/UploadForm";
import LLM from "~/logic/llm";

export async function action({
  request,
}: Route.ActionArgs): Promise<ActionRes<UploadActionRes>> {
  try {
    // await new Promise((res) => setTimeout(res, 3000));

    const formData = await request.formData();
    const images: string[] = JSON.parse(formData.get("images") as string);
    const engine = formData.get("engine") as Engine;

    const fieldData = await LLM.extract(engine, images);

    return {
      status: "success",
      data: { images, fieldData },
    };
  } catch (error) {
    return {
      code: 500,
      status: "error",
      message: error instanceof Error ? error.message : (error as string),
    };
  }
}

export default function Upload({ actionData }: Route.ComponentProps) {
  useUploadActionData(actionData);

  const maxSize = 10 * 1024 * 1024;
  const maxFiles = 10;

  const [{ files, isDragging, errors }, actions] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: "image/*",
  });

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
