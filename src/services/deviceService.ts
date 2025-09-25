import { 
  apiGetDevices, 
  apiGetDeviceDetail, 
  apiGetDeviceModels, 
  apiGetDeviceManufacturers,
  apiCreateDevice,
  apiEditDevice,
  apiDeleteDevice,
  apiDeactivateDevice,
  apiPingDevice,
  apiGetDeviceEvents,
  apiGetDeviceMessages,
  apiGetDeviceConnectionSettings,
  apiUpdateConnection
} from '../api/devices/devices';
import { TDevice, TDevicesList, TCreateDeviceProp, TConnectionDetails } from '../types/deviceTypes';

export interface DeviceFilters {
  search?: string;
  manufacturers?: string[];
  models?: string[];
  statuses?: string[];
  limit?: number;
  offset?: number;
}

export class DeviceService {
  static async getDevices(filters: DeviceFilters = {}): Promise<TDevicesList> {
    const response = await apiGetDevices(filters);
    return response.data;
  }

  static async getDeviceDetail(id: number): Promise<TDevice> {
    const response = await apiGetDeviceDetail(id);
    return response.data;
  }

  static async getDeviceModels() {
    const response = await apiGetDeviceModels();
    return response.data.results;
  }

  static async getDeviceManufacturers() {
    const response = await apiGetDeviceManufacturers();
    return response.data.results;
  }

  static async createDevice(data: TCreateDeviceProp): Promise<TDevice> {
    const response = await apiCreateDevice(data);
    return response.data;
  }

  static async editDevice(id: number, data: TCreateDeviceProp): Promise<TDevice> {
    const response = await apiEditDevice(id, data);
    return response.data;
  }

  static async deleteDevice(id: number): Promise<void> {
    await apiDeleteDevice(id);
  }

  static async deactivateDevice(id: number): Promise<void> {
    await apiDeactivateDevice(id);
  }

  static async pingDevice(id: number): Promise<any> {
    const response = await apiPingDevice(id);
    return response.data;
  }

  static async getDeviceEvents(id: number) {
    const response = await apiGetDeviceEvents(id);
    return response.data;
  }

  static async getDeviceMessages(id: number) {
    const response = await apiGetDeviceMessages(id);
    return response.data;
  }

  static async getDeviceConnectionSettings(id: number): Promise<TConnectionDetails> {
    const response = await apiGetDeviceConnectionSettings(id);
    return response.data;
  }

  static async updateConnectionSettings(id: number, params: TConnectionDetails): Promise<TConnectionDetails> {
    const response = await apiUpdateConnection(id, params);
    return response.data;
  }
}