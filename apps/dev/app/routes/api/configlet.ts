import type { AppResponse, ConfigObj } from "~/types";
import type { Route } from "./+types/configlet";
import Config from "~/logic/config";

export async function loader({
  params,
}: Route.LoaderArgs): Promise<AppResponse<ConfigObj>> {
  try {
    const { configId } = params;

    const isValid = await Config.isValidConfigId(configId);
    if (!isValid) {
      return {
        status: "fail",
        message: "Config not found.",
        timestamp: Date.now(),
      };
    }

    const config = await Config.get(configId);
    if (!config) {
      return {
        status: "fail",
        message: "Unable to load config.",
        timestamp: Date.now(),
      };
    }

    return {
      status: "success",
      data: config,
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
