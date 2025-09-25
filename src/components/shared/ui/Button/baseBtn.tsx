import React from 'react';
import Spinner from '../Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'warning';
  size?: 'default' | 'xs' | 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const getBaseClasses = () => {
    return 'inline-flex items-center justify-center gap-2  font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'p-1 text-xs w-[32px] h-8';
      case 'sm':
        return 'px-3 py-2 text-sm w-[85px] h-[40px]';
      case 'lg':
        return 'px-6 py-3 text-base w-[200px]';
      case 'md':
        return 'px-4 py-2.5 text-sm w-[150px]';
      case 'default':
      default:
        return 'px-4 py-2.5 text-base w-full';
    }
  };

  const getVariantClasses = () => {
    if (disabled || loading) {
      return 'bg-secondary-light text-gray-500 cursor-not-allowed';
    }

    switch (variant) {
      case 'secondary':
        return 'bg-secondary-light text-white focus:ring-blue-500';
      case 'outline':
        return 'bg-white text-secondary-strong border border-gray-300 hover:bg-gray-50 focus:ring-blue-500';
      case 'warning':
        return 'bg-white text-red-500 border border-red-500 hover:bg-gray-50 focus:ring-red-500';
      case 'primary':
      default:
        return 'bg-primary text-white  focus:ring-blue-500';
    }
  };

  const renderIcon = (icon: React.ReactNode, position: 'left' | 'right') => {
    if (loading && position === 'left') {
      return <Spinner />;
    }
    return icon;
  };
  return (
    <button
      className={`${getBaseClasses()} ${getSizeClasses()} ${getVariantClasses()} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {leftIcon && renderIcon(leftIcon, 'left')}
      {children}
      {rightIcon && renderIcon(rightIcon, 'right')}
    </button>
  );
};

export default Button;