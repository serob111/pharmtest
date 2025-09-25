import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
} from 'react';

type TProps = {
    children: ReactNode;
};

export type TOrder = {
    id: string;
    external_order_id: string;
    order_name: string;
    medical_system: string;
    medical_system_status: string;
    event_type: string;
    due_date: Date;
    target_device: {
        model: string;
        protocol: string;
    };
    prescription_detail: {
        his_prescription_details_id: number;
        patient_first_name: string;
        patient_last_name: string;
        patient_mrn: number;
        patient_date_of_birth: string;
        prescription_name: string;
        route: string;
        administration_speed: string;
        appoint_date: Date;
        final_container: string;
        items: any[];
    };
};

export type TOrdersList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TOrder[];
};

export type TOrdersDashboard = {
    all_orders_count: number;
    orders_in_progress: number;
    orders_in_done: number;
    orders_rejected: number;
};

export type TCreateOrderProp = {
    order_name: string;
    medical_system: string;
    prescription_detail: any;
};

type TContext = {
    // This context is now minimal and only provides types
    // All data fetching is handled by hooks
};

const OrderContext = createContext<TContext>({} as TContext);

export const OrderProvider = ({ children }: TProps) => {
    const contextValue = useMemo(() => ({}), []);

    return (
        <OrderContext.Provider value={contextValue}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    return useContext(OrderContext);
};