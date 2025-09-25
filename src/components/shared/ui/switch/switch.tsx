import React, { useEffect, useState } from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  size = 'md'
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  useEffect(()=>{
    setIsChecked(checked)
  },[checked])
  const handleToggle = () => {
    if (disabled) return;

    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange?.(newChecked);
  };

  const getSwitchClasses = () => {
    const baseClasses = 'relative flex items-center cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none';

    const sizeClasses = {
      sm: 'h-5 w-9',
      md: 'h-[22px] w-[40px]',
      lg: 'h-7 w-14'
    };

    const stateClasses = isChecked
      ? 'bg-primary'
      : 'bg-[#A7C9EF]';

    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed'
      : '';

    return `${baseClasses} ${sizeClasses[size]} ${stateClasses} ${disabledClasses}`;
  };

  const getThumbClasses = () => {
    const baseClasses = 'pointer-events-none inline-block  rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200';

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-[17px] w-[17px]',
      lg: 'h-6 w-6'
    };

    const positionClasses = {
      sm: isChecked ? 'translate-x-4' : 'translate-x-0',
      md: isChecked ? 'translate-x-5' : 'translate-x-0.5',
      lg: isChecked ? 'translate-x-6' : 'translate-x-0.5'
    };

    return `${baseClasses} ${sizeClasses[size]} ${positionClasses[size]}`;
  };

  const getLabelClasses = () => {
    return `text-primary-light font-montserrat text-sm font-medium leading-[22px] ${disabled ? 'opacity-50' : ''}`;
  };

  return (
    <div className={`flex items-center gap-3`}>
      <button
        type="button"
        className={`${getSwitchClasses()}`}
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className={getThumbClasses()} />
      </button>

      {label && (
        <span className={getLabelClasses()}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Switch;