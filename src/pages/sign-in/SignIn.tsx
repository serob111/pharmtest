import { useState } from 'react';
import Input from '../../components/shared/ui/input/Input';
import { useTranslation } from 'react-i18next';
import Alert, { AlertType } from '../../components/alert/Alert';
import Authenticator from './Authenticator';
import { useSessionStart } from '../../context/AuthProvider';
import ForgotPassword from './ForgotPassword';
import { useNavigate, useSearchParams } from 'react-router';
import Button from '../../components/shared/ui/Button/baseBtn';
import { apiLogin } from '../../api/auth/auth';

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrMsg] = useState('')
  const [searchParams] = useSearchParams();
  const isResetPassword = searchParams.get("resetPassword");
  const [isForgotPassword, setForgotPassword] = useState(Boolean(isResetPassword))
  const navigate = useNavigate()
  const { t } = useTranslation()
  const sessionStart = useSessionStart()
  const [is2fa, setIs2fa] = useState(false)

  const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    const loginData = {
      email: email,
      password: password,
    }
    if (email && password) {
      try {
        const response = await apiLogin(loginData.email, loginData.password)
        sessionStart(response.data)
        if (!response.data.otp_required) {
          navigate('/users')
        } else {
          setIs2fa(true)
        }

      } catch {
        setErrMsg(t('wrong-credentials'))
      }
    }

  }
  const handleForgot = () => {
    setForgotPassword(true)
  }

  return (
    <div className=" px-10 pt-40 pb-10 bg-gray-50 flex w-1/2 h-full absolute right-0  inline-flex flex-col justify-start items-center gap-10 o p-8">
      {
        isForgotPassword ? (
          <ForgotPassword isResetPassword={Boolean(isResetPassword)} />
        ) : is2fa ? (
          <Authenticator />
        ) : (
          <div className="w-full max-w-md mt">
            <div className="text-center mb-8">
              <h1 className="text-3xl text-secondary-strong mb-2">
                {t('login-title')}
              </h1>
              <p className="text-primary-light">
                {t('login-subtitle')}
              </p>
            </div>
            {errorMsg && (
              <Alert
                type={AlertType.Error}
                onClose={() => setErrMsg('')}
                className="mb-4"
              >
                {errorMsg}
              </Alert>
            )}
            <form onSubmit={onLogin} className="space-y-6">
              <Input
                important={submitted && !email ? true : false}
                label="Email"
                type="email"
                placeholder={t('enter-email')}
                leftIcon={'mail'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={submitted && !email ? t('required-field') : ''}
              />
              <Input
                important={submitted && !password}
                label={t('password')}
                type="password"
                placeholder={t('enter-password')}
                leftIcon={'lock'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                clearable
                onClear={() => setPassword('')}
                error={submitted && !password ? t('required-field') : ''}
              />

              <div className="flex items-center justify-end">
                <span
                  onClick={handleForgot}
                  className="text-sm cursor-pointer text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {t('forgot-password')}?
                </span>
              </div>

              <Button type='submit'>
                {t("login")}
              </Button>
            </form>

            <div className="mt-8 self-stretch text-center justify-start">
              <span className="text-secondary-extralight text-sm font-normal leading-snug">
                {t('disclaimer')}{' '}
              </span>
              <a href="#" className="text-primary text-sm font-medium leading-snug">
                {t('termsLink')}
              </a>
            </div>
          </div>
        )
      }

    </div>

  )
}
