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
import { TUser } from './UsersProvider';
import { apiGetProfile } from '../api/dashboard/dashboard';
import { useSessionStart } from './AuthProvider';
import { apiAddTwoFactor, apiChangeLanguage, apiDeleteQrCode, apiGetQrCode, apiUpdateName, apiUpdatePassword, apiUpdatePhone } from '../api/profile/profile';
import { useGlobalLoading } from './GlobalLoadingProvider';

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
    removeQr: () => Promise<void>;
    getQR: () => Promise<void>;
    add2FaSecure: (totp_token: string) => Promise<void>;
    changeLanguage: (lang: string) => Promise<void>;
    updateFullName: ({ firstName, lastName }: { firstName: string, lastName: string }) => Promise<void>;
    updatePassword: ({ password, confirmPassword }: { password: string, confirmPassword: string }) => Promise<void>;
    updatePhoneNumber: (phone: string) => Promise<void>;
    receiveProfile: () => Promise<TUser | undefined>;
};



const DashboardContext = createContext<TContext>({} as TContext);

export const DashboardProvider = ({ children }: TProps) => {
    const [profile, setProfile] = useState({} as TUser)
    const [loading, setLoading] = useState(true)
    const [closeUpdateModal, setCloseUpdateModal] = useState(false)
    const [alertMsgs, setAlertMessages] = useState<Partial<Record<string, string[]>>>({});
    const [qrCode, setQrCode] = useState('')

    const { addLoadingSource, removeLoadingSource } = useGlobalLoading();
    const sessionStart = useSessionStart()

    const updateFullName = useCallback(async ({ firstName, lastName }: { firstName: string, lastName: string }) => {
        addLoadingSource('dashboard-update-name');
        try {
            setAlertMessages({});
            const response = await apiUpdateName({ firstName, lastName })
            if (response.data) {
                setProfile(response.data)
                setCloseUpdateModal(true)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to update name'] })
        } finally {
            removeLoadingSource('dashboard-update-name');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const updatePhoneNumber = useCallback(async (phone: string) => {
        addLoadingSource('dashboard-update-phone');
        try {
            setAlertMessages({});
            const response = await apiUpdatePhone(phone)
            if (response.data) {
                setProfile(response.data)
                setCloseUpdateModal(true)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to update phone'] })
        } finally {
            removeLoadingSource('dashboard-update-phone');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const updatePassword = useCallback(async ({ password, confirmPassword }: { password: string, confirmPassword: string }) => {
        addLoadingSource('dashboard-update-password');
        try {
            setAlertMessages({});
            const response = await apiUpdatePassword({ password, confirmPassword })
            if (response.data) {
                sessionStart(response.data)
                setCloseUpdateModal(true)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to update password'] })
        } finally {
            removeLoadingSource('dashboard-update-password');
        }
    }, [addLoadingSource, removeLoadingSource, sessionStart]);

    const receiveProfile = useCallback(async () => {
        addLoadingSource('dashboard-profile');
        try {
            setAlertMessages({});
            const response = await apiGetProfile()
            if (response.data) {
                setProfile(response.data)
                return response.data
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load profile'] })
        } finally {
            setLoading(false);
            removeLoadingSource('dashboard-profile');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const getQR = useCallback(async () => {
        addLoadingSource('dashboard-qr');
        try {
            setAlertMessages({});
            const response = await apiGetQrCode()
            const base64 = btoa(unescape(encodeURIComponent(response.data)));
            const dataUrl = `data:image/svg+xml;base64,${base64}`;
            if (response.data) {
                setQrCode(dataUrl)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to load QR code'] })
        } finally {
            removeLoadingSource('dashboard-qr');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const add2FaSecure = useCallback(async (totp_token: string) => {
        addLoadingSource('dashboard-2fa');
        try {
            setAlertMessages({});
            const response = await apiAddTwoFactor(totp_token)
            if (response.data) {
                setCloseUpdateModal(true)
                setProfile(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to add 2FA'] })
        } finally {
            removeLoadingSource('dashboard-2fa');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const removeQr = useCallback(async () => {
        addLoadingSource('dashboard-remove-qr');
        try {
            setAlertMessages({});
            const response = await apiDeleteQrCode()
            if (response.data) {
                setProfile(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to remove QR code'] })
        } finally {
            removeLoadingSource('dashboard-remove-qr');
        }
    }, [addLoadingSource, removeLoadingSource]);

    const changeLanguage = useCallback(async (lang: string) => {
        addLoadingSource('dashboard-language');
        try {
            setAlertMessages({});
            const response = await apiChangeLanguage(lang)
            if (response.data) {
                setProfile(response.data)
            }
        } catch (error: any) {
            setAlertMessages(error.response?.data || { error: ['Failed to change language'] })
        } finally {
            removeLoadingSource('dashboard-language');
        }
    }, [addLoadingSource, removeLoadingSource]);

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
    }, [changeLanguage, receiveProfile]);

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
        receiveProfile,
    }), [
        profile, 
        alertMsgs, 
        qrCode, 
        loading, 
        closeUpdateModal,
        add2FaSecure,
        updateFullName,
        updatePhoneNumber,
        updatePassword,
        changeLanguage,
        getQR,
        removeQr,
        receiveProfile
    ]);

    return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
    return useContext(DashboardContext);
};
