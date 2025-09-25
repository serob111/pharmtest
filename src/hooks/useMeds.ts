import { useState, useCallback } from 'react';
import { MedService, MedFilters } from '../services/medService';
import { TMed, TMedsList, TKiroDetail } from '../types/medTypes';
import { useAsync } from './useAsync';

export function useMeds() {
  const [selectedMed, setSelectedMed] = useState<TMed | null>(null);
  const [drugDetail, setDrugDetail] = useState<TMed | null>(null);
  const [alertMsgs, setAlertMsgs] = useState<Record<string, string[]>>({});

  // Meds list with filters
  const [filters, setFilters] = useState<MedFilters>({ limit: 10, offset: 0 });
  const {
    data: medsList,
    loading: medsLoading,
    error: medsError,
    execute: refetchMeds
  } = useAsync(
    () => MedService.getMeds(filters),
    [filters]
  );

  // Active ingredients
  const {
    data: activeIngredients,
    loading: ingredientsLoading,
    execute: fetchIngredients
  } = useAsync(
    () => MedService.getActiveIngredients(),
    [],
    { immediate: false }
  );

  // Dosage units
  const {
    data: dosageUnits,
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

  return {
    // Data
    medsList: medsList || { count: 0, results: [] },
    activeIngredients: activeIngredients?.results || [],
    dosageUnits: dosageUnits?.results || [],
    selectedMed,
    drugDetail,
    alertMsgs,

    // Loading states
    medsLoading,
    ingredientsLoading,
    unitsLoading,

    // Actions
    setSelectedMed,
    setDrugDetail,
    updateFilters,
    getDrugDetail,
    editDrug,
    fetchIngredients,
    fetchUnits,
    refetchMeds,
    setAlertMsgs,

    // Pagination helpers
    setLimit: (limit: number) => updateFilters({ limit, offset: 0 }),
    setOffset: (offset: number) => updateFilters({ offset }),
    limit: filters.limit || 10,
    offset: filters.offset || 0,
  };
}