import { get } from "../../service/axios";



export async function apiGetProfile() {
  return await get(`profile/receive/`);
}