import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { apiCreateDevice, apiDeactivateDevice, apiDeleteDevice, apiEditDevice, apiGetDeviceConnectionSettings, apiGetDeviceDetail, apiGetDeviceEvents, apiGetDeviceManufacturers, apiGetDeviceMessages, apiGetDeviceModels, apiGetDevices, apiPingDevice, apiUpdateConnection } from '../api/devices/devices';
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
    const [alertMsgs, setAlertMessages] = useState({});
    const [deviceModels, setDeviceModels] = useState([])
    const [deviceManufacturers, setDeviceManufacturers] = useState([])
    const [deviceDetail, setDeviceDetail] = useState<TDevice | null>(null);
    const [deviceEvents, setDeviceEvents] = useState<TDeviceEvents[]>([] as TDeviceEvents[])
    const [deviceMessages, setDeviceMessages] = useState<TDeviceMessages[]>([] as TDeviceMessages[])
    const [connectionDetails, setConnectionDetails] = useState({} as TConnectionDetails)
    const { t } = useTranslation()
    async function CreateDevice(data: TCreateDeviceProp) {
        try {
            const response = await apiCreateDevice(data);
            if (response.data) {
                window.location.assign('/devices')
            }
        } catch (error: any) {
            console.log(error)
            setAlertMessages(error.response.data);
        }
    }
    async function EditDevice(id: number, data: TCreateDeviceProp) {
        try {
            const response = await apiEditDevice(id, data);
            if (response.data) {
                window.location.assign('/devices')
            }
        } catch (error: any) {
            console.log(error)
            setAlertMessages(error.response.data);
        }
    }

    const getDeviceList = async ({
        search,
        manufacturers,
        models,
        statuses,
    }: DeviceListOptions = {}) => {
        try {
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
            setAlertMessages(error.response?.data || t('error'));
            console.error(error);
        }
    };

    const getDeviceModels = async () => {
        try {
            const resposnse = await apiGetDeviceModels();
            if (resposnse.data) {
                setDeviceModels(resposnse.data.results)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }

    const getDeviceManufacturers = async () => {
        try {
            const resposnse = await apiGetDeviceManufacturers();
            if (resposnse.data) {
                setDeviceManufacturers(resposnse.data.results)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }

    const getDeviceDetail = async (id: number) => {
        try {
            const resposnse = await apiGetDeviceDetail(id);
            if (resposnse.data) {
                setDeviceDetail(resposnse.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }

    const pingDevice = async (id: number) => {
        try {
            const resposnse = await apiPingDevice(id);
            if (resposnse.data) {
                console.log(resposnse.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }

    const deactivateDevice = async (id: number) => {
        try {
            await apiDeactivateDevice(id);

        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }
    const deleteteDevice = async (id: number) => {
        try {
            await apiDeleteDevice(id);

        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }

    const getDevciceLatestEvents = async (id: number) => {
        try {
            const response = await apiGetDeviceEvents(id);
            if (response.data) {
                setDeviceEvents(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }

    const getDevciceLatestMessages = async (id: number) => {

        try {
            const response = await apiGetDeviceMessages(id);
            if (response.data) {
                setDeviceMessages(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }
    const getDeviceConnection = async (id: number) => {
        try {
            const response = await apiGetDeviceConnectionSettings(id);
            if (response.data) {
                setConnectionDetails(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }
    const updateConnectionSettins = async (id: number, params: TConnectionDetails) => {
        try {
            const response = await apiUpdateConnection(id, params);
            if (response.data) {
                setConnectionDetails(response.data)
                setAlertMessages({})
                return response.data
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
            return null
        }
    }

    const contextValue = useMemo(() => ({
        devicesList,
        selectedDevice,
        limit,
        offset,
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
    }), [selectedDevice, deviceEvents, deviceMessages, deviceDetail, alertMsgs, offset, limit, deviceManufacturers, deviceModels, devicesList]);


    return (
        <DeviceContext.Provider value={contextValue}>
            {children}
        </DeviceContext.Provider>
    );
};


export const useDevices = () => {
    return useContext(DeviceContext);
};
