import { TextField } from '@/components/text-field';
import type { InputHTMLAttributes } from 'react';

type PhoneFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: string;
};

export function PhoneField({ label, error, ...props }: PhoneFieldProps) {
  return (
    <TextField
      label={label}
      error={error}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      {...props}
    />
  );
}
