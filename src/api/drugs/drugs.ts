import { TKiroDetail } from "../../types/medTypes";
import { get, patch } from "../../service/axios";

export type TGetDrugs = {
  limit: number;
  offset: number;
  useInKiro?: boolean;
  search?: string;
};

export async function apiGetDrugs({ limit, offset, useInKiro, search }: TGetDrugs) {
  return get(`/drugs/`, {
    params: {
      limit,
      offset,
      has_kiro_data: useInKiro,
      ...(search
        ? { search: search.includes(" ") ? `"${search.trim()}"` : search.trim() }
        : {}),
    },
  });
}

export async function apiGetDrugDetail(id: string) {
  return get(`/drugs/${id}/`);
}

export async function apiGetActiveIngredients() {
  return get(`/drugs/active-ingredient/`);
}

export async function apiGetDosageUnits() {
  return get(`/drugs/dosage-units/`);
}

export async function apiEditDrug(id: string, params: TKiroDetail) {
  return patch(`/drugs/${id}/options/kiro/`, params);
}
