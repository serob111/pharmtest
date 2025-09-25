import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { get, post } from '../service/axios';
import { useDashboard } from './DashboardProvider';
import { apiGetUserRoles, apiUpdateUserName, apiUpdateUserPhone, apiUpdateUserRole, apiUpdateUserStatus } from '../api/users/users';

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
    roles: TRole[];
    alertMsgs: Partial<Record<string, string[]>>;
    setUsersList: Dispatch<SetStateAction<{ count: number; results: TUser[] }>>;
    setSelectedProfile: Dispatch<SetStateAction<TUser>>;
    getRoles: () => void;
    setOffset: Dispatch<SetStateAction<number>>;
    setLimit: Dispatch<SetStateAction<number>>;
    CreateUser: (params: TCreateUserProp) => void;
    updateUserFullName: ({ id, firstName, lastName }: { id: number, firstName: string, lastName: string }) => void;
    updateUserPhoneNumber: ({ id, phone }: { id: number, phone: string }) => void;
    updateUserStatus: ({ id, status }: { id: number, status: boolean }) => void;
    updateUserRole: ({ id, role }: { id: number, role: string | number }) => void;
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
    const [alertMsgs, setAlertMessages] = useState({});
    const [selectedProfile, setSelectedProfile] = useState<TUser>({} as TUser)
    const [roles, setRoles] = useState([])
    const { loading, setLoading } = useDashboard()
    const { setCloseUpdateModal } = useDashboard()
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await get<TUsersList>('/users', { params: { limit, offset } });
                setUsersList({
                    count: response.data.count,
                    results: response.data.results,
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, [limit, offset]);

    async function CreateUser(data: TCreateUserProp) {
        try {
            const response = await post('/users/', data);
            if (response.data) {
                window.location.assign('/users')
            }

        } catch (error: any) {
            console.log(error)
            if (error.response?.data) {
                setAlertMessages(error.response.data);
            }
        }
    }
    const updateUserFullName = async ({ id, firstName, lastName }: { id: number, firstName: string, lastName: string }) => {
        setLoading(true)
        try {
            const response = await apiUpdateUserName({ id, firstName, lastName })
            if (response.data) {
                setSelectedProfile(response.data)
                setCloseUpdateModal(true)
                setLoading(false)
            }

        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    }
    const updateUserPhoneNumber = async ({ id, phone }: { id: number, phone: string }) => {
        setLoading(true)
        try {
            const response = await apiUpdateUserPhone(id, phone)

            setSelectedProfile(response.data)
            setCloseUpdateModal(true)
            setLoading(false)
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    }
    const updateUserStatus = async ({ id }: { id: number }) => {
        setLoading(true)
        try {
            const response = await apiUpdateUserStatus(id)
            setSelectedProfile(response.data)
            setLoading(false)
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    }
    const updateUserRole = async ({ id, role }: { id: number, role: string | number }) => {
        setLoading(true)
        try {
            const response = await apiUpdateUserRole(id, role)
            setSelectedProfile(response.data)
            setLoading(false)
            setCloseUpdateModal(true)
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    }
    const getRoles = async () => {
        try {
            const response = await apiGetUserRoles()
            setRoles(response.data.results)
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    };

    const contextValue = useMemo(() => ({
        usersList,
        limit,
        roles,
        offset,
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
        CreateUser
    }), [usersList, roles, selectedProfile, limit, loading, alertMsgs, offset,]);

    return (
        <UsersContext.Provider value={contextValue}>
            {children}
        </UsersContext.Provider>
    );
};


export const useUsers = () => {
    return useContext(UsersContext);
};
