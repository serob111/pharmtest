import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
} from 'react';

type TProps = {
    children: ReactNode;
};

export type TDevice = {
    id: number;
    name: string;
    manufacturer: string;
    model: string;
    department: string;
    created_stamp: Date;
    status: string;
    last_health_check: Date;
    config: {
        ip_address: string;
        port: number;
        protocol: string;
        applied_at: Date;
    };
    added_by?: string;
};

export type TDevicesList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TDevice[];
};

export type TCreateDeviceProp = {
    model: number | string;
    name: string;
    location: string;
    config: {
        ip_address: string;
        port: number;
        description?: string;
    };
};

export type TConnectionDetails = {
    connection_name: string;
    ip_address: string;
    port: string;
    auth_username: string;
    auth_password: string;
    connection_timeout: string;
    read_timeout: string;
    retries: string;
    backoff_strategy: string;
    keep_alive_interval: string;
    failure_threshold: string;
    description: string;
};

type TContext = {
    // This context is now minimal and only provides types
    // All data fetching is handled by hooks
};

const DeviceContext = createContext<TContext>({} as TContext);

export const DeviceProvider = ({ children }: TProps) => {
    const contextValue = useMemo(() => ({}), []);

    return (
        <DeviceContext.Provider value={contextValue}>
            {children}
        </DeviceContext.Provider>
    );
};

export const useDevices = () => {
    return useContext(DeviceContext);
};