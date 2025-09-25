import  { forwardRef } from 'react';
import InputMask from 'react-input-mask';
import Input, { InputProps } from './Input';

type PhoneInputProps = Omit<InputProps, 'type'>;

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({
  value,
  onChange,
  placeholder = '+7 701 123 4567',
  ...props
}, ref) => {
  return (
    <InputMask
      mask="+7 999 999 9999"
      maskChar="_"
      value={value as string}
      onChange={onChange}
      disabled={props.disabled}
    >
      {(inputProps: any) => (
        <Input
          {...props}
          ref={ref}
          value={value}
          placeholder={placeholder}
          type="tel"
          {...inputProps}
        />
      )}
    </InputMask>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
