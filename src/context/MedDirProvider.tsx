import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
} from 'react';

type TProps = {
    children: ReactNode;
};

export type TMed = {
    id: string;
    brand_name: string;
    brand_name_ru: string;
    brand_name_kz: string;
    active_ingredient: string;
    dosage_value: string;
    dosage_unit: string;
    damumed_concentration: string;
    route: string;
    manufacture: string;
    country: string;
    his_id: string;
    his_system: string;
    drug_id: string;
    use_in_kiro: boolean;
    dose_and_unit: string;
    concentration: string;
    kiro_details: TKiroDetail;
};

export type TMedsList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TMed[];
    last_updated_stamp?: Date;
};

export type TKiroDetail = {
    active_ingredient: string;
    name: string;
    volume: string;
    concentration: string;
    concentration_unit: string;
    vial_dose: string;
    vial_unit: string;
    density: string;
};

type TContext = {
    // This context is now minimal and only provides types
    // All data fetching is handled by hooks
};

const MedContext = createContext<TContext>({} as TContext);

export const MedsProvider = ({ children }: TProps) => {
    const contextValue = useMemo(() => ({}), []);

    return (
        <MedContext.Provider value={contextValue}>
            {children}
        </MedContext.Provider>
    );
};

export const useMeds = () => {
    return useContext(MedContext);
};