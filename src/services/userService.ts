import { 
  apiUpdateUserName, 
  apiUpdateUserPhone, 
  apiUpdateUserRole, 
  apiUpdateUserStatus,
  apiGetUserRoles 
} from '../api/users/users';
import { get, post } from '../service/axios';
import { TUser, TUsersList, TRole } from '../context/UsersProvider';

export interface UserFilters {
  limit?: number;
  offset?: number;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  clinic_role: number | string | null;
  password: string;
  confirm_password: string;
}

export class UserService {
  static async getUsers(filters: UserFilters = {}): Promise<TUsersList> {
    const response = await get<TUsersList>('/users', { params: filters });
    return response.data;
  }

  static async createUser(data: CreateUserData): Promise<TUser> {
    const response = await post('/users/', data);
    return response.data;
  }

  static async updateUserName(params: { id: number; firstName: string; lastName: string }): Promise<TUser> {
    const response = await apiUpdateUserName(params);
    return response.data;
  }

  static async updateUserPhone(id: number, phone: string): Promise<TUser> {
    const response = await apiUpdateUserPhone(id, phone);
    return response.data;
  }

  static async updateUserRole(id: number, role: string | number): Promise<TUser> {
    const response = await apiUpdateUserRole(id, role);
    return response.data;
  }

  static async updateUserStatus(id: number): Promise<TUser> {
    const response = await apiUpdateUserStatus(id);
    return response.data;
  }

  static async getUserRoles(): Promise<{ results: TRole[] }> {
    const response = await apiGetUserRoles();
    return response.data;
  }
}