import { useState } from 'react';

export interface QuoteFormValues {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
}

export type QuoteFormErrors = Partial<Record<keyof QuoteFormValues, string>>;
export type QuoteFormStatus = 'idle' | 'submitting' | 'success';

const initialValues: QuoteFormValues = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  budget: '',
  message: ''
};

export function useQuoteForm() {
  const [values, setValues] = useState<QuoteFormValues>(initialValues);
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [status, setStatus] = useState<QuoteFormStatus>('idle');

  const update = (field: keyof QuoteFormValues, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): QuoteFormErrors => {
    const next: QuoteFormErrors = {};
    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (!values.email.trim()) next.email = 'Please enter your email.';else
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = 'That email doesn’t look right.';
    if (!values.projectType) next.projectType = 'Choose a project type.';
    return next;
  };

  const submit = async () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setStatus('success');
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setStatus('idle');
  };

  return { values, errors, status, update, submit, reset };
}