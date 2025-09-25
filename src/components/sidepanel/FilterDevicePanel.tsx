import React, { useEffect, useState } from 'react';
import { IconMaterial } from '../shared/iconMaterial/IconMaterial';
import { useTranslation } from 'react-i18next';
import SelectInput from '../shared/ui/input/SelectInput';
import { useDevices } from '../../context/DeviceProvider';

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
        getDeviceModels,
        getDeviceManufacturers,
        getDeviceList
    } = useDevices()

    const { t } = useTranslation()
    const i18nDeviceDirectory = (key: string): string =>
        t(`device-directory.${key}`)
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [selectedManufacturers, setSelectedManufactureres] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatus] = useState<string[]>([]);

    const statuses = [
        { id: 'active', label: "Active" },
        { id: "error", label: "Error" },
        { id: "inactive", label: "Inactive" },
        { id: "maintenance", label: "Maintenance" }
    ]
    useEffect(() => {
        if (isOpen) {
            getDeviceManufacturers()
            getDeviceModels()
        }
    }, [isOpen])
    useEffect(() => {
        getDeviceList({
            manufacturers: selectedManufacturers,
            models: selectedModels,
            statuses: selectedStatuses
        }
        );
    }, [selectedModels, selectedManufacturers, selectedStatuses]);
    return (
        <>

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
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">

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
                        onChange={(value) => setSelectedModels(value as string[])}
                        options={deviceModels}
                    />
                    <p>{i18nDeviceDirectory('by-manufacturer')}</p>
                    <SelectInput
                        important
                        name="device_manufacturer"
                        required
                        multiSelect
                        placeholder={i18nDeviceDirectory('select-type')}
                        onChange={(vale) => setSelectedManufactureres(vale as string[])}
                        value={selectedManufacturers}
                        options={deviceManufacturers}
                    />
                    <p>{i18nDeviceDirectory('by-status')}</p>
                    <SelectInput
                        important
                        name="device_status"
                        required
                        multiSelect
                        placeholder={i18nDeviceDirectory('select-status')}
                        onChange={(value) => setSelectedStatus(value as string[])}
                        value={selectedStatuses}
                        options={statuses}
                    />
                </div>
            </div>
        </>
    );
};

export default FilterDevicePanel;