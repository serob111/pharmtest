import { useTranslation } from "react-i18next";
import Input from "../../../components/shared/ui/input/Input";
import PhoneInput from "../../../components/shared/ui/input/PhoneInput";
import SelectInput from "../../../components/shared/ui/input/SelectInput";
import { useEffect, useState } from "react";
import PasswordStrengthIndicator from "../../../components/shared/ui/input/PasswordStrengthIndicator";
import CheckboxInput from "../../../components/shared/ui/input/CheckBoxInput";
import Header from "../../../components/header/Header";
import Alert, { AlertType } from "../../../components/alert/Alert";
import { useUsers } from "../../../context/UsersProvider";
import { generateSecurePassword } from "../../../lib/utils";
import Button from "../../../components/shared/ui/Button/baseBtn";

export default function CreateUser() {
  const { t } = useTranslation();
  const i18nCreateUser = (key: string): string =>
    t(`create-user.${key}`);
  const [submitted, setSubmitted] = useState(false);
  const [password, setPassword] = useState("");
  const [first_name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clinic_role, setRole] = useState('')
  const [confirm_password, setConfirmPassword] = useState("");
  const [validPassword, setIsValid] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { CreateUser, alertMsgs } = useUsers()
  const { getRoles, roles } = useUsers()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    CreateUser({
      first_name,
      last_name,
      email,
      phone,
      clinic_role,
      password,
      confirm_password
    })
  };
  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    setPassword(newPassword);
    setConfirmPassword(newPassword);
  };
  useEffect(() => {
    getRoles()
  }, [])
  console.log(alertMsgs)
  return (
    <div className="relative h-screen flex flex-col overflow-x-hidden">

      <Header
        title={i18nCreateUser('create-user')}
        crumbs={[{ path: '/users/', name: i18nCreateUser('users') }, { name: i18nCreateUser('create-user'), path: '' }]}
      />
      <form className="w-full flex flex-col justify-between" onSubmit={handleSubmit}>
        <div className="w-1/2 p-5 flex flex-col gap-5">
          <div className="flex gap-5">
            <Input
              important
              required
              name="first_name"
              value={first_name}
              onChange={(e) => setName(e.target.value)}
              label={i18nCreateUser('first-name')}
              placeholder={i18nCreateUser('enter-first-name')}
            />
            <Input
              important
              required
              name="last_name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              label={i18nCreateUser('last-name')}
              placeholder={i18nCreateUser('enter-last-name')}
            />
          </div>

          <Input
            important
            name="email"
            label={i18nCreateUser('email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={i18nCreateUser('enter-email')}
            required
            error={alertMsgs['email'] ? alertMsgs['email'][0] : ''}
          />

          <PhoneInput
            important
            required
            name="phone_number"
            value={phone}
            onChange={(e: any) => setPhone(e.target.value)}
            label={i18nCreateUser('phone-number')}
            placeholder={i18nCreateUser('enter-phone-number')}
            error={alertMsgs['phone'] ? alertMsgs['phone'][0] : ''}
          />

          <SelectInput
            important
            name="clinic_role"
            label={i18nCreateUser('role')}
            required
            placeholder={i18nCreateUser('select-role')}
            onChange={(value) => setRole(value as string)}
            value={clinic_role || ''}
            options={roles}
          />


          <Input
            name="password"
            label={t('password')}
            type={agreed ? "text" : "password"}
            placeholder={t('create-password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            important
            disabled={agreed}
          />

          <CheckboxInput
            label={i18nCreateUser('generate-password')}
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked)
              handleGeneratePassword()
            }}
          />
          <Input
            name="repeat_password"
            label={t('confirm-password')}
            type={agreed ? "text" : "password"}
            placeholder={t('repeat-password')}
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            important
            disabled={agreed}
            error={submitted && confirm_password !== password ? t('not-match') : ''}
          />

          <PasswordStrengthIndicator
            password={password}
            setIsValid={setIsValid}
          />
        </div>

        <div className="w-full bg-gray-100 p-2 flex items-center gap-4 justify-end">
          <Button
            onClick={() => { window.location.assign('/users') }}
            type="button" variant="outline" size="md"  >
            {i18nCreateUser('cancel')}
          </Button>
          <Button
            disabled={!first_name || !last_name || !email || !phone || !clinic_role || !validPassword || confirm_password !== password}
            type="submit"
            size="md"
            className="bg-primary">
            {i18nCreateUser('create')}
          </Button>
        </div>
      </form>
    </div>
  );
}
