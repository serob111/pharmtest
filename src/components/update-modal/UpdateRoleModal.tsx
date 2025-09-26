import React, { useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import Button from '../shared/ui/Button/baseBtn';
import { useTranslation } from 'react-i18next';
import SelectInput from '../shared/ui/input/SelectInput';
import { useUsers } from '../../context/UsersProvider';


export interface UpdatePhoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentRole: string | number;
    onSave: (role: string | number) => void;
}

const UpdateRoleModal: React.FC<UpdatePhoneModalProps> = ({
    isOpen,
    onClose,
    currentRole,
    onSave
}) => {
    const { t } = useTranslation();
    const i18nCreateUser = (key: string): string =>
        t(`create-user.${key}`);
    const i18nUpdateUser = (key: string): string =>
        t(`update-profile.${key}`);
    const { roles, getRoles } = useUsers()
    const roleID = roles.find(elm => elm.label === currentRole)
    const [role, setRole] = useState(roleID?.id || '');
    useEffect(() => {
        if (isOpen) {
            getRoles()
            setRole(roleID?.id as number)
        } else {
            setRole('')
        }
    }, [isOpen, currentRole, roleID?.id]);

    const handleSave = async () => {
        onSave(role)
    };

    const handleCancel = () => {
        setRole('');
        onClose();
    };

    const hasChanges = role !== currentRole
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={i18nUpdateUser('update-role')}
            size="md"
        >
            <div className="px-6 py-4 space-y-6">
                <p className="text-sm text-secondary-extralight font-montserrat">
                    {i18nUpdateUser('update-role-description')}
                </p>

                <div className="space-y-4">
                    <SelectInput
                        important
                        size="md"
                        label={i18nCreateUser('role')}
                        required
                        placeholder={i18nCreateUser('select-role')}
                        onChange={(value) => setRole(value as string)}
                        value={role as string || ''}
                        options={roles}
                    />
                </div>


            </div>
            <div className="flex bg-gray-100 justify-end gap-3 p-4">
                <Button
                    size='sm'
                    variant="outline"
                    onClick={handleCancel}
                // disabled={isLoading}
                >
                    {i18nUpdateUser('cancel')}
                </Button>
                <Button
                    size='sm'
                    onClick={handleSave}
                    // loading={isLoading}
                    disabled={!hasChanges}
                >
                    {i18nUpdateUser('save')}
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateRoleModal;