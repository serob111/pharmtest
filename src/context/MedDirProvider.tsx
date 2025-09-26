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
import { apiEditDrug, apiGetActiveIngredients, apiGetDosageUnits, apiGetDrugDetail, apiGetDrugs } from '../api/drugs/drugs';
import { useGlobalLoading } from './GlobalLoadingProvider';

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
    getActiveIngridients: () => Promise<any>;
    getDosageUnits: () => Promise<any>;
    editDrug: (id: string, params: TKiroDetail) => Promise<TMed | null>;
    getDrugList: (useInKiro?: boolean, search?: string) => Promise<void>;
    getDrugDetail: (id: string) => Promise<void>;
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
    const [alertMsgs, setAlertMessages] = useState<Partial<Record<string, string[]>>>({});
    const [drugDetail, setDrugDetail] = useState<TMed | null>(null);
    const [loadingMed, setLoadingMed] = useState(false)
    
    const { addLoadingSource, removeLoadingSource } = useGlobalLoading();
    const { t } = useTranslation()

    const getDrugList = useCallback(async (useInKiro?: boolean, search?: string) => {
        setLoadingMed(true);
        addLoadingSource('med-list');
        try {
            setAlertMessages({});
            const response = await apiGetDrugs({ limit, offset, useInKiro, search });
            if (response.data) {
                setMedsList(response.data);
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: [t('error')] });
        } finally {
            setLoadingMed(false);
            removeLoadingSource('med-list');
        }
    }, [limit, offset, addLoadingSource, removeLoadingSource, t]);

    const getDrugDetail = useCallback(async (id: string) => {
        addLoadingSource('med-detail');
        try {
            setAlertMessages({});
            const resposnse = await apiGetDrugDetail(id);
            if (resposnse.data) {
                setDrugDetail(resposnse.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load drug detail'] })
        } finally {
            removeLoadingSource('med-detail');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const getActiveIngridients = useCallback(async () => {
        addLoadingSource('med-ingredients');
        try {
            setAlertMessages({});
            const resposnse = await apiGetActiveIngredients();
            if (resposnse.data) {
                return resposnse.data
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load active ingredients'] })
        } finally {
            removeLoadingSource('med-ingredients');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const getDosageUnits = useCallback(async () => {
        addLoadingSource('med-dosage-units');
        try {
            setAlertMessages({});
            const resposnse = await apiGetDosageUnits();
            if (resposnse.data) {
                return resposnse.data
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load dosage units'] })
        } finally {
            removeLoadingSource('med-dosage-units');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const editDrug = useCallback(async (id: string, params: TKiroDetail): Promise<TMed | null> => {
        addLoadingSource('med-edit');
        try {
            setAlertMessages({});
            const resposnse = await apiEditDrug(id, params);
            if (resposnse.data) {
                return resposnse.data;
            }
            return null;
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ["Ошибка при сохранении"] });
            return null;
        } finally {
            removeLoadingSource('med-edit');
        }
    }, [addLoadingSource, removeLoadingSource]);


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
    }), [
        medsList,
        selectedMed,
        isPanelOpen,
        limit,
        offset,
        drugDetail,
        alertMsgs,
        loadingMed,
        editDrug,
        getDosageUnits,
        getActiveIngridients,
        getDrugDetail,
        getDrugList,
    ]);

    return (
        <MedsContext.Provider value={contextValue}>
            {children}
        </MedsContext.Provider>
    );
};


export const useMeds = () => {
    return useContext(MedsContext);
};
