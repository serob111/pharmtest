import { useState, useCallback } from 'react';
import { MedService, MedFilters } from '../services/medService';
import { TMed, TMedsList, TKiroDetail } from '../types/medTypes';
import { useAsync } from './useAsync';

export function useMeds() {
  const [selectedMed, setSelectedMed] = useState<TMed | null>(null);
  const [drugDetail, setDrugDetail] = useState<TMed | null>(null);
  const [activeIngredients, setActiveIngredients] = useState<any[]>([]);
  const [dosageUnits, setDosageUnits] = useState<any[]>([]);
  const [alertMsgs, setAlertMsgs] = useState<Record<string, string[]>>({});

  const [filters, setFilters] = useState<MedFilters>({ limit: 10, offset: 0 });
  const {
    data: medsList,
    loading: medsLoading,
    execute: refetchMeds
  } = useAsync(
    () => MedService.getMeds(filters),
    [filters]
  );

  const {
    data: ingredientsData,
    loading: ingredientsLoading,
    execute: fetchIngredients
  } = useAsync(
    () => MedService.getActiveIngredients(),
    [],
    { immediate: false }
  );

  const {
    data: unitsData,
    loading: unitsLoading,
    execute: fetchUnits
  } = useAsync(
    () => MedService.getDosageUnits(),
    [],
    { immediate: false }
  );

  const updateFilters = useCallback((newFilters: Partial<MedFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ limit: 10, offset: 0 });
  }, []);

  const getDrugDetail = useCallback(async (id: string) => {
    try {
      const detail = await MedService.getMedDetail(id);
      setDrugDetail(detail);
      return detail;
    } catch (error) {
      console.error('Error fetching drug detail:', error);
      throw error;
    }
  }, []);

  const editDrug = useCallback(async (id: string, params: TKiroDetail) => {
    try {
      const updated = await MedService.editMed(id, params);
      setDrugDetail(updated);
      setAlertMsgs({});
      return updated;
    } catch (error: any) {
      setAlertMsgs(error.response?.data || { error: ["Error saving"] });
      throw error;
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMed(null);
    setDrugDetail(null);
  }, []);

  // Update local state when async data changes
  useCallback(() => {
    if (ingredientsData) {
      setActiveIngredients(ingredientsData.results || []);
    }
  }, [ingredientsData]);

  useCallback(() => {
    if (unitsData) {
      setDosageUnits(unitsData.results || []);
    }
  }, [unitsData]);

  return {
    medsList: medsList || { count: 0, results: [] },
    activeIngredients,
    dosageUnits,
    selectedMed,
    drugDetail,
    alertMsgs,
    filters,

    medsLoading,
    ingredientsLoading,
    unitsLoading,

    setSelectedMed,
    setDrugDetail,
    updateFilters,
    resetFilters,
    getDrugDetail,
    editDrug,
    fetchIngredients,
    fetchUnits,
    refetchMeds,
    setAlertMsgs,
    clearSelection,

    setLimit: (limit: number) => updateFilters({ limit, offset: 0 }),
    setOffset: (offset: number) => updateFilters({ offset }),
    limit: filters.limit || 10,
    offset: filters.offset || 0,
  };
}