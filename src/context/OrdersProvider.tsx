import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useMemo,
    useState,
} from 'react';
import { TPrescriptionDetail } from './PrescriptionProvider';
import { apiGetOrderDetail,  apiGetOrders,  apiGetOrdersDashboard, apiSendorder } from '../api/orders/orders';
import { AlertState } from '../components/alert/AlertsWrapper';
import { useTranslation } from 'react-i18next';
import { AlertType, AlertVariant } from '../components/alert/Alert';
import { isErrorWithResponse } from '../lib/utils';
interface OrderListOptions {
    search?: string;
    status?: string
}
type TProps = {
    children: ReactNode;
};

type TContext = {
    selectedOrder: TOrder | null;
    limit: number;
    offset: number;
    ordersList: TOrdersList;
    orderDetail: TOrder | null,
    alertMsgs: AlertState | null;
    setAlertMessages: Dispatch<SetStateAction<AlertState | null>>;
    getOrderDetail: (id: string) => void;
    sendOrder: (id: string, device?: string) => Promise<string | undefined>;
    getOrderDashboard: () => Promise<TOrdersDashboard>;
    getOrderList: (options?: {
        search?: string;
        status?: string
    }) => Promise<void>;
    setOffset: Dispatch<SetStateAction<number>>;
    setLimit: Dispatch<SetStateAction<number>>;
    setSelectedOrder: Dispatch<SetStateAction<TOrder | null>>;
};

export type TOrder =
{
  id: string,
  external_order_id: string,
  order_name: string,
  medical_system: string,
  medical_system_status: string,
  his_prescription_id: string,
  prescription_detail:TPrescriptionDetail,
  target_device: {
    id: number,
    protocol:string,
    name: string,
    model: string,
    manufacturer: string,
    department: string
  };
}

export type TOrdersList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TOrder[];
    last_updated_stamp?: Date
};
export type TCreateOrderProp = {
    model: number | string,
    name: string,
    location: string,
    config: {
        ip_address: string,
        port: number,
        description?: string,
        kiro_order_type?: number,
        kiro_order_id?: number
    }

}
export type TOrderDetalItem = {
    id: string;
    item_id: string;
    medicine_category: string;
    appointment_date: string;
    medicine_name: string;
    dosage: string;
    dosage_unit: string;
    amount_in_package: string;
    package_unit: string;
};
export type TOrderDetail = {
    id: string,
    his_order_details_id: number,
    patient_first_name: string,
    patient_last_name: string,
    patient_mrn: number,
    patient_date_of_birth: string,
    order_name: string,
    route: string,
    administration_speed: string,
    items: TOrderDetalItem[]
    status: string
};
export type TOrdersDashboard = {
    all_orders_count: number;
    orders_in_done: number;
    orders_in_progress: number;
    orders_rejected: number;
}

const OrderContext = createContext<TContext>({} as TContext);


export const OrderProvider = ({ children }: TProps) => {
    const [ordersList, setOrdersList] = useState<TOrdersList>({
        count: 0,
        results: [],
    });
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
    const [alertMsgs, setAlertMessages] = useState<AlertState | null>(null);
    const [orderDetail, setOrderDetail] = useState<TOrder | null>(null);
    const { t } = useTranslation()

    const getOrderList = async ({
        search,
        status,
    }: OrderListOptions = {}) => {
        try {
            const response = await apiGetOrders({
                limit,
                offset,
                search,
                status
            });

            if (response.data) {
                setOrdersList(response.data);
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || "Ошибка загрузки");
            console.error(error);
        }
    };

    const getOrderDashboard = async () => {
        try {
            const response = await apiGetOrdersDashboard();
            if (response.data) {
                return response.data
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || "Ошибка загрузки");
            console.error(error);
        }
    };

    const getOrderDetail = async (id: string) => {
        try {
            const resposnse = await apiGetOrderDetail(id);
            if (resposnse.data) {
                setOrderDetail(resposnse.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }

    const sendOrder = async (id: string, device?: string) => {
        try {
            const response = await apiSendorder(id, device);
            setAlertMessages({
                type: AlertType.Success,
                messages: "Заказ успешно сохранён!",
                variant: AlertVariant.Swimming
            });
            return response.data;
        } catch (error) {
            let serverError: Partial<Record<string, string[]>>;
            if (isErrorWithResponse<Partial<Record<string, string[]>>>(error)) {
                serverError = error.response.data;
            } else {
                serverError = { general: ["Неизвестная ошибка"] };
            }
            setAlertMessages({
                type: AlertType.Error,
                messages: serverError,
                variant: AlertVariant.Swimming
            });

            return null;
        }
    };


    const contextValue = useMemo(() => ({
        ordersList,
        selectedOrder,
        limit,
        offset,
        alertMsgs,
        orderDetail,
        setAlertMessages,
        sendOrder,
        getOrderDetail,
        getOrderList,
        setOffset,
        setLimit,
        getOrderDashboard,
        setSelectedOrder,
    }), [selectedOrder, orderDetail, alertMsgs, offset, limit, ordersList]);


    return (
        <OrderContext.Provider value={contextValue}>
            {children}
        </OrderContext.Provider>
    );
};


export const useOrders = () => {
    return useContext(OrderContext);
};
