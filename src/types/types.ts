export interface BaseInputProps {
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    helperText?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
  }
  
  export interface TextInputProps extends BaseInputProps {
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'password' | 'number';
  }
  
  export interface TagInputProps extends BaseInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    maxTags?: number;
    suggestions?: string[];
  }
  
  export interface SelectInputProps extends BaseInputProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    clearable?: boolean;
  }
  
  export interface InputWithIconProps extends TextInputProps {
    icon: React.ReactNode;
    iconPosition?: 'left' | 'right';
  }