import React, { useState, useRef, useEffect } from 'react';

export interface AuthenticatorInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  autoFocus?: boolean;
}

const AuthenticatorInput: React.FC<AuthenticatorInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className = '',
  autoFocus = false
}) => {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const newDigits = Array(length).fill('');
    for (let i = 0; i < Math.min(value.length, length); i++) {
      newDigits[i] = value[i] || '';
    }
    setDigits(newDigits);
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, newValue: string) => {
    if (newValue.length > 1) {
      newValue = newValue.slice(-1);
    }

    if (newValue && !/^\d$/.test(newValue)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = newValue;
    setDigits(newDigits);

    const fullValue = newDigits.join('');
    onChange?.(fullValue);

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (fullValue.length === length) {
      onComplete?.(fullValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        onChange?.(newDigits.join(''));
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
        onChange?.(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    
    const newDigits = Array(length).fill('');
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    
    setDigits(newDigits);
    onChange?.(newDigits.join(''));
    
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
    
    if (pastedData.length === length) {
      onComplete?.(pastedData);
    }
  };

  const getInputClasses = () => {
    const baseClasses = `
      w-[58px] h-[44px] text-center text-lg font-medium 
      bg-white rounded-lg border transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
    `;

    const stateClasses = error
      ? 'border-red-500 bg-red-50'
      : 'border-gray-300 hover:border-gray-400';

    return `${baseClasses} ${stateClasses}`;
  };

  return (
    <div className={`inline-flex justify-center items-center gap-3 ${className}`}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={getInputClasses()}
          autoComplete="one-time-code"
          
        />
      ))}
    </div>
  );
};

export default AuthenticatorInput;