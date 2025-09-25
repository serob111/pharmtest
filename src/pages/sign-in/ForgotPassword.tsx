import { useState } from "react";
import EnterEmail from "./ResetPassword/EnterEmail";
import EmailSent from "./ResetPassword/EmailSent";
import NewPassword from "./ResetPassword/NewPassword";
import PasswordUpdated from "./ResetPassword/PasswordUpdated";
import { useNavigate } from "react-router";


enum ResetStep {
    EnterEmail,
    EmailSent,
    EnterNewPassword,
    PasswordUpdated
}

export default function ForgotPassword({ isResetPassword }: { isResetPassword: boolean }) {
    const [resetStep, setResetStep] = useState<ResetStep>(isResetPassword ? ResetStep.EnterNewPassword : ResetStep.EnterEmail);
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const StepComponents = {
        [ResetStep.EnterEmail]: <EnterEmail email={email} setEmail={setEmail} onNext={() => setResetStep(ResetStep.EmailSent)} />,
        [ResetStep.EmailSent]: <EmailSent email={email} onNext={() => navigate("/")} />,
        [ResetStep.EnterNewPassword]: <NewPassword onNext={() => setResetStep(ResetStep.PasswordUpdated)} />,
        [ResetStep.PasswordUpdated]: <PasswordUpdated onDone={() => navigate("/")} />
    };

    return (
        <div className="w-full max-w-md mt">
            {StepComponents[resetStep]}
        </div>
    )
}
