import { useState, useCallback } from 'react';
import { OrderService, OrderFilters } from '../services/orderService';
import { TOrder, TOrdersList, TOrdersDashboard, TCreateOrderProp } from '../types/orderTypes';
import { useAsync } from './useAsync';
import { AlertState } from '../components/alert/AlertsWrapper';
import { AlertType, AlertVariant } from '../components/alert/Alert';

export function useOrders() {
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [orderDetail, setOrderDetail] = useState<TOrder | null>(null);
  const [alertMsgs, setAlertMsgs] = useState<AlertState | null>(null);

  // Orders list with filters
  const [filters, setFilters] = useState<OrderFilters>({ limit: 10, offset: 0 });
  const {
    data: ordersList,
    loading: ordersLoading,
    error: ordersError,
    execute: refetchOrders
  } = useAsync(
    () => OrderService.getOrders(filters),
    [filters]
  );

  // Dashboard data
  const {
    data: dashboard,
    loading: dashboardLoading,
    execute: refetchDashboard
  } = useAsync(
    () => OrderService.getOrdersDashboard(),
    [],
    { immediate: false }
  );

  const updateFilters = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getOrderDetail = useCallback(async (id: string) => {
    try {
      const detail = await OrderService.getOrderDetail(id);
      setOrderDetail(detail);
      return detail;
    } catch (error) {
      console.error('Error fetching order detail:', error);
      throw error;
    }
  }, []);

  const sendOrder = useCallback(async (id: string, device?: string) => {
    try {
      const result = await OrderService.sendOrder(id, device);
      setAlertMsgs({
        type: AlertType.Success,
        messages: "Order sent successfully!",
        variant: AlertVariant.Swimming
      });
      refetchOrders();
      return result;
    } catch (error: any) {
      setAlertMsgs({
        type: AlertType.Error,
        messages: error.response?.data || { general: ["Unknown error"] },
        variant: AlertVariant.Swimming
      });
      throw error;
    }
  }, [refetchOrders]);

  const createOrder = useCallback(async (data: TCreateOrderProp) => {
    try {
      const newOrder = await OrderService.createOrder(data);
      refetchOrders();
      return newOrder;
    } catch (error: any) {
      setAlertMsgs({
        type: AlertType.Error,
        messages: error.response?.data || { general: ["Unknown error"] },
        variant: AlertVariant.Swimming
      });
      throw error;
    }
  }, [refetchOrders]);

  const editOrder = useCallback(async (id: number, data: TCreateOrderProp) => {
    try {
      const updated = await OrderService.editOrder(id, data);
      refetchOrders();
      return updated;
    } catch (error: any) {
      setAlertMsgs({
        type: AlertType.Error,
        messages: error.response?.data || { general: ["Unknown error"] },
        variant: AlertVariant.Swimming
      });
      throw error;
    }
  }, [refetchOrders]);

  const deleteOrder = useCallback(async (id: number) => {
    try {
      await OrderService.deleteOrder(id);
      refetchOrders();
    } catch (error: any) {
      setAlertMsgs({
        type: AlertType.Error,
        messages: error.response?.data || { general: ["Unknown error"] },
        variant: AlertVariant.Swimming
      });
      throw error;
    }
  }, [refetchOrders]);

  return {
    // Data
    ordersList: ordersList || { count: 0, results: [] },
    dashboard,
    selectedOrder,
    orderDetail,
    alertMsgs,

    // Loading states
    ordersLoading,
    dashboardLoading,

    // Actions
    setSelectedOrder,
    updateFilters,
    getOrderDetail,
    sendOrder,
    createOrder,
    editOrder,
    deleteOrder,
    refetchOrders,
    refetchDashboard,
    setAlertMsgs,

    // Pagination helpers
    setLimit: (limit: number) => updateFilters({ limit, offset: 0 }),
    setOffset: (offset: number) => updateFilters({ offset }),
    limit: filters.limit || 10,
    offset: filters.offset || 0,
  };
}