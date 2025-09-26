import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useMemo,
    useState,
    useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { apiCreateDevice, apiDeactivateDevice, apiDeleteDevice, apiEditDevice, apiGetDeviceConnectionSettings, apiGetDeviceDetail, apiGetDeviceEvents, apiGetDeviceManufacturers, apiGetDeviceMessages, apiGetDeviceModels, apiGetDevices, apiPingDevice, apiUpdateConnection } from '../api/devices/devices';
import { useGlobalLoading } from './GlobalLoadingProvider';
interface DeviceListOptions {
    search?: string;
    manufacturers?: string[];
    models?: string[];
    statuses?: string[];
}
type TProps = {
    children: ReactNode;
};
export type TDeviceModel = {

    id: number,
    manufacturer: {
        id: number,
        name: string
    },
    name: string,
    protocol: {
        id: number,
        name: string
    }
    ,
}
type TContext = {
    selectedDevice: TDevice | null;
    limit: number;
    offset: number;
    devicesList: TDevicesList;
    deviceModels: TDeviceModel[];
    deviceManufacturers: any;
    deviceDetail: TDevice | null,
    loading: boolean;
    alertMsgs: Partial<Record<string, string[] | any>>;
    updateConnectionSettins: (id: number, params: TConnectionDetails) => Promise<TConnectionDetails | null>;
    getDeviceDetail: (id: number) => void;
    pingDevice: (id: number) => void;
    deactivateDevice: (id: number) => void;
    deleteteDevice: (id: number) => void;
    getDevciceLatestEvents: (id: number) => void;
    getDevciceLatestMessages: (id: number) => void;
    getDeviceManufacturers: () => void;
    getDeviceModels: () => void;
    deviceEvents: TDeviceEvents[];
    CreateDevice: (data: TCreateDeviceProp) => void;
    EditDevice: (id: number, data: TCreateDeviceProp) => void;
    deviceMessages: TDeviceMessages[];
    connectionDetails: TConnectionDetails,
    getDeviceConnection: (id: number) => void;
    getDeviceList: (options?: {
        search?: string;
        manufacturers?: string[];
        models?: string[];
        statuses?: string[];
    }) => Promise<void>;
    setOffset: Dispatch<SetStateAction<number>>;
    setLimit: Dispatch<SetStateAction<number>>;
    setSelectedDevice: Dispatch<SetStateAction<TDevice | null>>;
};

export type TDevice = {
    id: 1,
    name: string;
    model: string;
    manufacturer: string;
    department: string;
    created_stamp: Date;
    status: string;
    last_health_check: Date;
    config: {
        id: number;
        description: string;
        applied_at: Date;
        version: number;
        protocol: string;
        ip_address: string;
        port: number;
    }
};

export type TDeviceEvents = {
    id: number,
    event_type: string,
    actor: string,
    created_at: Date | null
}

export type TDeviceMessages = {
    created_stamp: string
    error_code: string
    error_details: string
    finished_at: Date
    id: number
    message_type: string
    status: string
}

export type TDevicesList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TDevice[];
    last_updated_stamp?: Date
};

export interface TConnectionDetails {
    connection_name: string,
    ip_address: string,
    port: number,
    connection_timeout: number,
    read_timeout: number,
    retries: number,
    backoff_strategy: string,
    keep_alive_interval: number,
    failure_threshold: number,
    description: string,
    auth_username: string,
    auth_password: string
}

export type TCreateDeviceProp = {
    model: number | string,
    name: string,
    location: string,
    config: {
        ip_address: string,
        port: number,
        description?: string,
        kiro_device_type?: number,
        kiro_device_id?: number
    }

}

const DeviceContext = createContext<TContext>({} as TContext);


export const DeviceProvider = ({ children }: TProps) => {
    const [devicesList, setDevicesList] = useState<TDevicesList>({
        count: 0,
        results: [],
    });
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [selectedDevice, setSelectedDevice] = useState<TDevice | null>(null);
    const [loading, setLoading] = useState(false);
    const [alertMsgs, setAlertMessages] = useState<Partial<Record<string, string[] | any>>>({});
    const [deviceModels, setDeviceModels] = useState<TDeviceModel[]>([])
    const [deviceManufacturers, setDeviceManufacturers] = useState<any[]>([])
    const [deviceDetail, setDeviceDetail] = useState<TDevice | null>(null);
    const [deviceEvents, setDeviceEvents] = useState<TDeviceEvents[]>([] as TDeviceEvents[])
    const [deviceMessages, setDeviceMessages] = useState<TDeviceMessages[]>([] as TDeviceMessages[])
    const [connectionDetails, setConnectionDetails] = useState({} as TConnectionDetails)
    
    const { addLoadingSource, removeLoadingSource } = useGlobalLoading();
    const { t } = useTranslation()
    const CreateDevice = useCallback(async (data: TCreateDeviceProp) => {
        addLoadingSource('device-create');
        try {
            setAlertMessages({});
            const response = await apiCreateDevice(data);
            if (response.data) {
                window.location.assign('/devices')
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to create device'] });
        } finally {
            removeLoadingSource('device-create');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const EditDevice = useCallback(async (id: number, data: TCreateDeviceProp) => {
        addLoadingSource('device-edit');
        try {
            setAlertMessages({});
            const response = await apiEditDevice(id, data);
            if (response.data) {
                window.location.assign('/devices')
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to edit device'] });
        } finally {
            removeLoadingSource('device-edit');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const getDeviceList = useCallback(async ({
        search,
        manufacturers,
        models,
        statuses,
    }: DeviceListOptions = {}) => {
        setLoading(true);
        addLoadingSource('device-list');
        try {
            setAlertMessages({});
            const response = await apiGetDevices({
                limit,
                offset,
                search,
                manufacturers,
                models,
                statuses,
            });

            if (response.data) {
                setDevicesList(response.data);
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: [t('error')] });
        } finally {
            setLoading(false);
            removeLoadingSource('device-list');
        }
    }, [limit, offset, addLoadingSource, removeLoadingSource, t]);

    const getDeviceModels = useCallback(async () => {
        addLoadingSource('device-models');
        try {
            setAlertMessages({});
            const resposnse = await apiGetDeviceModels();
            if (resposnse.data) {
                setDeviceModels(resposnse.data.results)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load device models'] })
        } finally {
            removeLoadingSource('device-models');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const getDeviceManufacturers = useCallback(async () => {
        addLoadingSource('device-manufacturers');
        try {
            setAlertMessages({});
            const resposnse = await apiGetDeviceManufacturers();
            if (resposnse.data) {
                setDeviceManufacturers(resposnse.data.results)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load device manufacturers'] })
        } finally {
            removeLoadingSource('device-manufacturers');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const getDeviceDetail = useCallback(async (id: number) => {
        addLoadingSource('device-detail');
        try {
            setAlertMessages({});
            const resposnse = await apiGetDeviceDetail(id);
            if (resposnse.data) {
                setDeviceDetail(resposnse.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load device detail'] })
        } finally {
            removeLoadingSource('device-detail');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const pingDevice = useCallback(async (id: number) => {
        addLoadingSource('device-ping');
        try {
            setAlertMessages({});
            const resposnse = await apiPingDevice(id);
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to ping device'] })
        } finally {
            removeLoadingSource('device-ping');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const deactivateDevice = useCallback(async (id: number) => {
        addLoadingSource('device-deactivate');
        try {
            setAlertMessages({});
            await apiDeactivateDevice(id);
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to deactivate device'] })
        } finally {
            removeLoadingSource('device-deactivate');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const deleteteDevice = useCallback(async (id: number) => {
        addLoadingSource('device-delete');
        try {
            setAlertMessages({});
            await apiDeleteDevice(id);
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to delete device'] })
        } finally {
            removeLoadingSource('device-delete');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const getDevciceLatestEvents = useCallback(async (id: number) => {
        addLoadingSource('device-events');
        try {
            setAlertMessages({});
            const response = await apiGetDeviceEvents(id);
            if (response.data) {
                setDeviceEvents(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load device events'] })
        } finally {
            removeLoadingSource('device-events');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const getDevciceLatestMessages = useCallback(async (id: number) => {
        addLoadingSource('device-messages');
        try {
            setAlertMessages({});
            const response = await apiGetDeviceMessages(id);
            if (response.data) {
                setDeviceMessages(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load device messages'] })
        } finally {
            removeLoadingSource('device-messages');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const getDeviceConnection = useCallback(async (id: number) => {
        addLoadingSource('device-connection');
        try {
            setAlertMessages({});
            const response = await apiGetDeviceConnectionSettings(id);
            if (response.data) {
                setConnectionDetails(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load device connection'] })
        } finally {
            removeLoadingSource('device-connection');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const updateConnectionSettins = useCallback(async (id: number, params: TConnectionDetails) => {
        addLoadingSource('device-connection-update');
        try {
            setAlertMessages({});
            const response = await apiUpdateConnection(id, params);
            if (response.data) {
                setConnectionDetails(response.data)
                return response.data
            }
            return null;
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to update connection'] })
            return null
        } finally {
            removeLoadingSource('device-connection-update');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const contextValue = useMemo(() => ({
        devicesList,
        selectedDevice,
        limit,
        offset,
        loading,
        alertMsgs,
        deviceModels,
        deviceManufacturers,
        deviceDetail,
        deviceEvents,
        deviceMessages,
        connectionDetails,
        deleteteDevice,
        EditDevice,
        updateConnectionSettins,
        getDeviceConnection,
        CreateDevice,
        getDeviceDetail,
        getDevciceLatestEvents,
        getDevciceLatestMessages,
        pingDevice,
        deactivateDevice,
        getDeviceList,
        getDeviceManufacturers,
        getDeviceModels,
        setOffset,
        setLimit,
        setSelectedDevice,
    }), [
        devicesList,
        selectedDevice,
        limit,
        offset,
        loading,
        alertMsgs,
        deviceModels,
        deviceManufacturers,
        deviceDetail,
        deviceEvents,
        deviceMessages,
        connectionDetails,
        deleteteDevice,
        EditDevice,
        updateConnectionSettins,
        getDeviceConnection,
        CreateDevice,
        getDeviceDetail,
        getDevciceLatestEvents,
        getDevciceLatestMessages,
        pingDevice,
        deactivateDevice,
        getDeviceList,
        getDeviceManufacturers,
        getDeviceModels,
    ]);


    return (
        <DeviceContext.Provider value={contextValue}>
            {children}
        </DeviceContext.Provider>
    );
};


export const useDevices = () => {
    return useContext(DeviceContext);
};
