import React, { useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import Button from '../shared/ui/Button/baseBtn';
import Input from '../shared/ui/input/Input';
import { useTranslation } from 'react-i18next';


export interface UpdateNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFirstName: string;
    currentLastName: string;
    onSave: (firstName: string, lastName: string) => void;
}

const UpdateNameModal: React.FC<UpdateNameModalProps> = ({
    isOpen,
    onClose,
    currentFirstName = '',
    currentLastName = '',
    onSave
}) => {
    const [firstName, setFirstName] = useState(currentFirstName);
    const [lastName, setLastName] = useState(currentLastName);
    const { t } = useTranslation();
    const i18nCreateUser = (key: string): string =>
        t(`create-user.${key}`);
    const i18nUpdateUser = (key: string): string =>
        t(`update-profile.${key}`);

    useEffect(() => {
        if (isOpen) {
            setFirstName(currentFirstName);
            setLastName(currentLastName);
        }
    }, [isOpen, currentFirstName, currentLastName]);

    const handleSave = async () => {
        onSave(firstName, lastName)
    };

    const handleCancel = () => {
        setFirstName(currentFirstName);
        setLastName(currentLastName);
        onClose();
    };

    const isFormValid = firstName.trim() && lastName.trim();
    const hasChanges = firstName !== currentFirstName || lastName !== currentLastName;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={i18nUpdateUser('update-name')}
            size="md"
        >
            <div className="px-6 py-4 space-y-6">
                <p className="text-sm text-secondary-extralight font-montserrat">
                    {i18nUpdateUser('update-name-description')}
                </p>

                <div className="space-y-4">
                    <Input
                        labelClass='text-primary-dark'
                        className='text-primary-dark'
                        important
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        label={i18nCreateUser('first-name')}
                        placeholder={i18nCreateUser('enter-first-name')}

                    />
                    <Input
                        labelClass='text-primary-dark'
                        className='text-primary-dark'
                        important
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        label={i18nCreateUser('last-name')}
                        placeholder={i18nCreateUser('enter-last-name')}
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
                    disabled={!isFormValid || !hasChanges}
                // loading={isLoading}
                >
                    {i18nUpdateUser('save')}
                </Button>
            </div>
        </Modal>
    );
};

export default UpdateNameModal;