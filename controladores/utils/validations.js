/**
 * Módulo completo de validaciones para formularios
 * @module validations
 */

// ============================================
// VALIDACIONES BÁSICAS
// ============================================

/**
 * Valida que un campo no esté vacío
 * 
 * @param {string} value - Valor a validar
 * @param {Object} options - Opciones
 * @param {boolean} [options.trim=true] - Si aplicar trim antes de validar
 * @returns {Object} {isValid: boolean, message: string}
 */
export function isRequired(value, options = {}) {
  const config = { trim: true, ...options };
  const val = config.trim ? String(value).trim() : String(value);
  
  return {
    isValid: val.length > 0,
    message: val.length > 0 ? '' : 'Este campo es obligatorio.'
  };
}

/**
 * Valida texto alfanumérico (letras y números)
 * 
 * @param {string} value - Valor a validar
 * @param {Object} options - Opciones
 * @param {number} [options.minLength] - Longitud mínima
 * @param {number} [options.maxLength] - Longitud máxima
 * @param {string} [options.allowedChars=''] - Caracteres adicionales permitidos (ej: '._-')
 * @param {boolean} [options.allowSpaces=false] - Permitir espacios
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isAlphanumeric('user123', { minLength: 3, maxLength: 20, allowedChars: '._-' });
 */
export function isAlphanumeric(value, options = {}) {
  const config = {
    minLength: null,
    maxLength: null,
    allowedChars: '',
    allowSpaces: false,
    ...options
  };

  const val = String(value);
  
  // Validar longitud
  if (config.minLength !== null && val.length < config.minLength) {
    return {
      isValid: false,
      message: `Debe tener al menos ${config.minLength} caracteres.`
    };
  }
  
  if (config.maxLength !== null && val.length > config.maxLength) {
    return {
      isValid: false,
      message: `No debe exceder ${config.maxLength} caracteres.`
    };
  }

  // Construir regex
  const escapedChars = config.allowedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const spaceChar = config.allowSpaces ? '\\s' : '';
  const regex = new RegExp(`^[a-zA-Z0-9${escapedChars}${spaceChar}]+$`);

  const isValid = regex.test(val);
  
  return {
    isValid,
    message: isValid ? '' : `Solo se permiten letras, números${config.allowedChars ? ' y ' + config.allowedChars : ''}${config.allowSpaces ? ' y espacios' : ''}.`
  };
}

/**
 * Valida solo texto (letras)
 * 
 * @param {string} value - Valor a validar
 * @param {Object} options - Opciones
 * @param {number} [options.minLength] - Longitud mínima
 * @param {number} [options.maxLength] - Longitud máxima
 * @param {boolean} [options.allowSpaces=true] - Permitir espacios
 * @param {boolean} [options.allowAccents=true] - Permitir acentos y ñ
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isText('Juan Pérez', { minLength: 2, maxLength: 100 });
 */
export function isText(value, options = {}) {
  const config = {
    minLength: null,
    maxLength: null,
    allowSpaces: true,
    allowAccents: true,
    ...options
  };

  const val = String(value);
  
  // Validar longitud
  if (config.minLength !== null && val.length < config.minLength) {
    return {
      isValid: false,
      message: `Debe tener al menos ${config.minLength} caracteres.`
    };
  }
  
  if (config.maxLength !== null && val.length > config.maxLength) {
    return {
      isValid: false,
      message: `No debe exceder ${config.maxLength} caracteres.`
    };
  }

  // Construir regex
  const accentChars = config.allowAccents ? 'áéíóúÁÉÍÓÚñÑ' : '';
  const spaceChar = config.allowSpaces ? '\\s' : '';
  const regex = new RegExp(`^[a-zA-Z${accentChars}${spaceChar}]+$`);

  const isValid = regex.test(val);
  
  return {
    isValid,
    message: isValid ? '' : 'Solo se permiten letras' + (config.allowSpaces ? ' y espacios' : '') + '.'
  };
}

/**
 * Valida números enteros
 * 
 * @param {string|number} value - Valor a validar
 * @param {Object} options - Opciones
 * @param {number} [options.min] - Valor mínimo
 * @param {number} [options.max] - Valor máximo
 * @param {boolean} [options.allowNegative=false] - Permitir números negativos
 * @returns {Object} {isValid: boolean, message: string, value: number|null}
 * 
 * @example
 * isInteger('25', { min: 1, max: 100 });
 */
export function isInteger(value, options = {}) {
  const config = {
    min: null,
    max: null,
    allowNegative: false,
    ...options
  };

  const val = String(value).trim();
  
  // Validar formato
  const regex = config.allowNegative ? /^-?\d+$/ : /^\d+$/;
  
  if (!regex.test(val)) {
    return {
      isValid: false,
      message: `Debe ser un número entero${config.allowNegative ? '' : ' positivo'}.`,
      value: null
    };
  }

  const numValue = parseInt(val, 10);

  // Validar rango
  if (config.min !== null && numValue < config.min) {
    return {
      isValid: false,
      message: `El valor mínimo es ${config.min}.`,
      value: numValue
    };
  }

  if (config.max !== null && numValue > config.max) {
    return {
      isValid: false,
      message: `El valor máximo es ${config.max}.`,
      value: numValue
    };
  }

  return {
    isValid: true,
    message: '',
    value: numValue
  };
}

/**
 * Valida números decimales
 * 
 * @param {string|number} value - Valor a validar
 * @param {Object} options - Opciones
 * @param {number} [options.min] - Valor mínimo
 * @param {number} [options.max] - Valor máximo
 * @param {number} [options.decimals] - Cantidad máxima de decimales
 * @param {boolean} [options.allowNegative=false] - Permitir números negativos
 * @returns {Object} {isValid: boolean, message: string, value: number|null}
 * 
 * @example
 * isDecimal('9.75', { min: 0, max: 10, decimals: 2 });
 */
export function isDecimal(value, options = {}) {
  const config = {
    min: null,
    max: null,
    decimals: null,
    allowNegative: false,
    ...options
  };

  const val = String(value).trim();
  
  // Validar formato básico
  const regex = config.allowNegative 
    ? /^-?\d+(\.\d+)?$/ 
    : /^\d+(\.\d+)?$/;
  
  if (!regex.test(val)) {
    return {
      isValid: false,
      message: `Debe ser un número decimal${config.allowNegative ? '' : ' positivo'}.`,
      value: null
    };
  }

  const numValue = parseFloat(val);

  // Validar cantidad de decimales
  if (config.decimals !== null) {
    const parts = val.split('.');
    if (parts.length === 2 && parts[1].length > config.decimals) {
      return {
        isValid: false,
        message: `Máximo ${config.decimals} decimales permitidos.`,
        value: numValue
      };
    }
  }

  // Validar rango
  if (config.min !== null && numValue < config.min) {
    return {
      isValid: false,
      message: `El valor mínimo es ${config.min}.`,
      value: numValue
    };
  }

  if (config.max !== null && numValue > config.max) {
    return {
      isValid: false,
      message: `El valor máximo es ${config.max}.`,
      value: numValue
    };
  }

  return {
    isValid: true,
    message: '',
    value: numValue
  };
}

/**
 * Valida formato de fecha
 * 
 * @param {string} value - Valor a validar (formato YYYY-MM-DD o DD/MM/YYYY)
 * @param {Object} options - Opciones
 * @param {string} [options.format='YYYY-MM-DD'] - Formato esperado ('YYYY-MM-DD' o 'DD/MM/YYYY')
 * @param {Date|string} [options.minDate] - Fecha mínima permitida
 * @param {Date|string} [options.maxDate] - Fecha máxima permitida
 * @param {boolean} [options.allowFuture=true] - Permitir fechas futuras
 * @param {boolean} [options.allowPast=true] - Permitir fechas pasadas
 * @returns {Object} {isValid: boolean, message: string, date: Date|null}
 * 
 * @example
 * isDate('2024-12-31', { minDate: '2024-01-01', maxDate: '2024-12-31' });
 */
export function isDate(value, options = {}) {
  const config = {
    format: 'YYYY-MM-DD',
    minDate: null,
    maxDate: null,
    allowFuture: true,
    allowPast: true,
    ...options
  };

  const val = String(value).trim();
  let date;

  // Parsear según formato
  if (config.format === 'YYYY-MM-DD') {
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = val.match(regex);
    
    if (!match) {
      return {
        isValid: false,
        message: 'Formato de fecha inválido. Use YYYY-MM-DD.',
        date: null
      };
    }

    date = new Date(match[1], match[2] - 1, match[3]);
  } else if (config.format === 'DD/MM/YYYY') {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = val.match(regex);
    
    if (!match) {
      return {
        isValid: false,
        message: 'Formato de fecha inválido. Use DD/MM/YYYY.',
        date: null
      };
    }

    date = new Date(match[3], match[2] - 1, match[1]);
  } else {
    return {
      isValid: false,
      message: 'Formato no soportado.',
      date: null
    };
  }

  // Validar que la fecha sea válida
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      message: 'Fecha inválida.',
      date: null
    };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  // Validar futuro/pasado
  if (!config.allowFuture && date > now) {
    return {
      isValid: false,
      message: 'No se permiten fechas futuras.',
      date
    };
  }

  if (!config.allowPast && date < now) {
    return {
      isValid: false,
      message: 'No se permiten fechas pasadas.',
      date
    };
  }

  // Validar rangos
  if (config.minDate) {
    const minDate = new Date(config.minDate);
    minDate.setHours(0, 0, 0, 0);
    
    if (date < minDate) {
      return {
        isValid: false,
        message: `La fecha debe ser posterior a ${config.minDate}.`,
        date
      };
    }
  }

  if (config.maxDate) {
    const maxDate = new Date(config.maxDate);
    maxDate.setHours(0, 0, 0, 0);
    
    if (date > maxDate) {
      return {
        isValid: false,
        message: `La fecha debe ser anterior a ${config.maxDate}.`,
        date
      };
    }
  }

  return {
    isValid: true,
    message: '',
    date
  };
}

/**
 * Valida valores booleanos
 * 
 * @param {any} value - Valor a validar
 * @param {Object} options - Opciones
 * @param {Array} [options.trueValues=['true','1','yes','si']] - Valores considerados verdaderos
 * @param {Array} [options.falseValues=['false','0','no']] - Valores considerados falsos
 * @returns {Object} {isValid: boolean, message: string, value: boolean|null}
 * 
 * @example
 * isBoolean('si'); // returns {isValid: true, message: '', value: true}
 */
export function isBoolean(value, options = {}) {
  const config = {
    trueValues: ['true', '1', 'yes', 'si'],
    falseValues: ['false', '0', 'no'],
    ...options
  };

  if (typeof value === 'boolean') {
    return {
      isValid: true,
      message: '',
      value
    };
  }

  const val = String(value).toLowerCase().trim();

  if (config.trueValues.includes(val)) {
    return {
      isValid: true,
      message: '',
      value: true
    };
  }

  if (config.falseValues.includes(val)) {
    return {
      isValid: true,
      message: '',
      value: false
    };
  }

  return {
    isValid: false,
    message: 'Valor booleano inválido.',
    value: null
  };
}

/**
 * Valida longitud de cadena
 * 
 * @param {string} value - Valor a validar
 * @param {Object} options - Opciones
 * @param {number} [options.minLength] - Longitud mínima
 * @param {number} [options.maxLength] - Longitud máxima
 * @param {number} [options.exactLength] - Longitud exacta
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isLength('texto', { minLength: 2, maxLength: 50 });
 */
export function isLength(value, options = {}) {
  const config = {
    minLength: null,
    maxLength: null,
    exactLength: null,
    ...options
  };

  const val = String(value);
  const length = val.length;

  if (config.exactLength !== null) {
    const isValid = length === config.exactLength;
    return {
      isValid,
      message: isValid ? '' : `Debe tener exactamente ${config.exactLength} caracteres.`
    };
  }

  if (config.minLength !== null && length < config.minLength) {
    return {
      isValid: false,
      message: `Debe tener al menos ${config.minLength} caracteres.`
    };
  }

  if (config.maxLength !== null && length > config.maxLength) {
    return {
      isValid: false,
      message: `No debe exceder ${config.maxLength} caracteres.`
    };
  }

  return {
    isValid: true,
    message: ''
  };
}

// ============================================
// VALIDACIONES ESPECIALES (FORMATO)
// ============================================

/**
 * Valida formato personalizado o predefinido
 * 
 * @param {string} value - Valor a validar
 * @param {Object} options - Opciones
 * @param {string} [options.type='custom'] - Tipo: 'custom', 'email', 'phone', 'dui', 'nit', 'url', 'username', 'password'
 * @param {RegExp|string} [options.pattern] - Patrón regex personalizado (requerido si type='custom')
 * @param {string} [options.message] - Mensaje de error personalizado
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * // Email predefinido
 * isFormat('user@example.com', { type: 'email' });
 * 
 * @example
 * // Patrón personalizado
 * isFormat('ABC-123', { type: 'custom', pattern: /^[A-Z]{3}-\d{3}$/, message: 'Formato: ABC-123' });
 */
export function isFormat(value, options = {}) {
  const config = {
    type: 'custom',
    pattern: null,
    message: 'Formato inválido.',
    ...options
  };

  const val = String(value).trim();
  let regex;
  let defaultMessage;

  // Seleccionar patrón según tipo
  switch (config.type) {
    case 'email':
      regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      defaultMessage = 'Formato de correo electrónico inválido.';
      break;

    case 'phone':
      // Formato: +503 1234-5678 o variaciones
      regex = /^[+]?[\d\s()-]{10,}$/;
      defaultMessage = 'Formato de teléfono inválido.';
      break;

    case 'dui':
      // Formato DUI salvadoreño: 12345678-9
      regex = /^\d{8}-\d$/;
      defaultMessage = 'Formato de DUI inválido. Use: 12345678-9';
      break;

    case 'nit':
      // Formato NIT salvadoreño: 1234-567890-123-4
      regex = /^\d{4}-\d{6}-\d{3}-\d$/;
      defaultMessage = 'Formato de NIT inválido. Use: 1234-567890-123-4';
      break;

    case 'url':
      regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      defaultMessage = 'Formato de URL inválido.';
      break;

    case 'username':
      // Usuario: alfanumérico, guiones, puntos, guiones bajos (3-20 chars)
      regex = /^[a-zA-Z0-9._-]{3,20}$/;
      defaultMessage = 'Nombre de usuario inválido. 3-20 caracteres alfanuméricos, puntos, guiones.';
      break;

    case 'password':
      // Contraseña fuerte: min 8 chars, mayúscula, minúscula, número
      regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      defaultMessage = 'Contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.';
      break;

    case 'custom':
      if (!config.pattern) {
        return {
          isValid: false,
          message: 'Patrón personalizado no proporcionado.'
        };
      }
      regex = typeof config.pattern === 'string' ? new RegExp(config.pattern) : config.pattern;
      defaultMessage = config.message;
      break;

    default:
      return {
        isValid: false,
        message: 'Tipo de formato no soportado.'
      };
  }

  const isValid = regex.test(val);

  return {
    isValid,
    message: isValid ? '' : (config.message || defaultMessage)
  };
}

/**
 * Valida email con validación adicional
 * 
 * @param {string} value - Email a validar
 * @param {Object} options - Opciones
 * @param {Array} [options.allowedDomains] - Dominios permitidos (ej: ['gmail.com', 'hotmail.com'])
 * @param {Array} [options.blockedDomains] - Dominios bloqueados
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isEmail('user@gmail.com', { allowedDomains: ['gmail.com', 'outlook.com'] });
 */
export function isEmail(value, options = {}) {
  const config = {
    allowedDomains: null,
    blockedDomains: null,
    ...options
  };

  const baseValidation = isFormat(value, { type: 'email' });
  
  if (!baseValidation.isValid) {
    return baseValidation;
  }

  const val = String(value).trim().toLowerCase();
  const domain = val.split('@')[1];

  // Validar dominios permitidos
  if (config.allowedDomains && Array.isArray(config.allowedDomains)) {
    if (!config.allowedDomains.includes(domain)) {
      return {
        isValid: false,
        message: `Solo se permiten correos de: ${config.allowedDomains.join(', ')}.`
      };
    }
  }

  // Validar dominios bloqueados
  if (config.blockedDomains && Array.isArray(config.blockedDomains)) {
    if (config.blockedDomains.includes(domain)) {
      return {
        isValid: false,
        message: `No se permiten correos de: ${config.blockedDomains.join(', ')}.`
      };
    }
  }

  return {
    isValid: true,
    message: ''
  };
}

/**
 * Valida teléfono con formato personalizado por país
 * 
 * @param {string} value - Teléfono a validar
 * @param {Object} options - Opciones
 * @param {string} [options.country='SV'] - País ('SV', 'US', 'MX', 'GT', etc.)
 * @param {boolean} [options.requireCountryCode=false] - Requerir código de país
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isPhone('7890-1234', { country: 'SV' });
 * isPhone('+503 7890-1234', { country: 'SV', requireCountryCode: true });
 */
export function isPhone(value, options = {}) {
  const config = {
    country: 'SV',
    requireCountryCode: false,
    ...options
  };

  const val = String(value).trim();
  let regex;
  let message;

  switch (config.country) {
    case 'SV': // El Salvador
      if (config.requireCountryCode) {
        regex = /^(\+503\s?)?[267]\d{3}-?\d{4}$/;
        message = 'Formato: +503 7890-1234 o 7890-1234';
      } else {
        regex = /^[267]\d{3}-?\d{4}$/;
        message = 'Formato: 7890-1234';
      }
      break;

    case 'US': // Estados Unidos
      regex = /^(\+1\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
      message = 'Formato: (555) 123-4567 o +1 555-123-4567';
      break;

    case 'MX': // México
      regex = /^(\+52\s?)?[1-9]\d{9}$/;
      message = 'Formato: +52 1234567890';
      break;

    default:
      regex = /^[+]?[\d\s()-]{10,}$/;
      message = 'Formato de teléfono inválido.';
  }

  const isValid = regex.test(val);

  return {
    isValid,
    message: isValid ? '' : message
  };
}

/**
 * Compara dos valores para igualdad
 * 
 * @param {any} value1 - Primer valor
 * @param {any} value2 - Segundo valor
 * @param {Object} options - Opciones
 * @param {boolean} [options.caseSensitive=true] - Sensible a mayúsculas (para strings)
 * @param {string} [options.message='Los valores no coinciden.'] - Mensaje de error
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isEqual('Password123', 'Password123', { message: 'Las contraseñas no coinciden.' });
 */
export function isEqual(value1, value2, options = {}) {
  const config = {
    caseSensitive: true,
    message: 'Los valores no coinciden.',
    ...options
  };

  let isValid;

  if (typeof value1 === 'string' && typeof value2 === 'string') {
    if (config.caseSensitive) {
      isValid = value1 === value2;
    } else {
      isValid = value1.toLowerCase() === value2.toLowerCase();
    }
  } else {
    isValid = value1 === value2;
  }

  return {
    isValid,
    message: isValid ? '' : config.message
  };
}

/**
 * Compara dos fechas
 * 
 * @param {string|Date} date1 - Primera fecha
 * @param {string|Date} date2 - Segunda fecha
 * @param {Object} options - Opciones
 * @param {string} [options.comparison='before'] - Tipo: 'before', 'after', 'equal', 'beforeOrEqual', 'afterOrEqual'
 * @param {string} [options.message] - Mensaje de error personalizado
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isBefore('2024-01-01', '2024-12-31'); // fecha1 debe ser antes que fecha2
 * isAfter('2024-12-31', '2024-01-01'); // fecha1 debe ser después que fecha2
 */
export function compareDates(date1, date2, options = {}) {
  const config = {
    comparison: 'before',
    message: null,
    ...options
  };

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return {
      isValid: false,
      message: 'Una o ambas fechas son inválidas.'
    };
  }

  let isValid;
  let defaultMessage;

  switch (config.comparison) {
    case 'before':
      isValid = d1 < d2;
      defaultMessage = 'La primera fecha debe ser anterior a la segunda.';
      break;

    case 'after':
      isValid = d1 > d2;
      defaultMessage = 'La primera fecha debe ser posterior a la segunda.';
      break;

    case 'equal':
      isValid = d1.getTime() === d2.getTime();
      defaultMessage = 'Las fechas deben ser iguales.';
      break;

    case 'beforeOrEqual':
      isValid = d1 <= d2;
      defaultMessage = 'La primera fecha debe ser anterior o igual a la segunda.';
      break;

    case 'afterOrEqual':
      isValid = d1 >= d2;
      defaultMessage = 'La primera fecha debe ser posterior o igual a la segunda.';
      break;

    default:
      return {
        isValid: false,
        message: 'Tipo de comparación no soportado.'
      };
  }

  return {
    isValid,
    message: isValid ? '' : (config.message || defaultMessage)
  };
}

// Alias para compatibilidad
export const isBefore = (date1, date2, options = {}) => compareDates(date1, date2, { ...options, comparison: 'before' });
export const isAfter = (date1, date2, options = {}) => compareDates(date1, date2, { ...options, comparison: 'after' });

/**
 * Valida un ENUM contra valores permitidos
 * 
 * @param {string} value - Valor a validar
 * @param {Array} allowedValues - Valores permitidos
 * @param {Object} options - Opciones
 * @param {boolean} [options.caseSensitive=false] - Sensible a mayúsculas
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isEnum('M', ['M', 'F', 'O']); // Para validar género
 */
export function isEnum(value, allowedValues, options = {}) {
  const config = {
    caseSensitive: false,
    ...options
  };

  if (!Array.isArray(allowedValues) || allowedValues.length === 0) {
    return {
      isValid: false,
      message: 'Valores permitidos no proporcionados.'
    };
  }

  const val = String(value);
  let isValid;

  if (config.caseSensitive) {
    isValid = allowedValues.includes(val);
  } else {
    isValid = allowedValues.map(v => String(v).toLowerCase()).includes(val.toLowerCase());
  }

  return {
    isValid,
    message: isValid ? '' : `Valores permitidos: ${allowedValues.join(', ')}.`
  };
}

/**
 * Valida calificaciones/notas según sistema escolar
 * 
 * @param {string|number} value - Nota a validar
 * @param {Object} options - Opciones
 * @param {number} [options.min=0] - Nota mínima
 * @param {number} [options.max=10] - Nota máxima
 * @param {number} [options.decimals=2] - Decimales permitidos
 * @returns {Object} {isValid: boolean, message: string, value: number|null}
 * 
 * @example
 * isGrade('8.75', { min: 0, max: 10, decimals: 2 });
 */
export function isGrade(value, options = {}) {
  const config = {
    min: 0,
    max: 10,
    decimals: 2,
    ...options
  };

  return isDecimal(value, {
    min: config.min,
    max: config.max,
    decimals: config.decimals,
    allowNegative: false
  });
}

/**
 * Valida UUID (v4)
 * 
 * @param {string} value - UUID a validar
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isUUID('550e8400-e29b-41d4-a716-446655440000');
 */
export function isUUID(value) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isValid = regex.test(String(value).trim());

  return {
    isValid,
    message: isValid ? '' : 'UUID inválido.'
  };
}

/**
 * Ejecuta múltiples validaciones sobre un valor
 * 
 * @param {any} value - Valor a validar
 * @param {Array<Function>} validators - Array de funciones validadoras
 * @returns {Object} {isValid: boolean, messages: Array<string>}
 * 
 * @example
 * validateMultiple('user@test.com', [
 *   (v) => isRequired(v),
 *   (v) => isEmail(v),
 *   (v) => isLength(v, { maxLength: 100 })
 * ]);
 */
export function validateMultiple(value, validators) {
  const messages = [];
  let allValid = true;

  for (const validator of validators) {
    const result = validator(value);
    if (!result.isValid) {
      allValid = false;
      messages.push(result.message);
    }
  }

  return {
    isValid: allValid,
    messages
  };
}

/**
 * Valida contraseña con requisitos de seguridad
 * 
 * @param {string} value - Contraseña a validar
 * @param {Object} options - Opciones
 * @param {number} [options.minLength=8] - Longitud mínima
 * @param {boolean} [options.requireUppercase=true] - Requerir mayúsculas
 * @param {boolean} [options.requireLowercase=true] - Requerir minúsculas
 * @param {boolean} [options.requireNumber=true] - Requerir números
 * @param {boolean} [options.requireSpecial=false] - Requerir caracteres especiales
 * @returns {Object} {isValid: boolean, message: string}
 * 
 * @example
 * isPassword('MyPass123'); // válido
 * isPassword('abc123'); // inválido (falta mayúscula)
 */
export function isPassword(value, options = {}) {
  const config = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: false,
    ...options
  };

  const val = String(value);
  const errors = [];

  // Validar longitud mínima
  if (val.length < config.minLength) {
    errors.push(`mínimo ${config.minLength} caracteres`);
  }

  // Validar mayúscula
  if (config.requireUppercase && !/[A-Z]/.test(val)) {
    errors.push('una mayúscula');
  }

  // Validar minúscula
  if (config.requireLowercase && !/[a-z]/.test(val)) {
    errors.push('una minúscula');
  }

  // Validar número
  if (config.requireNumber && !/\d/.test(val)) {
    errors.push('un número');
  }

  // Validar caracter especial
  if (config.requireSpecial && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) {
    errors.push('un caracter especial');
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    message: isValid ? '' : `Contraseña debe tener ${errors.join(', ')}.`
  };
}

// ============================================
// VALIDACIONES DE ARCHIVOS
// ============================================

/**
 * Valida un archivo (imagen o documento)
 * 
 * @param {File} file - Archivo a validar
 * @param {Object} options - Opciones
 * @param {Array<string>} [options.allowedTypes] - Tipos MIME permitidos
 * @param {Array<string>} [options.allowedExtensions] - Extensiones permitidas (ej: ['jpg', 'png'])
 * @param {number} [options.maxSizeMB=10] - Tamaño máximo en MB
 * @param {number} [options.minSizeMB] - Tamaño mínimo en MB
 * @param {boolean} [options.required=false] - Si el archivo es requerido
 * @returns {Object} {isValid: boolean, message: string, file: File|null}
 * 
 * @example
 * isFile(fileInput.files[0], { 
 *   allowedExtensions: ['jpg', 'png'], 
 *   maxSizeMB: 5 
 * });
 */
export function isFile(file, options = {}) {
  const config = {
    allowedTypes: null,
    allowedExtensions: null,
    maxSizeMB: 10,
    minSizeMB: null,
    required: false,
    ...options
  };

  // Si no es requerido y no hay archivo, es válido
  if (!config.required && !file) {
    return {
      isValid: true,
      message: '',
      file: null
    };
  }

  // Si es requerido y no hay archivo
  if (config.required && !file) {
    return {
      isValid: false,
      message: 'El archivo es requerido.',
      file: null
    };
  }

  // Si no es un objeto File válido
  if (!(file instanceof File)) {
    return {
      isValid: false,
      message: 'Archivo inválido.',
      file: null
    };
  }

  // Validar tamaño
  const fileSizeMB = file.size / (1024 * 1024);

  if (config.minSizeMB !== null && fileSizeMB < config.minSizeMB) {
    return {
      isValid: false,
      message: `El archivo debe pesar al menos ${config.minSizeMB} MB.`,
      file: null
    };
  }

  if (config.maxSizeMB !== null && fileSizeMB > config.maxSizeMB) {
    return {
      isValid: false,
      message: `El archivo no debe superar los ${config.maxSizeMB} MB.`,
      file: null
    };
  }

  // Obtener extensión del archivo
  const fileName = file.name;
  const extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();

  // Validar extensión
  if (config.allowedExtensions && config.allowedExtensions.length > 0) {
    const normalizedExtensions = config.allowedExtensions.map(ext => ext.toLowerCase());
    if (!normalizedExtensions.includes(extension)) {
      return {
        isValid: false,
        message: `Solo se permiten archivos: ${config.allowedExtensions.join(', ')}.`,
        file: null
      };
    }
  }

  // Validar tipo MIME
  if (config.allowedTypes && config.allowedTypes.length > 0) {
    if (!config.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: `Tipo de archivo no permitido.`,
        file: null
      };
    }
  }

  return {
    isValid: true,
    message: '',
    file: file
  };
}

/**
 * Valida una imagen
 * 
 * @param {File} file - Archivo de imagen a validar
 * @param {Object} options - Opciones
 * @param {number} [options.maxSizeMB=10] - Tamaño máximo en MB
 * @param {boolean} [options.required=false] - Si la imagen es requerida
 * @returns {Object} {isValid: boolean, message: string, file: File|null}
 * 
 * @example
 * isImage(fileInput.files[0], { maxSizeMB: 5, required: true });
 */
export function isImage(file, options = {}) {
  const imageConfig = {
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
    maxSizeMB: 10,
    required: false,
    ...options
  };

  return isFile(file, imageConfig);
}

/**
 * Valida un documento
 * 
 * @param {File} file - Archivo de documento a validar
 * @param {Object} options - Opciones
 * @param {number} [options.maxSizeMB=10] - Tamaño máximo en MB
 * @param {boolean} [options.required=false] - Si el documento es requerido
 * @returns {Object} {isValid: boolean, message: string, file: File|null}
 * 
 * @example
 * isDocument(fileInput.files[0], { maxSizeMB: 20, required: true });
 */
export function isDocument(file, options = {}) {
  const documentConfig = {
    allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt'],
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'text/plain'
    ],
    maxSizeMB: 10,
    required: false,
    ...options
  };

  return isFile(file, documentConfig);
}