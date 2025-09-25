import React, { useState } from 'react';
import DevaiceDetails from '../../pages/devices/details/DevaiceDetails';
import DetailEvents from '../../pages/devices/details/DeviceEvents';
import DevicesMessages from '../../pages/devices/details/DeviceMessages';
export type TabType = 'details' | 'events' | 'messages';

interface TabPanelProps {
    deviceName: string;
    events: DeviceEvent[];
    openDeleteModal: () => void;
    openConectionSettings: () => void
}
export interface DeviceEvent {
    id: string;
    timestamp: string;
    event_type: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ openDeleteModal, openConectionSettings }) => {
    const [activeTab, setActiveTab] = useState<TabType>('details');

    const tabs = [
        { id: 'details' as TabType, label: 'Device Details' },
        { id: 'events' as TabType, label: 'Device Events' },
        { id: 'messages' as TabType, label: 'Integration Messages' },
    ];

    return (
        <div className="w-full h-full bg-white shadow-sm flex flex-col">
            <div className="flex flex-shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1  justify-start py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                            ? 'text-primeblue border-b-2 border-primeblue bg-blue-50'
                            : 'text-primary-light hover:text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">

                {activeTab === 'details' && (
                    <DevaiceDetails openConectionSettings={openConectionSettings} openDeleteModal={openDeleteModal} />
                )}

                {activeTab === 'events' && (
                    <DetailEvents />
                )}
                {activeTab === 'messages' && (
                    <DevicesMessages />
                )}
            </div>
        </div>
    );
};