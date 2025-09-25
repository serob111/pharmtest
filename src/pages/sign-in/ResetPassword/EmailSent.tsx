import { useTranslation } from "react-i18next";
import Button from "../../../components/shared/ui/Button/baseBtn";

type Props = {
    onNext: () => void;
    email: string
};

export default function EmailSent({ onNext, email }: Props) {
    const { t } = useTranslation()
    const handleSubmit = () => {
        onNext();
    };

    return (
        <>
            <div className="text-center flex flex-col mb-8 gap-4">
                <h1 className="text-3xl text-secondary-strong mb-2">
                    📨{t('check-email')}
                </h1>
                <p className="text-secondary">
                    {t('reset-password-email-sent', { email })}
                </p>
                <Button onClick={handleSubmit}>
                    {t("back-to-login")}
                </Button>
                <div className="text-center text-sm flex gap-2 justify-center">
                    <span className="text-secondary">
                        {t("not-get-message")}
                    </span>
                    <a
                        href={'/sign-in'}
                        className="text-blue-600 hover:text-blue-500 transition-colors font-montserrat"
                    >
                        {t('send-again')}
                    </a>
                </div>
            </div>
        </>
    )
}
