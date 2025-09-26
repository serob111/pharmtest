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
import { apiGetPrescriptionDetail, apiGetPrescriptions } from '../api/prescriptions/prescriptions';
import { useGlobalLoading } from './GlobalLoadingProvider';
interface PrescriptionListOptions {
    statuses?: string[];
}
type TProps = {
    children: ReactNode;
};

type TContext = {
    selectedPrescription: TPrescription | null;
    limit: number;
    offset: number;
    prescriptionsList: TPrescriptionsList;
    prescriptionDetail: TPrescription | null,
    loading: boolean;
    alertMsgs: Partial<Record<string, string[]>>;
    getPrescriptionDetail: (id: string) => Promise<void>;
    getPrescriptionList: (options?: {
        search?: string;
    }) => Promise<void>;
    setOffset: Dispatch<SetStateAction<number>>;
    setLimit: Dispatch<SetStateAction<number>>;
    setSelectedPrescription: Dispatch<SetStateAction<TPrescription | null>>;
};

export type TPrescription =
    {
        archived_stamp: Date
        cancelled_stamp: Date
        created_stamp: Date
        his_created_date: string
        his_hospital_pharmacy_stock_id: number
        his_status: string
        id: string
        status: string
        modified_stamp: Date
        prescription_created_stamp: Date
        prescription_id: number,
        details: TPrescriptionDetail[]
    };

export type TPrescriptionsList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TPrescription[];
    last_updated_stamp?: Date
};
export type TCreatePrescriptionProp = {
    model: number | string,
    name: string,
    location: string,
    config: {
        ip_address: string,
        port: number,
        description?: string,
        kiro_prescription_type?: number,
        kiro_prescription_id?: number
    }

}
export type TPrescriptionDetalItem = {
    id: string;
    item_id: string;
    medicine_id: number;
    appointment_date: string;
    medicine_name: string;
    dosage: string;
    dosage_unit: string;
    amount_in_package: string;
    package_unit: string;
};
export type TPrescriptionDetail = {
    id: string;
    his_prescription_details_id: number;
    patient_first_name: string;
    patient_last_name: string;
    patient_mrn: number;
    patient_date_of_birth: string;
    prescription_name: string;
    route: string;
    administration_speed: string;
    items: TPrescriptionDetalItem[];
    status: string;
    appoint_date: Date;
    final_container:string
};


const PrescriptionContext = createContext<TContext>({} as TContext);


export const PrescriptionProvider = ({ children }: TProps) => {
    const [prescriptionsList, setPrescriptionsList] = useState<TPrescriptionsList>({
        count: 0,
        results: [],
    });
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [selectedPrescription, setSelectedPrescription] = useState<TPrescription | null>(null);
    const [loading, setLoading] = useState(false);
    const [alertMsgs, setAlertMessages] = useState<Partial<Record<string, string[]>>>({});
    const [prescriptionDetail, setPrescriptionDetail] = useState<TPrescription | null>(null);
    
    const { addLoadingSource, removeLoadingSource } = useGlobalLoading();
    const { t } = useTranslation()

    const getPrescriptionList = useCallback(async ({
        search,
    }: PrescriptionListOptions = {}) => {
        setLoading(true);
        addLoadingSource('prescription-list');
        try {
            setAlertMessages({});
            const response = await apiGetPrescriptions({
                limit,
                offset,
                search
            });

            if (response.data) {
                setPrescriptionsList(response.data);
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: [t('error')] });
        } finally {
            setLoading(false);
            removeLoadingSource('prescription-list');
        }
    }, [limit, offset, addLoadingSource, removeLoadingSource, t]);



    const getPrescriptionDetail = useCallback(async (id: string) => {
        addLoadingSource('prescription-detail');
        try {
            setAlertMessages({});
            const resposnse = await apiGetPrescriptionDetail(id);
            if (resposnse.data) {
                setPrescriptionDetail(resposnse.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load prescription detail'] })
        } finally {
            removeLoadingSource('prescription-detail');
        }
    }, [addLoadingSource, removeLoadingSource]);



    const contextValue = useMemo(() => ({
        prescriptionsList,
        selectedPrescription,
        limit,
        offset,
        loading,
        alertMsgs,
        prescriptionDetail,
        getPrescriptionDetail,
        getPrescriptionList,
        setOffset,
        setLimit,
        setSelectedPrescription,
    }), [
        prescriptionsList,
        selectedPrescription,
        limit,
        offset,
        loading,
        alertMsgs,
        prescriptionDetail,
        getPrescriptionDetail,
        getPrescriptionList,
    ]);


    return (
        <PrescriptionContext.Provider value={contextValue}>
            {children}
        </PrescriptionContext.Provider>
    );
};


export const usePrescriptions = () => {
    return useContext(PrescriptionContext);
};
