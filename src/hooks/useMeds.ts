import { useState, useEffect, useCallback } from 'react';
import { MedService, MedFilters } from '../services/medService';
import { TMed, TMedsList, TKiroDetail } from '../types/medTypes';

export function useMeds() {
  const [medsList, setMedsList] = useState<TMedsList>({ count: 0, results: [] });
  const [medsLoading, setMedsLoading] = useState(false);
  const [selectedMed, setSelectedMed] = useState<TMed | null>(null);
  const [drugDetail, setDrugDetail] = useState<TMed | null>(null);
  const [activeIngredients, setActiveIngredients] = useState<any[]>([]);
  const [dosageUnits, setDosageUnits] = useState<any[]>([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [alertMsgs, setAlertMsgs] = useState<Record<string, string[]>>({});
  const [filters, setFilters] = useState<MedFilters>({ limit: 10, offset: 0 });

  // Fetch meds function
  const fetchMeds = useCallback(async (filterParams: MedFilters) => {
    setMedsLoading(true);
    try {
      console.log('Fetching meds with filters:', filterParams);
      const data = await MedService.getMeds(filterParams);
      console.log('Received meds data:', data);
      setMedsList(data);
    } catch (error) {
      console.error('Error fetching meds:', error);
      setMedsList({ count: 0, results: [] });
    } finally {
      setMedsLoading(false);
    }
  }, []);

  // Update filters and fetch data
  const updateFilters = useCallback((newFilters: Partial<MedFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    console.log('Updating med filters from:', filters, 'to:', updatedFilters);
    setFilters(updatedFilters);
    fetchMeds(updatedFilters);
  }, [filters, fetchMeds]);

  // Reset filters
  const resetFilters = useCallback(() => {
    const defaultFilters = { limit: 10, offset: 0 };
    setFilters(defaultFilters);
    fetchMeds(defaultFilters);
  }, [fetchMeds]);

  // Initial load
  useEffect(() => {
    fetchMeds(filters);
  }, []); // Only run once on mount

  const fetchIngredients = useCallback(async () => {
    setIngredientsLoading(true);
    try {
      const data = await MedService.getActiveIngredients();
      setActiveIngredients(data.results || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    } finally {
      setIngredientsLoading(false);
    }
  }, []);

  const fetchUnits = useCallback(async () => {
    setUnitsLoading(true);
    try {
      const data = await MedService.getDosageUnits();
      setDosageUnits(data.results || []);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setUnitsLoading(false);
    }
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

  return {
    // Data
    medsList,
    activeIngredients,
    dosageUnits,
    selectedMed,
    drugDetail,
    alertMsgs,
    filters,

    // Loading states
    medsLoading,
    ingredientsLoading,
    unitsLoading,

    // Actions
    setSelectedMed,
    setDrugDetail,
    updateFilters,
    resetFilters,
    getDrugDetail,
    editDrug,
    fetchIngredients,
    fetchUnits,
    fetchMeds,
    setAlertMsgs,
    clearSelection,

    // Pagination helpers
    setLimit: (limit: number) => updateFilters({ limit, offset: 0 }),
    setOffset: (offset: number) => updateFilters({ offset }),
    limit: filters.limit || 10,
    offset: filters.offset || 0,
  };
}