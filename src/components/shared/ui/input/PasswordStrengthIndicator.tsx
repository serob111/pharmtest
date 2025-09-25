import React, { Dispatch, SetStateAction, useEffect } from 'react';
import Check from '../../../../assets/checkcircle.svg?react'
import CheckSuccess from '../../../../assets/checkcirclesuccess.svg?react'
import { useTranslation } from 'react-i18next';


export interface PasswordRule {
  id: string;
  text: string;
  validator: (password: string) => boolean;
}

export interface PasswordStrengthIndicatorProps {
  size?: 'sm' | 'xs';
  color?: string;
  password: string;
  setIsValid: Dispatch<SetStateAction<boolean>>;
  rules?: PasswordRule[];
  className?: string;
}

const defaultRules: PasswordRule[] = [
  {
    id: 'minLength',
    text: 'passwordValidation.minLength',
    validator: (password: string) => password.length >= 8
  },
  {
    id: 'hasUpperLower',
    text: 'passwordValidation.uppercaseLowercase',
    validator: (password: string) => /[a-z]/.test(password) && /[A-Z]/.test(password)
  },
  {
    id: 'hasNumber',
    text: 'passwordValidation.numberRequired',
    validator: (password: string) => /\d/.test(password)
  },
  {
    id: 'hasSpecial',
    text: 'passwordValidation.specialCharRequired',
    validator: (password: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  size='sm',
  color,
  password,
  rules = defaultRules,
  setIsValid,
  className = ''
}) => {
  const allValid = rules.every(rule => rule.validator(password));

  useEffect(() => {
    setIsValid(allValid);
  }, [allValid, setIsValid])

  const renderRule = (rule: PasswordRule) => {
    const { t } = useTranslation()
    const isValid = rule.validator(password);


    return (
      <div
        key={rule.id}
        className={`flex gap-2 text-${size} text-primary-light font-montserrat transition-colors duration-200 `}
      >
        <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 `}>
          {!isValid ? (
            <Check className="  text-white" />
          ) : (
            <CheckSuccess className=" text-secondary opacity-50" />
          )}
        </div>
        <span className="leading-snug">
          {t(rule.text)}
        </span>
      </div>
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {rules.map(renderRule)}
    </div>
  );
};

export default PasswordStrengthIndicator;