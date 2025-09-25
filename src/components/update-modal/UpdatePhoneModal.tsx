import React, { useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import Button from '../shared/ui/Button/baseBtn';
import { useTranslation } from 'react-i18next';
import PhoneInput from '../shared/ui/input/PhoneInput';


export interface UpdatePhoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPhone: string;
    onSave: (phone: string,) => void;
}

const UpdatePhoneModal: React.FC<UpdatePhoneModalProps> = ({
    isOpen,
    onClose,
    currentPhone,
    onSave
}) => {
    const [phone, setPhone] = useState(currentPhone);
    const { t } = useTranslation();
    const i18nCreateUser = (key: string): string =>
        t(`create-user.${key}`);
    const i18nUpdateUser = (key: string): string =>
        t(`update-profile.${key}`);

    useEffect(() => {
        if (isOpen) {
            setPhone(currentPhone);
        }
    }, [isOpen, currentPhone]);

    const handleSave = async () => {
        onSave(phone)
    };

    const handleCancel = () => {
        setPhone(currentPhone);
        onClose();
    };

    const hasChanges = phone !== currentPhone
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={i18nUpdateUser('update-phone')}
            size="md"
        >
            <div className="px-6 py-4 space-y-6">
                <p className="text-sm text-secondary-extralight font-montserrat">
                    {i18nUpdateUser('update-phone-description')}
                </p>

                <div className="space-y-4">
                    <PhoneInput
                        labelClass='text-primary-dark'
                        className='text-primary-dark'
                        important
                        required
                        value={phone}
                        onChange={(e: any) => setPhone(e.target.value)}
                        label={i18nCreateUser('phone-number')}
                        placeholder={i18nCreateUser('enter-phone-number')}
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

export default UpdatePhoneModal;