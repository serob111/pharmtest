import axios, { AxiosRequestConfig } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import ISessionData from "../types/ISessionData";
import { LS_SESSION_KEY } from "../context/AuthProvider";



const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
};
export const authUrl = import.meta.env.VITE_API_AUTH

const axiosInstance = axios.create(axiosConfig);

enum ETokenType {
  access_token = "access",
  refresh_token = "refresh",
  auth_temp_token = "auth_temp_token"
}

function getToken(type: ETokenType) {
  const lsSession = localStorage.getItem(LS_SESSION_KEY);

  if (lsSession) {
    const auth = JSON.parse(lsSession) as ISessionData;

    return auth[type];
  }
  return null;
}

axiosInstance.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  const access_token = getToken(ETokenType.access_token);

  if (access_token) config.headers["Authorization"] = `Bearer ${access_token}`;


  return config;
});

const refreshAxios = axios.create(axiosConfig);

createAuthRefreshInterceptor(axiosInstance, (failedRequest) => {
  const refresh_token = getToken(ETokenType.refresh_token);

  return refreshAxios
    .post<{ access: string }>(`${authUrl}/refresh/`, { refresh: refresh_token })
    .then((response) => {
      const { access } = response.data;

      const sessionData: ISessionData = JSON.parse(
        localStorage.getItem(LS_SESSION_KEY) || "null"
      );
      sessionData["access"] = access;
      localStorage.setItem(LS_SESSION_KEY, JSON.stringify(sessionData));

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      failedRequest.response.config.headers["Authorization"] = `Bearer ${access}`;

      return Promise.resolve(access);
    })
    .catch((error) => {
      console.log(error)
      localStorage.removeItem(LS_SESSION_KEY);
      window.location.assign('/')
      return Promise.reject(error);
    });
});


const { get, post, put, patch, delete: remove } = axiosInstance;

export { get, post, put, patch, remove };