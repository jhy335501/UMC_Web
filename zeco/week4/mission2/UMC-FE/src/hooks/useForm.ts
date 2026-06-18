import { useState, useEffect } from 'react';
import React from 'react';

interface UseFormProps<T> {
  initialValues: T;
  validate: (values: T) => Record<string, string>;
}

function useForm<T extends Record<string, string>>({
  initialValues,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setErrors(validate(values));
  }, [values]);

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleBlur(name: string) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function getInputProps(name: string) {
    return {
      value: values[name] ?? '',
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
    };
  }

  return { values, errors, touched, getInputProps };
}

export default useForm;
