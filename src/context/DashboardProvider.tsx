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
import { TUser } from './UsersProvider';
import { apiGetProfile } from '../api/dashboard/dashboard';
import { useSessionStart } from './AuthProvider';
import { apiAddTwoFactor, apiChangeLanguage, apiDeleteQrCode, apiGetQrCode, apiUpdateName, apiUpdatePassword, apiUpdatePhone } from '../api/profile/profile';

type TProps = {
    children: ReactNode;
};



type TContext = {
    profile: TUser;
    alertMsgs: Partial<Record<string, string[]>>;
    qrCode: string;
    closeUpdateModal: boolean;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    setCloseUpdateModal: Dispatch<SetStateAction<boolean>>;
    removeQr: () => void;
    getQR: () => void;
    add2FaSecure: (totp_token: string) => void;
    changeLanguage: (lang: string) => void;
    updateFullName: ({ firstName, lastName }: { firstName: string, lastName: string }) => void;
    updatePassword: ({ password, confirmPassword }: { password: string, confirmPassword: string }) => void;
    updatePhoneNumber: (phone: string) => void;
};



const DashboardContext = createContext<TContext>({} as TContext);

export const DashboardProvider = ({ children }: TProps) => {
    const [profile, setProfile] = useState({} as TUser)
    const [loading, setLoading] = useState(true)
    const [closeUpdateModal, setCloseUpdateModal] = useState(false)
    const [alertMsgs, setAlertMessages] = useState({});
    const [qrCode, setQrCode] = useState('')

    const sessionStart = useSessionStart()

    const updateFullName = async ({ firstName, lastName }: { firstName: string, lastName: string }) => {
        try {
            const response = await apiUpdateName({ firstName, lastName })
            if (response.data) {
                setProfile(response.data)
                setCloseUpdateModal(true)
                setLoading(false)
            }

        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    }

    const updatePhoneNumber = async (phone: string) => {
        try {
            const response = await apiUpdatePhone(phone)
            setProfile(response.data)
            setCloseUpdateModal(true)
            setLoading(false)
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    }

    const updatePassword = async ({ password, confirmPassword }: { password: string, confirmPassword: string }) => {
        try {
            const response = await apiUpdatePassword({ password, confirmPassword })
            sessionStart(response.data)
            setCloseUpdateModal(true)
            setLoading(false)
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    }
    const receiveProfile = async () => {
        try {
            const response = await apiGetProfile()
            if (response.data) {
                setProfile(response.data)
                setLoading(false)
                return response.data
            }
        } catch (error: any) {
            setLoading(false)
            setAlertMessages(error.response.data)
        }
    };
    const getQR = async () => {
        try {
            const response = await apiGetQrCode()
            const base64 = btoa(unescape(encodeURIComponent(response.data)));
            const dataUrl = `data:image/svg+xml;base64,${base64}`;
            if (response.data) {
                setQrCode(dataUrl)
                setLoading(false)
            }
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    };
    const add2FaSecure = async (totp_token: string) => {
        try {
            const response = await apiAddTwoFactor(totp_token)
            setCloseUpdateModal(true)
            setProfile(response.data)
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    }
    const removeQr = async () => {
        try {
            const response = await apiDeleteQrCode()
            setProfile(response.data)
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    };
    const changeLanguage = async (lang: string) => {
        try {
            const response = await apiChangeLanguage(lang)
            setProfile(response.data)
            setLoading(false)
        } catch (error: any) {
            setAlertMessages(error.response.data)
        }
    }
    useEffect(() => {
        const storedLang = localStorage.getItem('language');
        if (storedLang) {
            changeLanguage(storedLang);
        } else {
            receiveProfile().then(profile => {
                if (profile?.language) {
                    changeLanguage(profile.language);
                    localStorage.setItem('language', profile.language);
                }
            });
        }
    }, []);

    const contextValue = useMemo(() => ({
        profile,
        alertMsgs,
        qrCode,
        loading,
        closeUpdateModal,
        setLoading,
        setCloseUpdateModal,
        add2FaSecure,
        updateFullName,
        updatePhoneNumber,
        updatePassword,
        changeLanguage,
        getQR,
        removeQr,

    }), [profile, alertMsgs, qrCode, closeUpdateModal]);

    return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
    return useContext(DashboardContext);
};
