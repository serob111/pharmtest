import {
    createContext,
    ReactNode,
    useContext,
    useMemo,
} from 'react';

type TProps = {
    children: ReactNode;
};

export type TRole = {
    id: number;
    label: string;
    slug: string;
};

export type TUser = {
    profile_photo_thumbnail?: string;
    id: number;
    email: string;
    is_active: boolean;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    clinic_role: number | string;
    two_factor_enabled: boolean;
    language: string;
};

export type TUsersList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TUser[];
};

type TContext = {
    // This context is now minimal and only provides types
    // All data fetching is handled by hooks
};

const UsersContext = createContext<TContext>({} as TContext);

export const UsersProvider = ({ children }: TProps) => {
    const contextValue = useMemo(() => ({}), []);

    return (
        <UsersContext.Provider value={contextValue}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => {
    return useContext(UsersContext);
};