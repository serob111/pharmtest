import React, { useEffect, useState } from 'react';
import Modal from '../modal/Modal';
import Button from '../shared/ui/Button/baseBtn';
import { useTranslation } from 'react-i18next';
import PhoneInput from '../shared/ui/input/PhoneInput';
import { useDashboard } from '../../context/DashboardProvider';
import AuthenticatorInput from '../shared/ui/input/AuthenticatorInput';
import Alert from '../alert/Alert';
import Spinner from '../shared/ui/Spinner';


export interface UpdatePhoneModalProps {
    isOpen: boolean;
    onClose: () => void;
    is2fa: boolean;
    onSave: (totp_token: string,) => void;
}

const Update2FaModal: React.FC<UpdatePhoneModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {
    const { t } = useTranslation();
    const { qrCode, loading } = useDashboard()
    const [code, setCode] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const i18nUpdateUser = (key: string): string =>
        t(`update-profile.${key}`);

    const handleCodeChange = (value: string) => {
        setCode(value);
        if (showAlert) {
            setShowAlert(false);
        }
    };
    const handleCodeComplete = (value: string) => {
        console.log('Code completed:', value);
    };

    const handleSave = async () => {
        onSave(code)
    };

    const handleCancel = () => {
        onClose();
    };


    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={i18nUpdateUser('2fa')}
            size="md"
        >
            {
                loading ?
                    <Spinner />
                    :
                    <>
                        <div className="space-y-6 px-6 py-4">
                            <p className="text-sm text-secondary-extralight font-montserrat">
                                {i18nUpdateUser('2fa-description')}
                            </p>
                            <div className="space-y-4 w-full h-full flex flex-col items-center justify-center">
                                <img width={200} height={200} src={qrCode} />
                                <span className='text-sm text-primary-light'>{i18nUpdateUser('6-digit')}</span>
                                <AuthenticatorInput
                                    value={code}
                                    onChange={handleCodeChange}
                                    onComplete={handleCodeComplete}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex w-full bg-gray-100 m-auto justify-end gap-3 p-4 ">
                            <Button
                                size='sm'
                                variant="outline"
                                onClick={handleCancel}
                            >
                                {i18nUpdateUser('cancel')}
                            </Button>
                            <Button
                                size='sm'
                                onClick={handleSave}
                                disabled={code.length !== 6}
                            >
                                {i18nUpdateUser('verify')}
                            </Button>
                        </div>
                    </>
            }
        </Modal>
    );
};

export default Update2FaModal;