import { 
  apiGetOrders, 
  apiGetOrderDetail, 
  apiGetOrdersDashboard,
  apiSendorder,
  apiCreateOrder,
  apiEditOrder,
  apiDeleteOrder
} from '../api/orders/orders';
import { TOrder, TOrdersList, TOrdersDashboard, TCreateOrderProp } from '../context/OrdersProvider';

export interface OrderFilters {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export class OrderService {
  static async getOrders(filters: OrderFilters = {}): Promise<TOrdersList> {
    const response = await apiGetOrders(filters);
    return response.data;
  }

  static async getOrderDetail(id: string): Promise<TOrder> {
    const response = await apiGetOrderDetail(id);
    return response.data;
  }

  static async getOrdersDashboard(): Promise<TOrdersDashboard> {
    const response = await apiGetOrdersDashboard();
    return response.data;
  }

  static async sendOrder(id: string, device?: string): Promise<any> {
    const response = await apiSendorder(id, device);
    return response.data;
  }

  static async createOrder(data: TCreateOrderProp): Promise<TOrder> {
    const response = await apiCreateOrder(data);
    return response.data;
  }

  static async editOrder(id: number, data: TCreateOrderProp): Promise<TOrder> {
    const response = await apiEditOrder(id, data);
    return response.data;
  }

  static async deleteOrder(id: number): Promise<void> {
    await apiDeleteOrder(id);
  }
}