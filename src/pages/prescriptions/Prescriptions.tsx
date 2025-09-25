import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/header/Header';
import { useTranslation } from 'react-i18next';
import Input from '../../components/shared/ui/input/Input';
import { TPrescription } from '../../context/PrescriptionProvider';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import useDebounce from '../../lib/Debounce';
import { IconMaterial } from '../../components/shared/iconMaterial/IconMaterial';
import { TablePrescription } from '../../components/table-prescriptions/TablePrescription';
import { useNavigate } from 'react-router';
import LoadingSpinner from '../../components/shared/ui/LoadingSpinner';
// import FilterPrescriptionPanel from '../../components/sidepanel/FilterPrescriptionPanel';
// import PrescriptionPanel from '../../components/sidepanel/PrescriptionPanel';

export default function Prescriptions() {
    const {
        limit,
        offset,
        prescriptionsList,
        prescriptionsLoading,
        setLimit,
        setSelectedPrescription,
        setOffset,
        updateFilters,
    } = usePrescriptions();

    const [IsFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
    const [IsPrescriptionPanelOpen, setIsPrescriptionPanelOpen] = useState(false)
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const { t } = useTranslation()
    const i18nPrescriptionDirectory = (key: string): string =>
        t(`prescription-directory.${key}`);
    const debouncedSearch = useDebounce(searchValue, 500)
    const [sortConfig, setSortConfig] = useState<{
        field: keyof TPrescription | null;
        direction: 'asc' | 'desc';
    }>({
        field: null,
        direction: 'asc',
    });

    const handleSort = (field: keyof TPrescription) => {
        setSortConfig((prev) => {
            const direction = prev.direction === 'asc' ? 'desc' : 'asc';
            return { field, direction };
        });
    };

    const paginatedPrescriptionsList = useMemo(() => {
        const sortedPrescriptions = [...prescriptionsList.results];
        if (sortConfig.field) {
            sortedPrescriptions.sort((a, b) => {
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
            ...prescriptionsList,
            results: sortedPrescriptions,
        };
    }, [prescriptionsList, sortConfig, offset, limit]);

    const handleRowClick = (prescription: TPrescription) => {
        setSelectedPrescription(prescription);
        navigate(`/prescriptions/${prescription.prescription_id}`, {
            state: { id: prescription.id }
        });
    };


    const handleFilterClick = () => {
        setIsFilterPanelOpen(true);
    };

    const handleSearch = (value: string) => {
        setOffset(0)
        setSearchValue(value)
    }

    useEffect(() => {
        updateFilters({ search: debouncedSearch || undefined });
    }, [debouncedSearch, limit, offset]);

    return (
        <div className="relative h-screen flex flex-col overflow-hidden">
            <Header
                title={i18nPrescriptionDirectory('prescription-directory')}
            />
            <div className="flex-1 flex relative overflow-hidden">

                <div className={`
                    flex flex-col transition-all duration-500 ease-in-out overflow-hidden
                    ${IsFilterPanelOpen || IsPrescriptionPanelOpen ? 'w-[calc(100%-450px)]' : 'w-full'}
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
                                        placeholder={i18nPrescriptionDirectory('search')}
                                        size="lg"
                                        clearable
                                        rightIcon="search"
                                    />
                                </div>
                            </div>
                            <div
                                onClick={handleFilterClick}
                                className="bg-background-light-gray flex items-center justify-center border px-3 py-2 cursor-pointer mr-4 rounded-lg"
                            >
                                <IconMaterial
                                    filled
                                    icon="filter_lists"
                                    className="cursor-pointer text-primary-light"
                                    size={15}
                                />
                                <p className="text-sm text-primary-light">{i18nPrescriptionDirectory('filters')}</p>
                            </div>
                        </div>
                    </div>
                    
                    {prescriptionsLoading && (
                        <div className="flex-1 flex items-center justify-center">
                            <LoadingSpinner size="lg" text="Loading prescriptions..." />
                        </div>
                    )}
                    
                    {!prescriptionsLoading && <div className="flex-1 overflow-auto">
                        <TablePrescription
                            filterNotFound={IsFilterPanelOpen}
                            offset={offset}
                            setOffset={setOffset}
                            handleSort={handleSort}
                            handleRowClick={handleRowClick}
                            setLimit={setLimit}
                            prescriptionsList={paginatedPrescriptionsList}
                            limit={limit}
                        />
                    </div>}
                </div>
                {/* <FilterPrescriptionPanel
                    className={`
                        absolute top-0 right-0 h-full w-[450px] overflow-y-auto bg-white shadow-lg
                        transform transition-transform duration-500 ease-in-out z-10
                        ${IsFilterPanelOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}
                    isOpen={IsFilterPanelOpen}
                    onClose={() => setIsFilterPanelOpen(false)}
                />
    */}
            </div>
        </div>
    );
}