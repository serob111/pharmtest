import { TConnectionDetails, TCreateDeviceProp } from "../../types/deviceTypes";
import { get, patch, post, remove } from "../../service/axios";
import qs from "qs";

interface DeviceQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  manufacturers?: string[];
  models?: string[];
  statuses?: string[];
}

export async function apiGetDevices(options: DeviceQueryOptions = {}) {
  const { limit, offset, search, manufacturers, models, statuses } = options;

  const params: Record<string, string | number | string[]> = {
    ...(limit !== undefined ? { limit } : {}),
    ...(offset !== undefined ? { offset } : {}),
    ...(search
      ? { search: search.includes(" ") ? `"${search.trim()}"` : search.trim() }
      : {}),
    ...(manufacturers?.length ? { manufacturers } : {}),
    ...(models?.length ? { models } : {}),
    ...(statuses?.length ? { statuses } : {}),
  };

  return get("/devices/", {
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
}

export async function apiGetDeviceModels() {
  return get(`/selectors/devices/models/`);
}

export async function apiGetDeviceManufacturers() {
  return get(`/selectors/devices/manufacturers/`);
}

export async function apiGetDeviceDetail(id: number) {
  return get(`/devices/${id}/`);
}

export async function apiPingDevice(id: number) {
  return get(`/devices/${id}/ping/`);
}

export async function apiDeactivateDevice(id: number) {
  return remove(`/devices/${id}/deactivate/`);
}

export async function apiGetDeviceEvents(id: number) {
  return get(`/devices/${id}/latest/events/`);
}

export async function apiGetDeviceMessages(id: number) {
  return get(`/devices/${id}/latest/integration-messages/`);
}

export async function apiGetDeviceConnectionSettings(id: number) {
  return get(`/devices/${id}/connection-setting/receive/`);
}

export async function apiUpdateConnection(
  id: number,
  params: TConnectionDetails
) {
  const sanitizedParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      value === "" ? null : value,
    ])
  );

  return post(`/devices/${id}/connection-setting/change/`, sanitizedParams);
}

export async function apiTestConnection(id: number) {
  return get(`/devices/${id}/connection-setting/test/`);
}

export async function apiCreateDevice(props: TCreateDeviceProp) {
  return post(`/devices/`, props);
}

function sanitizeValues<T>(obj: T): T | null {
  if (obj === "") return null;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeValues(item)) as unknown as T;
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, sanitizeValues(v)])
    ) as T;
  }
  return obj;
}

export async function apiEditDevice(id: number, params: TCreateDeviceProp) {
  const sanitizedParams = sanitizeValues(params);
  return patch(`/devices/${id}/`, sanitizedParams);
}

export async function apiDeleteDevice(id: number) {
  return remove(`/devices/${id}/`);
}
