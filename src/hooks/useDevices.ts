import { useState, useEffect, useCallback } from 'react';
import { DeviceService, DeviceFilters } from '../services/deviceService';
import { TDevice, TDevicesList, TCreateDeviceProp, TConnectionDetails } from '../types/deviceTypes';

export function useDevices() {
  const [devicesList, setDevicesList] = useState<TDevicesList>({ count: 0, results: [] });
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<TDevice | null>(null);
  const [deviceDetail, setDeviceDetail] = useState<TDevice | null>(null);
  const [connectionDetails, setConnectionDetails] = useState<TConnectionDetails | null>(null);
  const [deviceEvents, setDeviceEvents] = useState<any[]>([]);
  const [deviceMessages, setDeviceMessages] = useState<any[]>([]);
  const [deviceModels, setDeviceModels] = useState<any[]>([]);
  const [deviceManufacturers, setDeviceManufacturers] = useState<any[]>([]);
  const [alertMsgs, setAlertMsgs] = useState<Record<string, string[]>>({});
  const [filters, setFilters] = useState<DeviceFilters>({ limit: 10, offset: 0 });

  // Fetch devices function
  const fetchDevices = useCallback(async (filterParams: DeviceFilters) => {
    setDevicesLoading(true);
    try {
      console.log('Fetching devices with filters:', filterParams);
      const data = await DeviceService.getDevices(filterParams);
      console.log('Received devices data:', data);
      setDevicesList(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevicesList({ count: 0, results: [] });
    } finally {
      setDevicesLoading(false);
    }
  }, []);

  // Update filters and fetch data
  const updateFilters = useCallback((newFilters: Partial<DeviceFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    console.log('Updating filters from:', filters, 'to:', updatedFilters);
    setFilters(updatedFilters);
    fetchDevices(updatedFilters);
  }, [filters, fetchDevices]);

  // Reset filters
  const resetFilters = useCallback(() => {
    const defaultFilters = { limit: 10, offset: 0 };
    setFilters(defaultFilters);
    fetchDevices(defaultFilters);
  }, [fetchDevices]);

  // Initial load
  useEffect(() => {
    fetchDevices(filters);
  }, []); // Only run once on mount

  const fetchModels = useCallback(async () => {
    try {
      const models = await DeviceService.getDeviceModels();
      setDeviceModels(models);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  }, []);

  const fetchManufacturers = useCallback(async () => {
    try {
      const manufacturers = await DeviceService.getDeviceManufacturers();
      setDeviceManufacturers(manufacturers);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    }
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
      fetchDevices(filters);
      return newDevice;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [filters, fetchDevices]);

  const editDevice = useCallback(async (id: number, data: TCreateDeviceProp) => {
    try {
      const updated = await DeviceService.editDevice(id, data);
      fetchDevices(filters);
      return updated;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [filters, fetchDevices]);

  const deleteDevice = useCallback(async (id: number) => {
    try {
      await DeviceService.deleteDevice(id);
      fetchDevices(filters);
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [filters, fetchDevices]);

  const deactivateDevice = useCallback(async (id: number) => {
    try {
      await DeviceService.deactivateDevice(id);
      fetchDevices(filters);
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [filters, fetchDevices]);

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

  const clearSelection = useCallback(() => {
    setSelectedDevice(null);
    setDeviceDetail(null);
    setConnectionDetails(null);
    setDeviceEvents([]);
    setDeviceMessages([]);
  }, []);

  return {
    // Data
    devicesList,
    deviceModels,
    deviceManufacturers,
    selectedDevice,
    deviceDetail,
    connectionDetails,
    deviceEvents,
    deviceMessages,
    alertMsgs,
    filters,

    // Loading states
    devicesLoading,

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
    fetchDevices,
    setAlertMsgs,
    clearSelection,

    // Pagination helpers
    setLimit: (limit: number) => updateFilters({ limit, offset: 0 }),
    setOffset: (offset: number) => updateFilters({ offset }),
    limit: filters.limit || 10,
    offset: filters.offset || 0,
  };
}