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
import { apiEditDrug, apiGetActiveIngredients, apiGetDosageUnits, apiGetDrugDetail, apiGetDrugs } from '../api/drugs/drugs';

type TProps = {
    children: ReactNode;
};

type TContext = {
    selectedMed: TMed | null;
    isPanelOpen: boolean;
    limit: number;
    offset: number;
    medsList: TMedsList;
    drugDetail: TMed | null;
    loadingMed: boolean;
    alertMsgs: Partial<Record<string, string[]>>;
    setDrugDetail: Dispatch<SetStateAction<TMed | null>>
    setAlertMessages: Dispatch<SetStateAction<Partial<Record<string, string[]>>>>;
    getActiveIngridients: () => any;
    getDosageUnits: () => any;
    editDrug: (id: string, params: TKiroDetail) => Promise<TMed | null>;
    getDrugList: (useInKiro?: boolean, search?: string) => void;
    getDrugDetail: (id: string) => void;
    setOffset: Dispatch<SetStateAction<number>>;
    setLimit: Dispatch<SetStateAction<number>>;
    setIsPanelOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedMed: Dispatch<SetStateAction<TMed | null>>;
};

export type TKiroDetail = {
    active_ingredient: string;
    concentration: string;
    concentration_unit: string,
    density: string,
    vial_dose: string,
    vial_unit: string
    id?: string;
    name?: string
    volume?: string
}
export type TMed = {
    id: string;
    damumed_id?: number,
    drug_id?: number,
    category?: {
        his_id: number,
        name: number
    },
    kiro_details: TKiroDetail,
    route: string,
    his_id: number,
    active_ingredient?: string;
    brand_name?: string,
    brand_name_ru?: string,
    brand_name_kz?: string,
    dose_and_unit?: string,
    concentration?: string | number | null,
    source?: string,
    dosage_value: number,
    damumed_concentration?: string | null,
    dosage_unit: string,
    manufacture: string,
    country: string,
    his_system?: string,
    has_options?: [],
    use_in_kiro?: boolean
};

export type TMedsList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: any;
    last_updated_stamp?: Date
};

const MedsContext = createContext<TContext>({} as TContext);


export const MedsProvider = ({ children }: TProps) => {
    const [medsList, setMedsList] = useState<TMedsList>({
        count: 0,
        results: [],
    });
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [selectedMed, setSelectedMed] = useState<TMed | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [alertMsgs, setAlertMessages] = useState({});
    const [drugDetail, setDrugDetail] = useState<TMed | null>(null);
    const [loadingMed, setLoadingMed] = useState(false)
    const { t } = useTranslation()

    const getDrugList = async (useInKiro?: boolean, search?: string) => {
        setLoadingMed(true);
        try {
            const response = await apiGetDrugs({ limit, offset, useInKiro, search });
            if (response.data) {
                setMedsList(response.data);
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || t('error'));
        } finally {
            setLoadingMed(false);
        }
    };

    const getDrugDetail = async (id: string) => {
        try {
            const resposnse = await apiGetDrugDetail(id);
            if (resposnse.data) {
                setDrugDetail(resposnse.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }

    const getActiveIngridients = async () => {
        try {
            const resposnse = await apiGetActiveIngredients();
            if (resposnse.data) {
                return resposnse.data
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }
    const getDosageUnits = async () => {
        try {
            const resposnse = await apiGetDosageUnits();
            if (resposnse.data) {
                return resposnse.data
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
            console.log(error)
        }
    }

    const editDrug = async (id: string, params: TKiroDetail): Promise<TMed | null> => {
        try {
            const resposnse = await apiEditDrug(id, params);
            if (resposnse.data) {
                setAlertMessages({})
                return resposnse.data;
            }
            return null;
        } catch (error: any) {
            console.log(error)
            setAlertMessages(error.response?.data || { error: ["Ошибка при сохранении"] });
            return null;
        }
    };



    const contextValue = useMemo(() => ({
        medsList,
        selectedMed,
        isPanelOpen,
        limit,
        offset,
        drugDetail,
        alertMsgs,
        loadingMed,
        setDrugDetail,
        setAlertMessages,
        editDrug,
        getDosageUnits,
        getActiveIngridients,
        getDrugDetail,
        getDrugList,
        setOffset,
        setLimit,
        setSelectedMed,
        setIsPanelOpen
    }), [selectedMed, alertMsgs, offset, limit, loadingMed, isPanelOpen, medsList, medsList.count, drugDetail]);

    return (
        <MedsContext.Provider value={contextValue}>
            {children}
        </MedsContext.Provider>
    );
};


export const useMeds = () => {
    return useContext(MedsContext);
};
