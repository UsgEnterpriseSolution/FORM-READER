import type { Route } from "./+types/datalog";
import type { AppResponse, DataLog } from "~/types";

import Data from "~/logic/data";
import Config from "~/logic/config";

export async function loader({
  params,
}: Route.ActionArgs): Promise<AppResponse<DataLog>> {
  try {
    const { dataRef } = params;
    if (!dataRef) {
      return {
        status: "fail",
        message: "No data ID provided",
        timestamp: Date.now(),
      };
    }

    const data = await Data.get(dataRef);
    if (!data) {
      return {
        status: "fail",
        message: "No data found",
        timestamp: Date.now(),
      };
    }

    const configRef = data.configRef;
    if (!configRef) {
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
        dataRef: data.dataRef,
        formTitle: (await Config.title(configRef)) ?? configRef,
        extDate: data.createdOn,
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
