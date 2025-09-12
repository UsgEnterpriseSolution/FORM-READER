import type { Route } from "./+types/datalog";
import type { AppResponse, DataLog } from "~/types";

import Data from "~/logic/data";
import Config from "~/logic/config";

export async function loader({
  params,
}: Route.ActionArgs): Promise<AppResponse<DataLog>> {
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

    const configId = data.configId;
    if (!configId) {
      return {
        status: "fail",
        message: "No config ID found",
        timestamp: Date.now(),
      };
    }

    return {
      status: "success",
      data: {
        id: data.id,
        dataId: data.dataId,
        formTitle: (await Config.title(configId)) ?? configId,
        extDate: data.date_extracted,
        data: data.data as { [k: PropertyKey]: any },
      },
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      status: "error",
      code: 500,
      message: error instanceof Error ? error.message : (error as string),
      timestamp: Date.now(),
    };
  }
}
