// Librería de validaciones compartida entre frontend y backend
// Validaciones de formato, longitud, rango y unicidad

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ContactFormData {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  asunto: string;
  mensaje: string;
}

// Constantes de validación
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1900;
const PHONE_LENGTH = 9;

// ==================== VALIDACIONES DE CAMPOS INDIVIDUALES ====================

/**
 * Valida que un campo no esté vacío (obligatorio)
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  const trimmedValue = value?.trim() || '';
  if (!trimmedValue) {
    return {
      isValid: false,
      error: `El campo ${fieldName} es obligatorio`
    };
  }
  return { isValid: true };
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): ValidationResult {
  const requiredCheck = validateRequired(email, 'email');
  if (!requiredCheck.isValid) return requiredCheck;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: 'El formato del email no es válido'
    };
  }
  return { isValid: true };
}

/**
 * Valida teléfono: exactamente 9 dígitos
 */
export function validatePhone(phone: string): ValidationResult {
  const requiredCheck = validateRequired(phone, 'teléfono');
  if (!requiredCheck.isValid) return requiredCheck;

  // Eliminar espacios y guiones para validar
  const cleanPhone = phone.replace(/[\s\-]/g, '');
  
  // Verificar que solo contenga dígitos
  if (!/^\d+$/.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'El teléfono solo debe contener números'
    };
  }

  // Verificar longitud exacta de 9 dígitos
  if (cleanPhone.length !== PHONE_LENGTH) {
    return {
      isValid: false,
      error: `El teléfono debe tener exactamente ${PHONE_LENGTH} dígitos`
    };
  }

  return { isValid: true };
}

/**
 * Valida fecha en formato dd/mm/yyyy con año entre 1900 y año actual
 */
export function validateDate(dateString: string): ValidationResult {
  const requiredCheck = validateRequired(dateString, 'fecha');
  if (!requiredCheck.isValid) return requiredCheck;

  // Verificar formato dd/mm/yyyy
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.trim().match(dateRegex);

  if (!match) {
    return {
      isValid: false,
      error: 'La fecha debe tener el formato dd/mm/yyyy'
    };
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Validar rango de año
  if (year < MIN_YEAR || year > CURRENT_YEAR) {
    return {
      isValid: false,
      error: `El año debe estar entre ${MIN_YEAR} y ${CURRENT_YEAR}`
    };
  }

  // Validar mes
  if (month < 1 || month > 12) {
    return {
      isValid: false,
      error: 'El mes debe estar entre 01 y 12'
    };
  }

  // Validar días según el mes
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return {
      isValid: false,
      error: `El día debe estar entre 01 y ${daysInMonth} para el mes ${month.toString().padStart(2, '0')}`
    };
  }

  // Verificar que la fecha no sea futura
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (inputDate > today) {
    return {
      isValid: false,
      error: 'La fecha no puede ser futura'
    };
  }

  return { isValid: true };
}

/**
 * Valida longitud mínima de texto
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
  const trimmedValue = value?.trim() || '';
  if (trimmedValue.length < minLength) {
    return {
      isValid: false,
      error: `El campo ${fieldName} debe tener al menos ${minLength} caracteres`
    };
  }
  return { isValid: true };
}

/**
 * Valida longitud máxima de texto
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
  const trimmedValue = value?.trim() || '';
  if (trimmedValue.length > maxLength) {
    return {
      isValid: false,
      error: `El campo ${fieldName} no debe exceder ${maxLength} caracteres`
    };
  }
  return { isValid: true };
}

/**
 * Valida que solo contenga letras y espacios
 */
export function validateOnlyLetters(value: string, fieldName: string): ValidationResult {
  const trimmedValue = value?.trim() || '';
  // Permite letras (incluyendo acentos), espacios y algunos caracteres comunes
  const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  
  if (!lettersRegex.test(trimmedValue)) {
    return {
      isValid: false,
      error: `El campo ${fieldName} solo debe contener letras`
    };
  }
  return { isValid: true };
}

// ==================== VALIDACIÓN COMPLETA DEL FORMULARIO ====================

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida todo el formulario de contacto
 */
export function validateContactForm(data: ContactFormData): FormValidationResult {
  const errors: Record<string, string> = {};

  // Validar nombre (obligatorio, solo letras, min 2 caracteres)
  let result = validateRequired(data.nombre, 'nombre');
  if (!result.isValid) {
    errors.nombre = result.error!;
  } else {
    result = validateOnlyLetters(data.nombre, 'nombre');
    if (!result.isValid) {
      errors.nombre = result.error!;
    } else {
      result = validateMinLength(data.nombre, 2, 'nombre');
      if (!result.isValid) errors.nombre = result.error!;
    }
  }

  // Validar empresa (obligatorio, min 2 caracteres)
  result = validateRequired(data.empresa, 'empresa');
  if (!result.isValid) {
    errors.empresa = result.error!;
  } else {
    result = validateMinLength(data.empresa, 2, 'empresa');
    if (!result.isValid) errors.empresa = result.error!;
  }

  // Validar email
  result = validateEmail(data.email);
  if (!result.isValid) errors.email = result.error!;

  // Validar teléfono (9 dígitos exactos)
  result = validatePhone(data.telefono);
  if (!result.isValid) errors.telefono = result.error!;

  // Validar fecha de nacimiento
  result = validateDate(data.fechaNacimiento);
  if (!result.isValid) errors.fechaNacimiento = result.error!;

  // Validar asunto (obligatorio, min 5 caracteres)
  result = validateRequired(data.asunto, 'asunto');
  if (!result.isValid) {
    errors.asunto = result.error!;
  } else {
    result = validateMinLength(data.asunto, 5, 'asunto');
    if (!result.isValid) errors.asunto = result.error!;
  }

  // Validar mensaje (obligatorio, min 10 caracteres, max 1000)
  result = validateRequired(data.mensaje, 'mensaje');
  if (!result.isValid) {
    errors.mensaje = result.error!;
  } else {
    result = validateMinLength(data.mensaje, 10, 'mensaje');
    if (!result.isValid) {
      errors.mensaje = result.error!;
    } else {
      result = validateMaxLength(data.mensaje, 1000, 'mensaje');
      if (!result.isValid) errors.mensaje = result.error!;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// ==================== UTILIDADES ====================

/**
 * Formatea fecha de Date a dd/mm/yyyy
 */
export function formatDateToString(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Parsea fecha de dd/mm/yyyy a Date
 */
export function parseDateString(dateString: string): Date | null {
  const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const year = parseInt(match[3], 10);
  
  return new Date(year, month, day);
}

/**
 * Limpia y formatea número de teléfono
 */
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 9) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
  }
  return clean;
}
