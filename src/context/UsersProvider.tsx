import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback,
} from 'react';
import { get, post } from '../service/axios';
import { useDashboard } from './DashboardProvider';
import { apiGetUserRoles, apiUpdateUserName, apiUpdateUserPhone, apiUpdateUserRole, apiUpdateUserStatus } from '../api/users/users';
import { useGlobalLoading } from './GlobalLoadingProvider';

type TProps = {
    children: ReactNode;
};
type TCreateUserProp =
    {
        first_name: string,
        last_name: string,
        email: string,
        phone: string,
        clinic_role: number | string | null,
        password: string,
        confirm_password: string
    }
export type TRole = {
    id: number;
    label: string;
    slug: string
}
type TContext = {
    selectedProfile: TUser;
    usersList: TUsersList,
    limit: number;
    offset: number;
    loading: boolean;
    roles: TRole[];
    alertMsgs: Partial<Record<string, string[]>>;
    setUsersList: Dispatch<SetStateAction<{ count: number; results: TUser[] }>>;
    setSelectedProfile: Dispatch<SetStateAction<TUser>>;
    getRoles: () => Promise<void>;
    setOffset: Dispatch<SetStateAction<number>>;
    setLimit: Dispatch<SetStateAction<number>>;
    CreateUser: (params: TCreateUserProp) => Promise<void>;
    updateUserFullName: ({ id, firstName, lastName }: { id: number, firstName: string, lastName: string }) => Promise<void>;
    updateUserPhoneNumber: ({ id, phone }: { id: number, phone: string }) => Promise<void>;
    updateUserStatus: ({ id, status }: { id: number, status: boolean }) => Promise<void>;
    updateUserRole: ({ id, role }: { id: number, role: string | number }) => Promise<void>;
    fetchUsers: () => Promise<void>;
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
    language: string
};
export type TUsersList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: TUser[];
};

const UsersContext = createContext<TContext>({} as TContext);


export const UsersProvider = ({ children }: TProps) => {
    const [usersList, setUsersList] = useState<{ count: number; results: TUser[] }>({
        count: 0,
        results: [],
    });
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [alertMsgs, setAlertMessages] = useState<Partial<Record<string, string[]>>>({});
    const [selectedProfile, setSelectedProfile] = useState<TUser>({} as TUser)
    const [roles, setRoles] = useState<TRole[]>([])
    
    const { addLoadingSource, removeLoadingSource } = useGlobalLoading();
    const { setCloseUpdateModal } = useDashboard()
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        addLoadingSource('users-list');
        try {
            setAlertMessages({});
            const response = await get<TUsersList>('/users', { params: { limit, offset } });
            setUsersList({
                count: response.data.count,
                results: response.data.results,
            });
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load users'] });
        } finally {
            setLoading(false);
            removeLoadingSource('users-list');
        }
    }, [limit, offset, addLoadingSource, removeLoadingSource]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    const CreateUser = useCallback(async (data: TCreateUserProp) => {
        addLoadingSource('user-create');
        try {
            setAlertMessages({});
            const response = await post('/users/', data);
            if (response.data) {
                window.location.assign('/users')
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to create user'] });
        } finally {
            removeLoadingSource('user-create');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const updateUserFullName = useCallback(async ({ id, firstName, lastName }: { id: number, firstName: string, lastName: string }) => {
        addLoadingSource('user-update-name');
        try {
            setAlertMessages({});
            const response = await apiUpdateUserName({ id, firstName, lastName })
            if (response.data) {
                setSelectedProfile(response.data)
                setCloseUpdateModal(true)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to update user name'] })
        } finally {
            removeLoadingSource('user-update-name');
        }
    }, [addLoadingSource, removeLoadingSource, setCloseUpdateModal]);

    const updateUserPhoneNumber = useCallback(async ({ id, phone }: { id: number, phone: string }) => {
        addLoadingSource('user-update-phone');
        try {
            setAlertMessages({});
            const response = await apiUpdateUserPhone(id, phone)
            if (response.data) {
                setSelectedProfile(response.data)
                setCloseUpdateModal(true)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to update user phone'] })
        } finally {
            removeLoadingSource('user-update-phone');
        }
    }, [addLoadingSource, removeLoadingSource, setCloseUpdateModal]);

    const updateUserStatus = useCallback(async ({ id }: { id: number, status: boolean }) => {
        addLoadingSource('user-update-status');
        try {
            setAlertMessages({});
            const response = await apiUpdateUserStatus(id)
            if (response.data) {
                setSelectedProfile(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to update user status'] })
        } finally {
            removeLoadingSource('user-update-status');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const updateUserRole = useCallback(async ({ id, role }: { id: number, role: string | number }) => {
        addLoadingSource('user-update-role');
        try {
            setAlertMessages({});
            const response = await apiUpdateUserRole(id, role)
            if (response.data) {
                setSelectedProfile(response.data)
                setCloseUpdateModal(true)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to update user role'] })
        } finally {
            removeLoadingSource('user-update-role');
        }
    }, [addLoadingSource, removeLoadingSource, setCloseUpdateModal]);

    const getRoles = useCallback(async () => {
        addLoadingSource('user-roles');
        try {
            setAlertMessages({});
            const response = await apiGetUserRoles()
            if (response.data?.results) {
                setRoles(response.data.results)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load user roles'] })
        } finally {
            removeLoadingSource('user-roles');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const contextValue = useMemo(() => ({
        usersList,
        limit,
        roles,
        offset,
        loading,
        selectedProfile,
        alertMsgs,
        setOffset,
        setUsersList,
        setSelectedProfile,
        getRoles,
        updateUserRole,
        updateUserFullName,
        updateUserStatus,
        updateUserPhoneNumber,
        setLimit,
        CreateUser,
        fetchUsers
    }), [
        usersList,
        limit,
        roles,
        offset,
        loading,
        selectedProfile,
        alertMsgs,
        getRoles,
        updateUserRole,
        updateUserFullName,
        updateUserStatus,
        updateUserPhoneNumber,
        CreateUser,
        fetchUsers
    ]);

    return (
        <UsersContext.Provider value={contextValue}>
            {children}
        </UsersContext.Provider>
    );
};


export const useUsers = () => {
    return useContext(UsersContext);
};
