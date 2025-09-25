import { useTranslation } from "react-i18next";
import Button from "../../../components/shared/ui/Button/baseBtn";

type Props = {
  onDone: () => void;
};

export default function PasswordUpdated({ onDone }: Props) {
  const { t } = useTranslation()
  const handleSubmit = async () => {
    onDone();
  };

  return (
    <>
      <div className="text-center flex flex-col mb-8 gap-4">
        <h1 className="text-3xl text-secondary-strong mb-2">
          {t('password-updated')}
        </h1>
        <p className="text-secondary">
          {t('password-updated-subtitle')}
        </p>
        <Button onClick={handleSubmit}>
          {t("back-to-login")}
        </Button>
      </div>
    </>
  )
}
