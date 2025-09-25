import { TCreateDeviceProp } from "../../context/DeviceProvider";
import { get, patch, post, remove } from "../../service/axios";
import qs from "qs";

interface PrescriptionQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
}

export async function apiGetPrescriptions(options: PrescriptionQueryOptions = {}) {
  const { limit, offset, search } = options;

  const params: Record<string, string | number> = {
    ...(limit !== undefined ? { limit } : {}),
    ...(offset !== undefined ? { offset } : {}),
    ...(search
      ? { search: search.includes(" ") ? `"${search.trim()}"` : search.trim() }
      : {}),
  };

  return get("/prescriptions/", {
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
}

export async function apiGetPrescriptionDetail(id: string) {
  return get(`/prescriptions/${id}/`);
}

export async function apiCreatePrescription(props: TCreateDeviceProp) {
  return post(`/prescriptions/`, props);
}

export async function apiEditPrescription(id: number, props: TCreateDeviceProp) {
  return patch(`/prescriptions/${id}/`, props);
}

export async function apiDeletePrescription(id: number) {
  return remove(`/prescriptions/${id}/`);
}
