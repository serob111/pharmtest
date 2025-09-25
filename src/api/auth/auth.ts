import { post } from "../../service/axios";

const authUrl = import.meta.env.VITE_API_AUTH;

export async function apiLogin(email: string, password: string) {
  return post(`${authUrl}/obtain/`, { email, password });
}

export async function apiObtainTwoFactor(totpToken: string, authTempToken: string) {
  return post(`${authUrl}/obtain/two-factor/`, {
    totp_token: totpToken,
    auth_temp_token: authTempToken,
  });
}
