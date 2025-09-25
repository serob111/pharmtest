import React, { useState, forwardRef } from 'react';
import EyeOff from '../../../../assets/eyeoff.svg?react'
import Eye from '../../../../assets/eye.svg?react'
import X from '../../../../assets/x.svg?react'
import { IconMaterial } from '../../iconMaterial/IconMaterial';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    labelClass?: string;
    required?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    rightIcons?: string[];
    helpText?: string;
    error?: string;
    success?: boolean;
    important?: boolean;
    suffix?: string;
    onRightIconClick?: () => void;
    onRightIconsClick?: (index: number) => void;
    size?: 'sm' | 'md' | 'lg' | 'default';
    variant?: 'default' | 'filled' | 'outlined';
    clearable?: boolean;
    onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    labelClass = 'text-primary-dark',
    required = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    rightIcons = [],
    helpText,
    error,
    success,
    important = false,
    suffix,
    onRightIconClick,
    onRightIconsClick,
    size = 'default',
    variant = 'default',
    clearable = false,
    onClear,
    className = '',
    value,
    type = 'text',
    disabled = false,
    placeholder,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const handleClear = () => {
        if (onClear) {
            onClear();
        }
    };

    const sizeClasses = {
        sm: 'px-3 py-2 text-xs w-[200px] h-[44px]',
        md: 'px-4 py-2 text-md w-8 w-[244px] h-[44px]',
        lg: 'px-4 py-2 text-sm w-[300px] h-[38px]',
        default: "w-full px-4 py-2 text-md h-[44px]"
    };

    const getInputClasses = () => {
        const baseClasses = `
      rounded-lg inline-flex justify-start items-center gap-2 transition-all duration-200
      ${sizeClasses[size]}
    `;

        const stateClasses = error
            ? 'outline outline-1 outline-offset-[-1px] outline-red-500 '
            : success
                ? 'outline outline-1 outline-offset-[-1px] outline-green-500 '
                : isFocused
                    ? 'outline outline-2 outline-offset-[-1px] outline-blue-500 '
                    : 'outline outline-1 outline-offset-[-1px] outline-gray-300 ';

        const disabledClasses = disabled
            ? 'cursor-not-allowed bg-background-light-gray'
            : '';

        return `${baseClasses} ${stateClasses} ${disabledClasses}`;
    };

    const getLabelClasses = () => {
        const baseClasses = 'font-medium  leading-snug';
        const sizeClasses = {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
            default: 'text-sm'
        };
        return `${baseClasses} ${sizeClasses[size]} ${labelClass}`;
    };

    const getHelpTextClasses = () => {
        const baseClasses = ' leading-snug';
        const sizeClasses = {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
            default: 'text-base'
        };

        if (error) {
            return `${baseClasses} text-sm  text-red-600`;
        }
        if (success) {
            return `${baseClasses} ${sizeClasses[size]} text-green-600`;
        }
        return `${baseClasses} ${sizeClasses[size]} text-secondary`;
    };

    const renderIcons = () => {
        const icons = [];

        if (rightIcons.length > 0) {
            rightIcons.forEach((Icon, index) => {
                icons.push(
                    <button
                        key={`right-icon-${index}`}
                        type="button"
                        onClick={() => onRightIconsClick?.(index)}
                        disabled={disabled}
                        className={` text-secondary hover:text-secondary-strong transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <IconMaterial
                            filled
                            icon={Icon}
                            className="text-primary-light cursor-pointer mt-1"
                            size={20}
                            
                        />
                    </button>
                );
            });
        }

        if (RightIcon) {
            icons.push(
                <button
                    key="right-icon"
                    type="button"
                    onClick={onRightIconClick}
                    disabled={disabled}
                    className={`transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <IconMaterial
                        filled
                        icon={RightIcon}
                        className="text-primary-light cursor-pointer mt-1"
                        size={20}
                        
                    />
                </button>
            );
        }


        if (isPasswordType && value) {
            icons.push(
                <button
                    key="password-toggle"
                    type="button"
                    onClick={handlePasswordToggle}
                    disabled={disabled}
                    className={`text-secondary hover:text-secondary-strong transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </button>
            );
        }

        if (clearable && value && !disabled) {
            icons.unshift(
                <button
                    key="clear-button"
                    type="button"
                    onClick={handleClear}
                    className={`text-secondary-light hover:text-secondary transition-colors cursor-pointer`}
                >
                    <X />
                </button>
            );
        }
        return icons;
    };

    return (
        <div className={`w-full inline-flex flex-col justify-start items-start gap-3 ${className}`}>
            {label && (
                <div className="w-full inline-flex justify-start items-center gap-1">
                    <div className={getLabelClasses()}>
                        {label}
                        {important && <span className="text-red-500 ml-1">*</span>}
                    </div>
                </div>
            )}

            <div className={`w-full ${getInputClasses()}`}>
                {LeftIcon && (
                    <div className={`text-secondary flex-shrink-0`}>
                        <IconMaterial
                            filled
                            icon={LeftIcon}
                            className="text-primary-light cursor-pointer mt-1"
                            size={20}
                            
                        />
                    </div>
                )}
                <div className="flex-1 flex justify-start items-center gap-2">
                    <input
                        ref={ref}
                        type={inputType}
                        value={value}
                        placeholder={placeholder}
                        disabled={disabled}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`
              w-full bg-transparent border-none outline-none text-secondary-strong  leading-snug
              placeholder:text-secondary placeholder:text-sm place disabled:cursor-not-allowed
              ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}
            `}
                        {...props}
                    />
                    {suffix && (
                        <span className={`text-secondary leading-snug ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
                            {suffix}
                        </span>
                    )}
                </div>

                {renderIcons()}
            </div>

            {(helpText || error) && (
                <div className={getHelpTextClasses()}>
                    {error || helpText}
                </div>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;