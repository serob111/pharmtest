import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import { useDashboard } from "../../context/DashboardProvider";
import ProfileItem from "../../components/table-user/ProfileItem";
import { useState } from "react";
import UpdateNameModal from "../../components/update-modal/UpdateNameModal";
import UpdatePhoneModal from "../../components/update-modal/UpdatePhoneModal";
import UpdatePasswordModal from "../../components/update-modal/UpdatePasswordModal";
import Update2FaModal from "../../components/update-modal/Update2FaModal";

export default function AccountSettings() {
    const {
        removeQr,
        profile,
        updateFullName,
        updatePhoneNumber,
        updatePassword,
        getQR,
        add2FaSecure,
    } = useDashboard()

    const [showUpdateNameModal, setShowUpdateNameModal] = useState(false);
    const [showUpdatePhoneModal, setShowUpdatePhoneModal] = useState(false);
    const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
    const [showUpdate2FaModal, setShowUpdate2FaModal] = useState(false);
    
    const { t } = useTranslation()
    const i18nProfile = (key: string): string =>
        t(`profile.${key}`);



    const profileItems = [
        {
            id: "email",
            label: i18nProfile('email'),
            icon: "email",
            value: profile.email,
            editable: false
        },
        {
            id: "fullName",
            label: 'Full Name',
            icon: "person",
            value: `${profile.first_name} ${profile.last_name}`,
            onChange: () => setShowUpdateNameModal(true),
            editable: true

        },

        {
            id: "phone",
            label: i18nProfile("phone"),
            icon: "phone_enabled",
            value: profile.phone,
            onChange: () => setShowUpdatePhoneModal(true),
            editable: true


        },
        {
            id: "password",
            label: i18nProfile("change-password"),
            description: i18nProfile('change-password-description'),
            icon: "password",
            onChange: () => setShowUpdatePasswordModal(true),
            editable: true

        },
        {
            id: "2faAuth",
            label: i18nProfile("2fa"),
            description: i18nProfile('2fa-description'),
            icon: "phonelink_lock",
            checked: profile.two_factor_enabled,
            editable: true,
            onSwitch: () => profile.two_factor_enabled ? removeQr() : (setShowUpdate2FaModal(true), getQR())
        }
    ];

    const handleSaveName = async (firstName: string, lastName: string) => {
        updateFullName({ firstName, lastName })
    };
    const handleSavePhone = async (phone: string) => {
        updatePhoneNumber(phone)
    };
    const handleSavePassword = async (password: string, confirmPassword: string) => {
        updatePassword({ password, confirmPassword })
    };
    const handleSave2fa = (totp_token: string) => {
        add2FaSecure(totp_token)
    }

    return (
        <div>
            <Header
                title={t(i18nProfile('account-settings'))}
            />

            <UpdateNameModal
                isOpen={showUpdateNameModal}
                onClose={() => setShowUpdateNameModal(false)}
                currentFirstName={profile.first_name || ''}
                currentLastName={profile.last_name || ''}
                onSave={handleSaveName}
            />
            <UpdatePhoneModal
                isOpen={showUpdatePhoneModal}
                onClose={() => setShowUpdatePhoneModal(false)}
                currentPhone={profile.phone || ''}
                onSave={handleSavePhone}
            />
            <UpdatePasswordModal
                isOpen={showUpdatePasswordModal}
                onClose={() => setShowUpdatePasswordModal(false)}
                onSave={handleSavePassword}
            />
            <Update2FaModal
                isOpen={showUpdate2FaModal}
                onClose={() => setShowUpdate2FaModal(false)}
                is2fa={profile.two_factor_enabled}
                onSave={handleSave2fa}
            />
            <div className="p-5 flex flex-col w-full">

                {
                    profileItems.map((profileItem, index) =>
                        <ProfileItem
                            editable={profileItem.editable}
                            description={profileItem.description}
                            onChange={profileItem.onChange}
                            onSwitch={profileItem.onSwitch}
                            key={index} id={profileItem.id}
                            icon={profileItem.icon}
                            subcontent={`${profileItem.value}`}
                            checked2fa={profileItem.checked}
                            content={profileItem.label}
                        />
                    )
                }
            </div>
        </div>
    )
}
