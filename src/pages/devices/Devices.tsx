import { useEffect, useMemo, useState } from 'react';
import Header from '../../components/header/Header';
import { useTranslation } from 'react-i18next';
import Input from '../../components/shared/ui/input/Input';
import { TDevice, useDevices } from '../../context/DeviceProvider';
import { TableDevice } from '../../components/table-device/TableDevice';
import useDebounce from '../../lib/Debounce';
import { IconMaterial } from '../../components/shared/iconMaterial/IconMaterial';
import FilterDevicePanel from '../../components/sidepanel/FilterDevicePanel';
import DevicePanel from '../../components/sidepanel/DevicePanel';
import Card from '../../components/card/Card';

export default function Devices() {
    const {
        limit,
        offset,
        devicesList,
        selectedDevice,
        loading,
        getDeviceList,
        setLimit,
        setSelectedDevice,
        setOffset,
    } = useDevices();

    const [IsFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
    const [IsDevicePanelOpen, setIsDevicePanelOpen] = useState(false)
    const [gridView, setGridView] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const { t } = useTranslation()
    const i18nDeviceDirectory = (key: string): string =>
        t(`device-directory.${key}`);
    const debouncedSearch = useDebounce(searchValue, 500)
    const [sortConfig, setSortConfig] = useState<{
        field: keyof TDevice | null;
        direction: 'asc' | 'desc';
    }>({
        field: null,
        direction: 'asc',
    });

    const handleSort = (field: keyof TDevice) => {
        setSortConfig((prev) => {
            const direction = prev.direction === 'asc' ? 'desc' : 'asc';
            return { field, direction };
        });
    };

    const paginatedDevicesList = useMemo(() => {
        const sortedDevices = [...devicesList.results];
        if (sortConfig.field) {
            sortedDevices.sort((a, b) => {
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
            ...devicesList,
            results: sortedDevices,
        };
    }, [devicesList, sortConfig, offset, limit]);

    const handleRowClick = (device: TDevice) => {
        setSelectedDevice(device);
        setIsDevicePanelOpen(true);
    };

    const handleFilterClick = () => {
        setIsFilterPanelOpen(true);
    };

    const handleSearch = (value: string) => {
        setOffset(0)
        setSearchValue(value)
    }

    useEffect(() => {
        getDeviceList({ search: debouncedSearch });
    }, [getDeviceList, debouncedSearch]);

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <div className="flex-shrink-0">
                <Header
                    create={'/'}
                    title={i18nDeviceDirectory('device-directory')}
                />
            </div>

            <div className="flex-1 flex min-h-0 relative">
                <div className={`
                    flex flex-col min-h-0 transition-all duration-500 ease-in-out
                    ${IsFilterPanelOpen || IsDevicePanelOpen ? 'w-[calc(100%-450px)]' : 'w-full'}
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
                                        placeholder={i18nDeviceDirectory('search')}
                                        size="lg"
                                        clearable
                                        rightIcon="search"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className='flex gap-2'>
                                <div
                                    onClick={handleFilterClick}
                                    className="bg-background-light-gray flex items-center justify-center border px-3 py-2 cursor-pointer  rounded-lg"
                                >
                                    <IconMaterial
                                        filled
                                        icon="filter_lists"
                                        className="cursor-pointer text-primary-light"
                                        size={15}
                                    />
                                    <p className="text-sm text-primary-light">{i18nDeviceDirectory('filters')}</p>
                                </div>
                                <div className='flex'>
                                    <div
                                        className="bg-background-light-gray flex items-center justify-center border px-3 py-2 cursor-pointer  rounded-l-lg"
                                    >
                                        <IconMaterial
                                            onClick={() => setGridView(false)}
                                            filled
                                            icon="table_rows"
                                            className={`cursor-pointer ${!gridView ? 'text-primeblue' : 'text-primary-light'}`}
                                            size={15}
                                        />
                                    </div>  <div
                                        className="bg-background-light-gray flex items-center justify-center border px-3 py-2 cursor-pointer  rounded-r-lg"
                                    >
                                        <IconMaterial
                                            onClick={() => setGridView(true)}
                                            filled
                                            icon="grid_view"
                                            className={`cursor-pointer ${gridView ? 'text-primeblue' : 'text-primary-light'}`}

                                            size={15}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        gridView ? (
                            <div className={`grid ${IsFilterPanelOpen || IsDevicePanelOpen ? 'grid-cols-2' : "grid-cols-3"} gap-4 px-4 mt-4 overflow-y-auto`}>
                                {paginatedDevicesList.results.map((device) => (
                                    <Card
                                        isActive={selectedDevice?.id === device.id}
                                        onClick={() => handleRowClick(device)}
                                        itemsClass='flex px-1 flex-col gap-1 items-start'
                                        key={device.id}
                                        className="mt-2 cursor-pointer"
                                        title={device.name}
                                        subtitle={device.department}
                                        status={device.status}
                                        items={[
                                            { label: "Manufacturer, Model", value: device?.manufacturer + ',' + device.model },
                                            { label: "Date Added:", value: device?.created_stamp },
                                            { label: "Last Health Check:", value: device?.last_health_check },
                                        ]}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 mt-4 overflow-auto">
                                <TableDevice
                                    filterNotFound={IsFilterPanelOpen}
                                    offset={offset}
                                    setOffset={setOffset}
                                    handleSort={handleSort}
                                    handleRowClick={handleRowClick}
                                    setLimit={setLimit}
                                    devicesList={paginatedDevicesList}
                                    limit={limit}
                                />
                            </div>
                        )
                    }

                </div>
                <FilterDevicePanel
                    className={`
                        absolute top-0 right-0 h-full w-[450px] bg-white shadow-lg
                        transform transition-transform duration-500 ease-in-out z-10
                        ${IsFilterPanelOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}
                    isOpen={IsFilterPanelOpen}
                    onClose={() => setIsFilterPanelOpen(false)}
                />
                <DevicePanel
                    className={`
                        absolute top-0 right-0 h-full w-[450px] bg-white shadow-lg flex flex-col
                        transform transition-transform duration-500 ease-in-out z-20
                        ${IsDevicePanelOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}
                    isOpen={IsDevicePanelOpen}
                    onClose={() => setIsDevicePanelOpen(false)}
                />
            </div>
        </div>
    );
}