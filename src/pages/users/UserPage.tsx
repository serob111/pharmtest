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
import { TUser } from "../../types/userTypes";

interface UserPageProps {
  selectedUser: TUser;
  setSelectedUser: (user: TUser) => void;
}

export default function UserPage({ selectedUser, setSelectedUser }: UserPageProps) {
  const { t } = useTranslation()
  const i18nUsersTable = (key: string): string =>
    t(`users.table.header.${key}`);
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
      value: selectedUser.email,
      editable: false
    },
    {
      id: "fullName",
      label: 'Full Name',
      icon: "person",
      value: `${selectedUser.first_name} ${selectedUser.last_name}`,
      editable: true,
      onChange: () => setShowUpdateNameModal(true),
    },
    {
      id: "phone",
      label: i18nUsersTable("phone"),
      icon: "phone_enabled",
      value: selectedUser.phone,
      editable: true,
      onChange: () => setShowUpdatePhoneModal(true),
    },
    {
      id: "role",
      label: i18nUsersTable("role"),
      icon: "gpp_good",
      value: selectedUser.clinic_role,
      editable: true,
      onChange: () => setShowUpdateRoleModal(true),
    },
    {
      id: "status",
      label: i18nUsersTable("status"),
      icon: "sync",
      value: selectedUser.is_active ? 'Active' : 'Deactivated',
      editable: true,
      onChange: () => handleStatus(),
    }
  ];
  
  const handleSaveUserName = async (firstName: string, lastName: string) => {
    const updated = await updateUserFullName({ id: selectedUser.id, firstName, lastName });
    if (updated) {
      setSelectedUser(updated);
    }
  };
  
  const handleSaveUserPhone = async (phone: string) => {
    const updated = await updateUserPhoneNumber({ id: selectedUser.id, phone });
    if (updated) {
      setSelectedUser(updated);
    }
  };
  
  const handleSaveRole = async (role: string | number) => {
    const updated = await updateUserRole({ id: selectedUser.id, role });
    if (updated) {
      setSelectedUser(updated);
    }
  };
  
  const handleStatus = async () => {
    const updated = await updateUserStatus({ id: selectedUser.id });
    if (updated) {
      setSelectedUser(updated);
    }
  };

  return (
    <div>
      <Header
        title={`${selectedUser.first_name} ${selectedUser.last_name}`}
        crumbs={[{ path: '/users/', name: `${t('users.users')}` }, { name: `${selectedUser.first_name} ${selectedUser.last_name}` }]}
      />
   
      <Alert type={AlertType.Error} alertMsgs={alertMsgs} />
      
      <UpdateNameModal
        isOpen={showUpdateNameModal}
        onClose={() => setShowUpdateNameModal(false)}
        currentFirstName={selectedUser.first_name || ''}
        currentLastName={selectedUser.last_name || ''}
        onSave={handleSaveUserName}
      />
      <UpdatePhoneModal
        isOpen={showUpdatePhoneModal}
        onClose={() => setShowUpdatePhoneModal(false)}
        currentPhone={selectedUser.phone || ''}
        onSave={handleSaveUserPhone}
      />
      <UpdateRoleModal
        isOpen={showUpdateRoleModal}
        onClose={() => setShowUpdateRoleModal(false)}
        currentRole={selectedUser.clinic_role}
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