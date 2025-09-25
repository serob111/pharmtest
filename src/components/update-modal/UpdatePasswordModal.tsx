import React, {useState } from 'react';
import Modal from '../modal/Modal';
import Button from '../shared/ui/Button/baseBtn';
import Input from '../shared/ui/input/Input';
import { useTranslation } from 'react-i18next';
import PasswordStrengthIndicator from '../shared/ui/input/PasswordStrengthIndicator';


export interface UpdatePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (password: string, lastName: string) => void;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({
    isOpen,
    onClose,
    onSave
}) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [validPassword, setIsValid] = useState(false);
    const { t } = useTranslation();
    const i18nUpdateUser = (key: string): string =>
        t(`update-profile.${key}`);

    const handleSave = async () => {
        setSubmitted(true)
        onSave(password, confirmPassword)
    };

    const handleCancel = () => {
        setPassword('');
        setConfirmPassword('');
        onClose();
    };

    const hasChanges = password !== confirmPassword

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleCancel}
            title={i18nUpdateUser('update-password')}
            size="md"
        >
            <div className="space-y-6 px-6 py-4">
                <p className="text-sm text-secondary-extralight font-montserrat">
                    {i18nUpdateUser('update-password-description')}
                </p>

                <div className="space-y-4">
                    <Input
                        labelClass='text-primary-dark'
                        className='text-primary-dark'
                        label={i18nUpdateUser('new-password')}
                        type={"password"}
                        placeholder={t('enter-new-password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        important
                        clearable
                        onClear={() => setPassword('')}
                    />
                    <Input
                        labelClass='text-primary-dark'
                        className='text-primary-dark'
                        label={i18nUpdateUser('confirm-new-password')}
                        type={"password"}
                        placeholder={t('repeat-password')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        important
                        clearable
                        onClear={() => setConfirmPassword('')}
                        error={submitted && confirmPassword !== password ? t('not-match') : ''}
                    />
                    <PasswordStrengthIndicator
                        size={'xs'}
                        password={password}
                        setIsValid={setIsValid}
                    />
                </div>

            </div>

            <div className="flex bg-gray-100 justify-end gap-3 p-4">
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
                    disabled={!validPassword || hasChanges}
                >
                    {i18nUpdateUser('save')}
                </Button>
            </div>
        </Modal>
    );
};

export default UpdatePasswordModal;