import { 
  apiGetPrescriptions, 
  apiGetPrescriptionDetail,
  apiCreatePrescription,
  apiEditPrescription,
  apiDeletePrescription
} from '../api/prescriptions/prescriptions';
import { TPrescription, TPrescriptionsList } from '../context/PrescriptionProvider';

export interface PrescriptionFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

export class PrescriptionService {
  static async getPrescriptions(filters: PrescriptionFilters = {}): Promise<TPrescriptionsList> {
    const response = await apiGetPrescriptions(filters);
    return response.data;
  }

  static async getPrescriptionDetail(id: string): Promise<TPrescription> {
    const response = await apiGetPrescriptionDetail(id);
    return response.data;
  }

  static async createPrescription(data: any): Promise<TPrescription> {
    const response = await apiCreatePrescription(data);
    return response.data;
  }

  static async editPrescription(id: number, data: any): Promise<TPrescription> {
    const response = await apiEditPrescription(id, data);
    return response.data;
  }

  static async deletePrescription(id: number): Promise<void> {
    await apiDeletePrescription(id);
  }
}