'use client';

import { useState, useCallback } from 'react';
import { 
  ValidationResult,
  validateRequired,
  validateEmail,
  validatePhone,
  validateDate,
  validateMinLength,
  validateMaxLength,
  validateOnlyLetters
} from '@/lib/validations';

export type ValidatorFn = (value: string) => ValidationResult;

export interface UseFormValidationOptions<T extends Record<string, string>> {
  initialValues: T;
  validators: Partial<Record<keyof T, ValidatorFn[]>>;
  onSubmit: (values: T) => Promise<void>;
}

export interface UseFormValidationReturn<T extends Record<string, string>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: string) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => boolean;
  validateAll: () => boolean;
}

/**
 * Hook personalizado para manejo de formularios con validación
 */
export function useFormValidation<T extends Record<string, string>>({
  initialValues,
  validators,
  onSubmit
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar un campo específico
  const validateField = useCallback((field: keyof T): boolean => {
    const fieldValidators = validators[field];
    if (!fieldValidators) return true;

    const value = values[field];
    
    for (const validator of fieldValidators) {
      const result = validator(value);
      if (!result.isValid) {
        setErrors(prev => ({ ...prev, [field]: result.error }));
        return false;
      }
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    return true;
  }, [values, validators]);

  // Validar todos los campos
  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const field of Object.keys(validators) as (keyof T)[]) {
      const fieldValidators = validators[field];
      if (!fieldValidators) continue;

      const value = values[field];
      
      for (const validator of fieldValidators) {
        const result = validator(value);
        if (!result.isValid) {
          newErrors[field] = result.error;
          isValid = false;
          break;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [values, validators]);

  // Manejar cambios en campos
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name as keyof T]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof T];
        return newErrors;
      });
    }
  }, [errors]);

  // Manejar blur (perder foco)
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof T);
  }, [validateField]);

  // Establecer valor de un campo programáticamente
  const setFieldValue = useCallback((field: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  // Establecer error de un campo programáticamente
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Manejar submit
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    setTouched(allTouched);

    // Validar todos los campos
    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateAll, onSubmit]);

  // Calcular si el formulario es válido
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateField,
    validateAll
  };
}

// ==================== VALIDADORES PRE-CONFIGURADOS ====================

/**
 * Crea un validador de campo obligatorio
 */
export const required = (fieldName: string): ValidatorFn => 
  (value) => validateRequired(value, fieldName);

/**
 * Crea un validador de longitud mínima
 */
export const minLength = (min: number, fieldName: string): ValidatorFn => 
  (value) => validateMinLength(value, min, fieldName);

/**
 * Crea un validador de longitud máxima
 */
export const maxLength = (max: number, fieldName: string): ValidatorFn => 
  (value) => validateMaxLength(value, max, fieldName);

/**
 * Validador de email
 */
export const email: ValidatorFn = validateEmail;

/**
 * Validador de teléfono (9 dígitos)
 */
export const phone: ValidatorFn = validatePhone;

/**
 * Validador de fecha (dd/mm/yyyy, año 1900-actual)
 */
export const date: ValidatorFn = validateDate;

/**
 * Crea un validador de solo letras
 */
export const onlyLetters = (fieldName: string): ValidatorFn => 
  (value) => validateOnlyLetters(value, fieldName);

/**
 * Crea un validador con patrón regex personalizado
 */
export const pattern = (regex: RegExp, errorMessage: string): ValidatorFn => 
  (value) => {
    if (!regex.test(value)) {
      return { isValid: false, error: errorMessage };
    }
    return { isValid: true };
  };

/**
 * Crea un validador de rango numérico
 */
export const numberRange = (min: number, max: number, fieldName: string): ValidatorFn => 
  (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      return { isValid: false, error: `${fieldName} debe ser un número` };
    }
    if (num < min || num > max) {
      return { isValid: false, error: `${fieldName} debe estar entre ${min} y ${max}` };
    }
    return { isValid: true };
  };

export default useFormValidation;
