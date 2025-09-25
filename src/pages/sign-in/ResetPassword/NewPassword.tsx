import { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../components/shared/ui/input/Input";
import PasswordStrengthIndicator from "../../../components/shared/ui/input/PasswordStrengthIndicator";
import Alert, { AlertType } from "../../../components/alert/Alert";
import Button from "../../../components/shared/ui/Button/baseBtn";

type Props = {
    onNext: () => void;
};

export default function NewPassword({ onNext }: Props) {
    const [submitted, setSubmitted] = useState(false);
    const { t } = useTranslation()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [valid, setIsvalid] = useState(false)
    const [alertMessage, setAlertMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        if (password !== confirmPassword) {
            setAlertMessage(t('not-match'));
            return;
        }
        onNext();
        setSubmitted(false);
    };

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl text-secondary-strong mb-2">
                    {t('create-password')}
                </h1>
                <p className="text-secondary">
                    {t('new-password-requirements')}
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
                <div className="flex flex-col items-center space-y-6">
                    <Input
                        label={t('new-password')}
                        type="password"
                        placeholder={t('enter-new-password')}
                        leftIcon={'lock'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        important
                        clearable
                        onClear={() => setPassword('')}
                        error={submitted && !password ? t('required-field') : ''}
                    />
                    <Input
                        label={t('confirm-password')}
                        type="password"
                        important
                        placeholder={t('repeat-password')}
                        leftIcon={'lock'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        clearable
                        onClear={() => setConfirmPassword('')}
                        error={submitted && !password ? t('required-field') : ''}
                    />
                    <div className="mr-24">
                        <PasswordStrengthIndicator
                            password={password}
                            setIsValid={setIsvalid}
                        />
                    </div>
                    <Button disabled={!valid} type='submit'>
                        {t("save-new-password")}
                    </Button>
                </div>
            </form>
        </>
    )
}
