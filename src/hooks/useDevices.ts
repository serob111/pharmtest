import { useState, useCallback } from 'react';
import { DeviceService, DeviceFilters } from '../services/deviceService';
import { TDevice, TDevicesList, TCreateDeviceProp, TConnectionDetails } from '../types/deviceTypes';
import { useAsync } from './useAsync';

export function useDevices() {
  const [selectedDevice, setSelectedDevice] = useState<TDevice | null>(null);
  const [deviceDetail, setDeviceDetail] = useState<TDevice | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<TConnectionDetails | null>(null);
  const [deviceEvents, setDeviceEvents] = useState<any[]>([]);
  const [deviceMessages, setDeviceMessages] = useState<any[]>([]);
  const [alertMsgs, setAlertMsgs] = useState<Record<string, string[]>>({});

  // Device list with filters
  const [filters, setFilters] = useState<DeviceFilters>({ limit: 10, offset: 0 });
  const {
    data: devicesList,
    loading: devicesLoading,
    error: devicesError,
    execute: refetchDevices
  } = useAsync(
    () => DeviceService.getDevices(filters),
    [filters]
  );

  // Device models
  const {
    data: deviceModels,
    loading: modelsLoading,
    execute: fetchModels
  } = useAsync(
    () => DeviceService.getDeviceModels(),
    [],
    { immediate: false }
  );

  // Device manufacturers
  const {
    data: deviceManufacturers,
    loading: manufacturersLoading,
    execute: fetchManufacturers
  } = useAsync(
    () => DeviceService.getDeviceManufacturers(),
    [],
    { immediate: false }
  );

  const updateFilters = useCallback((newFilters: Partial<DeviceFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      console.log('Updating device filters:', updated);
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ limit: 10, offset: 0 });
  }, []);
  const getDeviceDetail = useCallback(async (id: number) => {
    try {
      const detail = await DeviceService.getDeviceDetail(id);
      setDeviceDetail(detail);
      return detail;
    } catch (error) {
      console.error('Error fetching device detail:', error);
      throw error;
    }
  }, []);

  const getConnectionSettings = useCallback(async (id: number) => {
    try {
      const settings = await DeviceService.getDeviceConnectionSettings(id);
      setConnectionDetails(settings);
      return settings;
    } catch (error) {
      console.error('Error fetching connection settings:', error);
      throw error;
    }
  }, []);

  const updateConnectionSettings = useCallback(async (id: number, params: TConnectionDetails) => {
    try {
      const updated = await DeviceService.updateConnectionSettings(id, params);
      setConnectionDetails(updated);
      setAlertMsgs({});
      return updated;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, []);

  const createDevice = useCallback(async (data: TCreateDeviceProp) => {
    try {
      const newDevice = await DeviceService.createDevice(data);
      refetchDevices();
      return newDevice;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [refetchDevices]);

  const editDevice = useCallback(async (id: number, data: TCreateDeviceProp) => {
    try {
      const updated = await DeviceService.editDevice(id, data);
      refetchDevices();
      return updated;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [refetchDevices]);

  const deleteDevice = useCallback(async (id: number) => {
    try {
      await DeviceService.deleteDevice(id);
      refetchDevices();
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [refetchDevices]);

  const deactivateDevice = useCallback(async (id: number) => {
    try {
      await DeviceService.deactivateDevice(id);
      refetchDevices();
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [refetchDevices]);

  const pingDevice = useCallback(async (id: number) => {
    try {
      return await DeviceService.pingDevice(id);
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, []);

  const getDeviceEvents = useCallback(async (id: number) => {
    try {
      const events = await DeviceService.getDeviceEvents(id);
      setDeviceEvents(events);
      return events;
    } catch (error) {
      console.error('Error fetching device events:', error);
      throw error;
    }
  }, []);

  const getDeviceMessages = useCallback(async (id: number) => {
    try {
      const messages = await DeviceService.getDeviceMessages(id);
      setDeviceMessages(messages);
      return messages;
    } catch (error) {
      console.error('Error fetching device messages:', error);
      throw error;
    }
  }, []);

  // Clear selected device and related data
  const clearSelection = useCallback(() => {
    setSelectedDevice(null);
    setDeviceDetail(null);
    setConnectionDetails(null);
    setDeviceEvents([]);
    setDeviceMessages([]);
  }, []);

  return {
    // Data
    devicesList: devicesList || { count: 0, results: [] },
    deviceModels: deviceModels || [],
    deviceManufacturers: deviceManufacturers || [],
    selectedDevice,
    deviceDetail,
    connectionDetails,
    deviceEvents,
    deviceMessages,
    alertMsgs,
    filters,

    // Loading states
    devicesLoading,
    modelsLoading,
    manufacturersLoading,

    // Actions
    setSelectedDevice,
    setDeviceDetail,
    updateFilters,
    resetFilters,
    getDeviceDetail,
    getConnectionSettings,
    updateConnectionSettings,
    createDevice,
    editDevice,
    deleteDevice,
    deactivateDevice,
    pingDevice,
    getDeviceEvents,
    getDeviceMessages,
    fetchModels,
    fetchManufacturers,
    refetchDevices,
    setAlertMsgs,
    clearSelection,

    // Pagination helpers
    setLimit: (limit: number) => updateFilters({ limit, offset: 0 }),
    setOffset: (offset: number) => updateFilters({ offset }),
    limit: filters.limit || 10,
    offset: filters.offset || 0,
  };
}