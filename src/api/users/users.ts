import { get, patch, remove } from "../../service/axios";

export async function apiUpdateUserName(params: { id: number; firstName: string; lastName: string }) {
  return patch(`users/${params.id}/`, {
    first_name: params.firstName,
    last_name: params.lastName,
  });
}

export async function apiUpdateUserPhone(id: number, phone: string) {
  return patch(`users/${id}/`, { phone });
}

export async function apiUpdateUserRole(id: number, role: string | number) {
  return patch(`users/${id}/`, { clinic_role: role });
}

export async function apiUpdateUserStatus(id: number) {
  return remove(`users/${id}/`);
}

export async function apiGetUserRoles() {
  return get(`/selectors/users/roles/`);
}
