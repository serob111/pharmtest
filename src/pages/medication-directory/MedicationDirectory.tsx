import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/header/Header';

import { useTranslation } from 'react-i18next';
import Input from '../../components/shared/ui/input/Input';
import Switch from '../../components/shared/ui/switch/switch';
import { IconMaterial } from '../../components/shared/iconMaterial/IconMaterial';
import { TableMed } from '../../components/table-med/TableMed';
import { TMed, useMeds } from '../../context/MedDirProvider';
import DrugPanel from '../../components/sidepanel/DrugPanel';
import useDebounce from '../../lib/Debounce';

export default function MedicationDirectory() {
  const {
    limit,
    offset,
    isPanelOpen,
    medsList,
    getDrugList,
    setLimit,
    setIsPanelOpen,
    setSelectedMed,
    setOffset
  } = useMeds();
  const [searchValue, setSearchValue] = useState('')
  const [useInKiro, setUseInKiro] = useState(false)
  const [isOpenDrugModal, setIsOpenDrugModal] = useState(false)
  const { t } = useTranslation()
  const i18nMedDirectory = (key: string): string =>
    t(`med-directory.${key}`);
  const debouncedSearch = useDebounce(searchValue, 500)

  const [sortConfig, setSortConfig] = useState<{
    field: keyof TMed | null;
    direction: 'asc' | 'desc';
  }>({
    field: null,
    direction: 'asc',
  });

  const handleSort = (field: keyof TMed) => {
    setSortConfig((prev) => {
      const direction = prev.direction === 'asc' ? 'desc' : 'asc';
      return { field, direction };
    });
  };

  const paginatedMedsList = useMemo(() => {
    const sortedMeds = [...medsList.results];
    if (sortConfig.field) {
      sortedMeds.sort((a, b) => {
        const aVal = a?.[sortConfig.field!];
        const bVal = b?.[sortConfig.field!];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return {
      ...medsList,
      results: sortedMeds,
    };
  }, [medsList, sortConfig, offset, limit]);

  const handleRowClick = (med: TMed) => {
    setSelectedMed(med);
    setIsPanelOpen(true);
  };

  const handleSearch = (value: string) => {
    setOffset(0)
    setSearchValue(value)
  }

  const toggleKiro = () => {
    setOffset(0)
    setUseInKiro(!useInKiro)
  }

  useEffect(() => {
    if (debouncedSearch) {
      getDrugList(useInKiro, debouncedSearch);
    } else {
      getDrugList(useInKiro)
    }
  }, [debouncedSearch, useInKiro, limit, offset]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header title={i18nMedDirectory('med-directory')} />
      <div className="flex-1 flex relative min-h-0">
        <div className={`
          flex flex-col min-h-0 transition-all duration-500 ease-in-out
          ${isPanelOpen ? 'w-[calc(100%-450px)]' : 'w-full'}
        `}>
          <div className="flex-shrink-0 p-4 bg-white border-b">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <div>
                  <Input
                    onClear={() => setSearchValue('')}
                    name="search"
                    onChange={(e) => handleSearch(e.target.value)}
                    value={searchValue}
                    placeholder={i18nMedDirectory('search')}
                    size="lg"
                    clearable
                    rightIcon="search"
                  />
                </div>
                <Switch
                  checked={useInKiro}
                  onChange={toggleKiro}
                  label="Only with KIRO Data"
                  size="md"
                />
              </div>
              <div className="text-black text-sm flex justify-center gap-2 items-center">
                <IconMaterial
                  filled
                  icon="sync"
                  className="cursor-pointer"
                  size={16}
                  onClick={getDrugList}
                  iconColor="var(--tokens-text-secondary-text)"
                />
                {i18nMedDirectory('last-updated')} {
                  medsList.last_updated_stamp
                    ? new Date(medsList.last_updated_stamp).toLocaleString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                    : "—"
                }
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto">
            <TableMed
              offset={offset}
              onEdit={() => setIsOpenDrugModal(true)}
              setOffset={setOffset}
              handleSort={handleSort}
              handleRowClick={handleRowClick}
              setLimit={setLimit}
              medsList={paginatedMedsList}
              limit={limit}
            />
          </div>
        </div>

        <DrugPanel
          isOpenDrugModal={isOpenDrugModal}
          setIsOpenDrugModal={setIsOpenDrugModal}
          className={`
            absolute top-0 right-0 h-full w-[450px] bg-white shadow-lg
            transform transition-transform duration-500 ease-in-out z-10
            ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          isOpen={isPanelOpen}
          onClose={() => {
            setSelectedMed(null);
            setIsPanelOpen(false)
          }}
        />
      </div>
    </div>
  );
}