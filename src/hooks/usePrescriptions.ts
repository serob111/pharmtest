import { useState, useCallback } from 'react';
import { PrescriptionService, PrescriptionFilters } from '../services/prescriptionService';
import { TPrescription, TPrescriptionsList } from '../types/prescriptionTypes';
import { useAsync } from './useAsync';

export function usePrescriptions() {
  const [selectedPrescription, setSelectedPrescription] = useState<TPrescription | null>(null);
  const [prescriptionDetail, setPrescriptionDetail] = useState<TPrescription | null>(null);
  const [alertMsgs, setAlertMsgs] = useState<Partial<Record<string, string[]>>>({});

  const [filters, setFilters] = useState<PrescriptionFilters>({ limit: 10, offset: 0 });
  const {
    data: prescriptionsList,
    loading: prescriptionsLoading,
    execute: refetchPrescriptions
  } = useAsync(
    () => PrescriptionService.getPrescriptions(filters),
    [filters]
  );

  const updateFilters = useCallback((newFilters: Partial<PrescriptionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const getPrescriptionDetail = useCallback(async (id: string) => {
    try {
      const detail = await PrescriptionService.getPrescriptionDetail(id);
      setPrescriptionDetail(detail);
      return detail;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, []);

  const createPrescription = useCallback(async (data: any) => {
    try {
      const newPrescription = await PrescriptionService.createPrescription(data);
      refetchPrescriptions();
      return newPrescription;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [refetchPrescriptions]);

  const editPrescription = useCallback(async (id: number, data: any) => {
    try {
      const updated = await PrescriptionService.editPrescription(id, data);
      refetchPrescriptions();
      return updated;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [refetchPrescriptions]);

  const deletePrescription = useCallback(async (id: number) => {
    try {
      await PrescriptionService.deletePrescription(id);
      refetchPrescriptions();
    } catch (error: any) {
      setAlertMsgs(error.response?.data || {});
      throw error;
    }
  }, [refetchPrescriptions]);

  return {
    prescriptionsList: prescriptionsList || { count: 0, results: [] },
    selectedPrescription,
    prescriptionDetail,
    alertMsgs,

    prescriptionsLoading,

    setSelectedPrescription,
    updateFilters,
    getPrescriptionDetail,
    createPrescription,
    editPrescription,
    deletePrescription,
    refetchPrescriptions,
    setAlertMsgs,

    setLimit: (limit: number) => updateFilters({ limit, offset: 0 }),
    setOffset: (offset: number) => updateFilters({ offset }),
    limit: filters.limit || 10,
    offset: filters.offset || 0,
  };
}