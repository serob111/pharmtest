import { useTranslation } from 'react-i18next'
import Alert, { AlertType } from '../../components/alert/Alert'
import { useState } from 'react'
import AuthenticatorInput from '../../components/shared/ui/input/AuthenticatorInput'
import { useAuth, useSessionEnd, useSessionStart } from '../../context/AuthProvider'
import Button from '../../components/shared/ui/Button/baseBtn'
import { useNavigate } from 'react-router'
import { AxiosError } from 'axios'
import { apiObtainTwoFactor } from '../../api/auth/auth'

export default function Authenticator() {
    const { t } = useTranslation()
    const [code, setCode] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate()
    const auth = useAuth()
    const sessionEnd = useSessionEnd()
    const sessionStart = useSessionStart()
    const handleCodeChange = (value: string) => {
        setCode(value);
        if (showAlert) {
            setShowAlert(false);
        }
    };

    const handleCodeComplete = (value: string) => {
        console.log('Code completed:', value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        if (code.length !== 6) {
            setAlertMessage(t('enter-valid-code'));
            setShowAlert(true);
            return;
        }

        setIsVerifying(true);
        try {
            const response = await apiObtainTwoFactor(code, auth?.auth_temp_token as string)
            sessionStart(response.data)
            navigate('/users/')
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                setAlertMessage(error.response?.data);
            } else {
                setAlertMessage('An unexpected error occurred');
            }
            setIsVerifying(false);
            sessionEnd();
        }
    };

    return (
        <div className="w-full max-w-md mt">
            <div className="text-center mb-8">
                <h1 className="text-3xl text-secondary-strong mb-2">
                    {t('confirm')}
                </h1>
                <p className="text-secondary">
                    {t('confirm-subtitle')}
                </p>
            </div>
            {alertMessage && (
                <Alert
                    alertMsgs={alertMessage}
                    type={AlertType.Error}
                    onClose={() => setAlertMessage('')}
                    className="mb-4"
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <AuthenticatorInput
                        value={code}
                        onChange={handleCodeChange}
                        onComplete={handleCodeComplete}
                        error={submitted && alertMessage ? true : false}
                        autoFocus
                    />

                </div>

                <Button
                    type="submit"
                    className="w-full"
                    loading={isVerifying}
                    disabled={code.length !== 6}
                >
                    {isVerifying ? 'Verifying...' : t('confirm')}
                </Button>

            </form>


        </div>
    )
}
