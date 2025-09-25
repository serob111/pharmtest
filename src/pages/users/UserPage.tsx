import { useTranslation } from "react-i18next";
import Header from "../../components/header/Header";
import ProfileItem from "../../components/table-user/ProfileItem";
import { useState } from "react";
import UpdateNameModal from "../../components/update-modal/UpdateNameModal";
import UpdatePhoneModal from "../../components/update-modal/UpdatePhoneModal";
import { useUsers } from "../../hooks/useUsers";
import UpdateRoleModal from "../../components/update-modal/UpdateRoleModal";
import Alert, { AlertType } from "../../components/alert/Alert";
import LoadingSpinner from "../../components/shared/ui/LoadingSpinner";

export default function UserPage() {
  const { t } = useTranslation()
  const i18nUsersTable = (key: string): string =>
    t(`users.table.header.${key}`);
  const { selectedProfile } = useUsers()
  const [showUpdateNameModal, setShowUpdateNameModal] = useState(false);
  const [showUpdatePhoneModal, setShowUpdatePhoneModal] = useState(false);
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
  const {
    alertMsgs,
    usersLoading,
    updateUserFullName,
    updateUserPhoneNumber,
    updateUserStatus,
    updateUserRole
  } = useUsers()
  const profileItems = [
    {
      id: "email",
      label: "E-Mail Address",
      icon: "email",
      value: selectedProfile.email,
      editable: false
    },
    {
      id: "fullName",
      label: 'Full Name',
      icon: "person",
      value: `${selectedProfile.first_name} ${selectedProfile.last_name}`,
      editable: true,
      onChange: () => setShowUpdateNameModal(true),

    },


    {
      id: "phone",
      label: i18nUsersTable("phone"),
      icon: "phone_enabled",
      value: selectedProfile.phone,
      editable: true,
      onChange: () => setShowUpdatePhoneModal(true),

    },
    {
      id: "role",
      label: i18nUsersTable("role"),
      icon: "gpp_good",
      value: selectedProfile.clinic_role,
      editable: true,
      onChange: () => setShowUpdateRoleModal(true),
    },
    {
      id: "status",
      label: i18nUsersTable("status"),
      icon: "sync",
      value: selectedProfile.is_active ? 'Active' : 'Deactivated',
      editable: true,
      onChange: () => handleStatus(),
    }
  ];
  const handleSaveUserName = async (firstName: string, lastName: string) => {
    updateUserFullName({ id: selectedProfile.id, firstName, lastName })
  };
  const handleSaveUserPhone = async (phone: string) => {
    updateUserPhoneNumber({ id: selectedProfile.id, phone })
  };
  const handleSaveRole = async (role: string | number) => {
    updateUserRole({ id: selectedProfile.id, role })
  };
  const handleStatus = async () => {
    updateUserStatus({ id: selectedProfile.id, status: !selectedProfile.is_active })
  };
  return (
    <div>
      <Header
        title={`${selectedProfile.first_name} ${selectedProfile.last_name}`}
        crumbs={[{ path: '/users/', name: `${t('users.users')}` }, { name: `${selectedProfile.first_name} ${selectedProfile.last_name}` }]}
      />
   
        <Alert type={AlertType.Error} alertMsgs={alertMsgs} />
      
      <UpdateNameModal
        isOpen={showUpdateNameModal}
        onClose={() => setShowUpdateNameModal(false)}
        currentFirstName={selectedProfile.first_name || ''}
        currentLastName={selectedProfile.last_name || ''}
        onSave={handleSaveUserName}
      />
      <UpdatePhoneModal
        isOpen={showUpdatePhoneModal}
        onClose={() => setShowUpdatePhoneModal(false)}
        currentPhone={selectedProfile.phone || ''}
        onSave={handleSaveUserPhone}
      />
      <UpdateRoleModal
        isOpen={showUpdateRoleModal}
        onClose={() => setShowUpdateRoleModal(false)}
        currentRole={selectedProfile.clinic_role}
        onSave={handleSaveRole}
      />
      
      {usersLoading && (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner text="Updating user..." />
        </div>
      )}
      
      <div className="p-5 flex flex-col w-full">
        {
          profileItems.map((profileItem, index) =>
            <ProfileItem
              onChange={profileItem.onChange}
              editable={profileItem.editable}
              key={index} id={profileItem.id}
              icon={profileItem.icon}
              subcontent={`${profileItem.value}`}
              content={profileItem.label}
            />
          )
        }
      </div>
    </div>
  )
}
