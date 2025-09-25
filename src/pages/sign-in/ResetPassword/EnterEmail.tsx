import { t } from 'i18next';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router';
import Alert, { AlertType } from '../../../components/alert/Alert';
import Button from '../../../components/shared/ui/Button/baseBtn';
import Input from '../../../components/shared/ui/input/Input';

type Props = {
    onNext: () => void;
    setEmail: Dispatch<SetStateAction<string>>;
    email: string
};

export default function EnterEmail({ onNext, setEmail, email }: Props) {
    const [alertMessage, setAlertMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true)
        if (email) {
            onNext()
        }
    };
    const handleBack = () => {
        navigate('/')
    }
    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl text-secondary-strong mb-2">
                    {t('reset-password-title')}
                </h1>
                <p className="text-secondary">
                    {t('reset-password-subtitle')}
                </p>
            </div>
            {alertMessage && (
                <Alert
                    type={AlertType.Error}
                    onClose={() => setAlertMessage('')}
                    className="mb-4"
                >
                    {alertMessage}
                </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder={t('enter-email')}
                        leftIcon={'email'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        error={submitted && !email ? t('required-field') : ''}
                    />
                    <Button type='submit'>
                        {t("send-reset-link")}
                    </Button>
                </div>
            </form>
            <div className="text-center">
                <button
                    onClick={handleBack}
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500 mt-3 transition-colors font-montserrat"
                >
                    {t('back-to-login')}
                </button>
            </div>
        </>
    )
}
