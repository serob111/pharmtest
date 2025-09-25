import { 
  apiGetDrugs, 
  apiGetDrugDetail, 
  apiGetActiveIngredients,
  apiGetDosageUnits,
  apiEditDrug
} from '../api/drugs/drugs';
import { TMed, TMedsList, TKiroDetail } from '../context/MedDirProvider';

export interface MedFilters {
  search?: string;
  useInKiro?: boolean;
  limit?: number;
  offset?: number;
}

export class MedService {
  static async getMeds(filters: MedFilters = {}): Promise<TMedsList> {
    const response = await apiGetDrugs(filters);
    return response.data;
  }

  static async getMedDetail(id: string): Promise<TMed> {
    const response = await apiGetDrugDetail(id);
    return response.data;
  }

  static async getActiveIngredients() {
    const response = await apiGetActiveIngredients();
    return response.data;
  }

  static async getDosageUnits() {
    const response = await apiGetDosageUnits();
    return response.data;
  }

  static async editMed(id: string, params: TKiroDetail): Promise<TMed> {
    const response = await apiEditDrug(id, params);
    return response.data;
  }
}