import { TCreateOrderProp } from "../../context/OrdersProvider";
import { get, patch, post, remove } from "../../service/axios";
import qs from "qs";

interface DeviceQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
}

export async function apiGetOrders(options: DeviceQueryOptions = {}) {
  const { limit, offset, search, status } = options;

  const params: Record<string, any> = {
    ...(limit !== undefined ? { limit } : {}),
    ...(offset !== undefined ? { offset } : {}),
    ...(search
      ? { search: search.includes(" ") ? `"${search.trim()}"` : search.trim() }
      : {}),
    ...(status !== "" ? { status } : {}),
  };

  return get("/orders/", {
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
}

export async function apiGetOrderDetail(id: string) {
  return get(`/orders/${id}/`);
}

export async function apiCreateOrder(props: TCreateOrderProp) {
  return post(`/orders/`, props);
}

export async function apiEditOrder(id: number, props: TCreateOrderProp) {
  return patch(`/orders/${id}/`, props);
}

export async function apiDeleteOrder(id: number) {
  return remove(`/orders/${id}/`);
}

export async function apiGetOrdersDashboard() {
  return get(`/orders/dashboard/`);
};

export async function apiSendorder(id: string, device?: string) {
  return post(`/orders/${id}/send/`, {
    ...(device && { device })
  });
};
