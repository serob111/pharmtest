import { get, patch, post, remove } from "../../service/axios";

export async function apiUpdateName(params: { firstName: string; lastName: string }) {
  return patch(`profile/full-name/`, {
    first_name: params.firstName,
    last_name: params.lastName,
  });
}

export async function apiUpdatePhone(phone: string) {
  return patch(`profile/phone-number/`, { phone });
}

export async function apiUpdatePassword(params: { password: string; confirmPassword: string }) {
  return patch(`profile/password/`, {
    new_password: params.password,
    confirm_password: params.confirmPassword,
  });
}

export async function apiGetQrCode() {
  return get(`profile/two-factor/qr-code/`);
}

export async function apiDeleteQrCode() {
  return remove(`profile/two-factor/delete/`);
}

export async function apiAddTwoFactor(totpToken: string) {
  return post(`profile/two-factor/add/`, {
    totp_token: totpToken,
  });
}

export async function apiChangeLanguage(lang: string) {
  return patch(`profile/language/`, { language: lang });
}
