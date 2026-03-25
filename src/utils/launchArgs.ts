import { NativeModules } from "react-native";

type LaunchArgsValue = boolean | number | string;

type LaunchArgsMap = Record<string, LaunchArgsValue>;

type LaunchArgsModuleType = {
  getConstants?: () => { launchArgs?: LaunchArgsMap };
  getLaunchArgs?: () => Promise<LaunchArgsMap>;
};

const launchArgsModule = NativeModules.LaunchArgs as
  | LaunchArgsModuleType
  | undefined;

const normalizeBooleanArg = (value: LaunchArgsValue | undefined): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return value === "true";
};

export const getLaunchArgs = async (): Promise<LaunchArgsMap> => {
  const constantArgs = launchArgsModule?.getConstants?.().launchArgs;
  if (constantArgs) {
    return constantArgs;
  }

  return (await launchArgsModule?.getLaunchArgs?.()) ?? {};
};

export const shouldDisableCameraForE2E = async (): Promise<boolean> => {
  const launchArgs = await getLaunchArgs();
  return normalizeBooleanArg(launchArgs.detoxDisableCamera);
};

export const shouldDisableCameraForE2ESync = (): boolean => {
  const launchArgs = launchArgsModule?.getConstants?.().launchArgs ?? {};
  return normalizeBooleanArg(launchArgs.detoxDisableCamera);
};

export const getLaunchArgStringSync = (key: string): string | undefined => {
  const launchArgs = launchArgsModule?.getConstants?.().launchArgs ?? {};
  const value = launchArgs[key];

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
};
