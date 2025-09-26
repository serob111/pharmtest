import React, { useEffect, useState } from 'react';
import { IconMaterial } from '../shared/iconMaterial/IconMaterial';
import { useTranslation } from 'react-i18next';
import SelectInput from '../shared/ui/input/SelectInput';
import { useDevices } from '../../hooks/useDevices';

export interface FilterDevicePanelProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

const FilterDevicePanel: React.FC<FilterDevicePanelProps> = ({
    isOpen,
    onClose,
    className = ''
}) => {
    const {
        deviceModels,
        deviceManufacturers,
        filters,
        fetchModels,
        fetchManufacturers,
        updateFilters,
        resetFilters
    } = useDevices()

    const { t } = useTranslation()
    const i18nDeviceDirectory = (key: string): string =>
        t(`device-directory.${key}`)
    
    // Local state for filters
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    const statuses = [
        { id: 'active', label: "Active" },
        { id: "error", label: "Error" },
        { id: "inactive", label: "Inactive" },
        { id: "maintenance", label: "Maintenance" }
    ]
    
    // Initialize local state from current filters
    useEffect(() => {
        setSelectedModels(filters.models || []);
        setSelectedManufacturers(filters.manufacturers || []);
        setSelectedStatuses(filters.statuses || []);
    }, [filters]);
    
    useEffect(() => {
        if (isOpen) {
            fetchManufacturers()
            fetchModels()
        }
    }, [isOpen])
    
    const handleModelChange = (value: string[]) => {
        console.log('Model filter changed:', value);
        setSelectedModels(value);
        updateFilters({
            models: value.length > 0 ? value : undefined,
            offset: 0
        });
    };

    const handleManufacturerChange = (value: string[]) => {
        console.log('Manufacturer filter changed:', value);
        setSelectedManufacturers(value);
        updateFilters({
            manufacturers: value.length > 0 ? value : undefined,
            offset: 0
        });
    };

    const handleStatusChange = (value: string[]) => {
        console.log('Status filter changed:', value);
        setSelectedStatuses(value);
        updateFilters({
            statuses: value.length > 0 ? value : undefined,
            offset: 0
        });
    };

    const handleClearFilters = () => {
        console.log('Clearing all filters');
        setSelectedModels([]);
        setSelectedManufacturers([]);
        setSelectedStatuses([]);
        resetFilters();
    };
    
    return (
        <div
            className={`p-4 top-0 right-0 h-full w-[450px] bg-white border-l transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                } ${className}`}
        >
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                    <div>
                        <h2
                            className="text-lg font-semibold text-gray-900 font-montserrat  truncate max-w-[250px]"
                            title={i18nDeviceDirectory('filters')}
                        >
                            {i18nDeviceDirectory('filters')}
                        </h2>
                        <p className="text-sm text-gray-600 font-montserrat">
                            Filter devices by model, manufacturer, or status
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClearFilters}
                        className="p-2 text-gray-400 flex items-center justify-center border hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                    >
                        <IconMaterial
                            filled
                            icon="clear_all"
                            className="cursor-pointer"
                            size={20}
                        />
                    </button>
                    <div
                        className="p-2 text-gray-400 flex items-center justify-center border  hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                    >
                        <IconMaterial
                            filled
                            icon="close"
                            className="cursor-pointer"
                            size={20}
                            onClick={onClose}
                        />
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4 py-6 text-sm text-primary-dark text-bold font-medium'>
                <p>{i18nDeviceDirectory('by-model')}</p>
                <SelectInput
                    multiSelect
                    name="device_model"
                    required
                    placeholder={i18nDeviceDirectory('select-model')}
                    value={selectedModels}
                    onChange={handleModelChange}
                    options={deviceModels.map(model => ({
                        id: model.id,
                        label: model.name,
                        name: model.name
                    }))}
                />
                <p>{i18nDeviceDirectory('by-manufacturer')}</p>
                <SelectInput
                    important
                    name="device_manufacturer"
                    required
                    multiSelect
                    placeholder={i18nDeviceDirectory('select-type')}
                    onChange={handleManufacturerChange}
                    value={selectedManufacturers}
                    options={deviceManufacturers.map(manufacturer => ({
                        id: manufacturer.id,
                        label: manufacturer.name,
                        name: manufacturer.name
                    }))}
                />
                <p>{i18nDeviceDirectory('by-status')}</p>
                <SelectInput
                    important
                    name="device_status"
                    required
                    multiSelect
                    placeholder={i18nDeviceDirectory('select-status')}
                    onChange={handleStatusChange}
                    value={selectedStatuses}
                    options={statuses}
                />
            </div>
        </div>
    );
};

export default FilterDevicePanel;