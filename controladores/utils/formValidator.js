/**
 * Módulo para validación declarativa de formularios
 * @module formValidator
 */

import {
  isRequired,
  isAlphanumeric,
  isText,
  isInteger,
  isDecimal,
  isDate,
  isBoolean,
  isLength,
  isFormat,
  isEmail,
  isPhone,
  isEqual,
  compareDates,
  isEnum,
  isGrade,
  isUUID,
  isPassword,
  isFile,
  isImage,
  isDocument
} from './validations.js';

/**
 * Clase para validar formularios de manera declarativa
 */
export class FormValidator {
  /**
   * @param {Object} config - Configuración del validador
   * @param {Object} config.fields - Objeto con configuración de campos
   * @param {boolean} [config.validateOnBlur=true] - Validar al perder el foco
   * @param {boolean} [config.validateOnInput=true] - Validar mientras se escribe
   * @param {boolean} [config.showErrorsOnSubmit=true] - Mostrar errores al enviar
   * @param {boolean} [config.focusFirstError=true] - Enfocar primer campo con error
   * 
   * @example
   * const validator = new FormValidator({
   *   fields: {
   *     username: {
   *       input: '#username',
   *       error: '#usernameError',
   *       rules: [
   *         { type: 'required' },
   *         { type: 'alphanumeric', minLength: 3, maxLength: 100, allowedChars: '._-' }
   *       ]
   *     }
   *   }
   * });
   */
  constructor(config = {}) {
    this.config = {
      validateOnBlur: true,
      validateOnInput: true,
      showErrorsOnSubmit: true,
      focusFirstError: true,
      ...config
    };

    this.fields = {};
    this.errors = {};
    this.customValidators = {};

    // Inicializar campos
    if (config.fields) {
      this.initFields(config.fields);
    }
  }

  /**
   * Inicializa los campos del formulario
   * @private
   */
  initFields(fieldsConfig) {
    Object.keys(fieldsConfig).forEach(fieldName => {
      const fieldConfig = fieldsConfig[fieldName];

      // Obtener elementos
      const input = typeof fieldConfig.input === 'string'
        ? document.querySelector(fieldConfig.input)
        : fieldConfig.input;

      const errorElement = fieldConfig.error
        ? (typeof fieldConfig.error === 'string'
          ? document.querySelector(fieldConfig.error)
          : fieldConfig.error)
        : null;

      if (!input) {
        console.warn(`Campo "${fieldName}" no encontrado`);
        return;
      }

      // Guardar configuración del campo
      this.fields[fieldName] = {
        input,
        errorElement,
        rules: fieldConfig.rules || [],
        label: fieldConfig.label || fieldName,
        validateOnInput: fieldConfig.validateOnInput !== undefined
          ? fieldConfig.validateOnInput
          : this.config.validateOnInput,
        validateOnBlur: fieldConfig.validateOnBlur !== undefined
          ? fieldConfig.validateOnBlur
          : this.config.validateOnBlur
      };

      // Agregar event listeners
      if (this.fields[fieldName].validateOnInput) {
        input.addEventListener('input', () => {
          this.validateField(fieldName, false); // false = no mostrar si está vacío
        });
      }

      if (this.fields[fieldName].validateOnBlur) {
        input.addEventListener('blur', () => {
          this.validateField(fieldName, true); // true = siempre mostrar errores
        });
      }
    });
  }

  /**
   * Valida un campo específico
   * @param {string} fieldName - Nombre del campo
   * @param {boolean} [showErrors=true] - Si mostrar errores
   * @returns {boolean} - true si es válido
   */
  validateField(fieldName, showErrors = true) {
    const field = this.fields[fieldName];
    if (!field) return true;

    const value = this.getFieldValue(field.input);
    const rules = field.rules;

    // Limpiar error anterior
    this.errors[fieldName] = null;

    // Si está vacío y no es requerido, es válido
    const hasRequiredRule = rules.some(rule => rule.type === 'required');
    if (!value && !hasRequiredRule) {
      this.showError(fieldName, '', showErrors);
      return true;
    }

    // Aplicar reglas en orden
    for (const rule of rules) {
      const result = this.applyRule(value, rule, fieldName, field.input);

      if (!result.isValid) {
        this.errors[fieldName] = result.message;
        this.showError(fieldName, result.message, showErrors);
        return false;
      }
    }

    // Todas las reglas pasaron
    this.showError(fieldName, '', showErrors);
    return true;
  }

  /**
   * Aplica una regla de validación
   * @private
   */
  applyRule(value, rule, fieldName, input) {
    const { type, ...options } = rule;

    switch (type) {
      case 'required':
        return isRequired(value, options);

      case 'alphanumeric':
        return isAlphanumeric(value, options);

      case 'text':
        return isText(value, options);

      case 'integer':
        return isInteger(value, options);

      case 'decimal':
        return isDecimal(value, options);

      case 'date':
        return isDate(value, options);

      case 'boolean':
        return isBoolean(value, options);

      case 'length':
        return isLength(value, options);

      case 'format':
        return isFormat(value, options);

      case 'email':
        return isEmail(value, options);

      case 'phone':
        return isPhone(value, options);

      case 'enum':
        return isEnum(value, rule.allowedValues, options);

      case 'grade':
        return isGrade(value, options);

      case 'uuid':
        return isUUID(value);

      case 'password':
        return isPassword(value, options);

      case 'equals':
        // Comparar con otro campo
        const otherField = this.fields[rule.field];
        if (!otherField) {
          return { isValid: false, message: `Campo "${rule.field}" no encontrado.` };
        }
        const otherValue = this.getFieldValue(otherField.input);
        return isEqual(value, otherValue, options);

      case 'compareDate':
        // Comparar fechas con otro campo
        const dateField = this.fields[rule.field];
        if (!dateField) {
          return { isValid: false, message: `Campo "${rule.field}" no encontrado.` };
        }
        const dateValue = this.getFieldValue(dateField.input);
        return compareDates(value, dateValue, options);

      case 'custom':
        // Validador personalizado
        if (rule.validator && typeof rule.validator === 'function') {
          return rule.validator(value, this.getAllValues());
        }
        if (this.customValidators[rule.name]) {
          return this.customValidators[rule.name](value, this.getAllValues());
        }
        return { isValid: false, message: 'Validador personalizado no encontrado.' };

      case 'file':
        // Validación de archivos genéricos
        const file = input.files && input.files[0];
        return isFile(file, rule);

      case 'image':
        // Validación de imágenes
        const imageFile = input.files && input.files[0];
        return isImage(imageFile, { 
          maxSizeMB: rule.maxSizeMB || 10, 
          required: rule.required || false 
        });

      case 'document':
        // Validación de documentos
        const docFile = input.files && input.files[0];
        return isDocument(docFile, { 
          maxSizeMB: rule.maxSizeMB || 10, 
          required: rule.required || false 
        });

      default:
        console.warn(`Tipo de validación "${type}" no soportado`);
        return { isValid: true, message: '' };
    }
  }

  /**
   * Obtiene el valor de un campo
   * @private
   */
  getFieldValue(input) {
    if (input.type === 'checkbox') {
      return input.checked;
    } else if (input.type === 'radio') {
      const selected = document.querySelector(`input[name="${input.name}"]:checked`);
      return selected ? selected.value : '';
    } else if (input.type === 'file') {
      return input.files && input.files[0] ? input.files[0] : null;
    } else {
      return input.value;
    }
  }

  /**
   * Muestra u oculta el mensaje de error
   * @private
   */
  showError(fieldName, message, show = true) {
    const field = this.fields[fieldName];
    if (!field.errorElement || !show) return;

    field.errorElement.textContent = message;

    // Agregar clases CSS opcionales
    if (message) {
      field.input.classList.add('error', 'invalid');
      field.errorElement.classList.add('error-message', 'show');
    } else {
      field.input.classList.remove('error', 'invalid');
      field.errorElement.classList.remove('error-message', 'show');
    }
  }

  /**
   * Valida todos los campos del formulario
   * @returns {boolean} - true si todos los campos son válidos
   */
  validateAll() {
    let isValid = true;
    const fieldNames = Object.keys(this.fields);

    fieldNames.forEach(fieldName => {
      const fieldValid = this.validateField(fieldName, this.config.showErrorsOnSubmit);
      if (!fieldValid) {
        isValid = false;
      }
    });

    // Enfocar primer campo con error
    if (!isValid && this.config.focusFirstError) {
      const firstErrorField = fieldNames.find(name => this.errors[name]);
      if (firstErrorField) {
        this.fields[firstErrorField].input.focus();
      }
    }

    return isValid;
  }

  /**
   * Obtiene todos los valores del formulario
   * @returns {Object} - Objeto con los valores de todos los campos
   */
  getAllValues() {
    const values = {};
    Object.keys(this.fields).forEach(fieldName => {
      values[fieldName] = this.getFieldValue(this.fields[fieldName].input);
    });
    return values;
  }

  /**
   * Obtiene los errores actuales
   * @returns {Object} - Objeto con los errores {fieldName: message}
   */
  getErrors() {
    return { ...this.errors };
  }

  /**
   * Limpia todos los errores
   */
  clearErrors() {
    Object.keys(this.fields).forEach(fieldName => {
      this.errors[fieldName] = null;
      this.showError(fieldName, '', true);
    });
  }

  /**
   * Reinicia el formulario
   */
  reset() {
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];
      if (field.input.type === 'checkbox' || field.input.type === 'radio') {
        field.input.checked = false;
      } else {
        field.input.value = '';
      }
    });
    this.clearErrors();
  }

  /**
   * Registra un validador personalizado
   * @param {string} name - Nombre del validador
   * @param {Function} validator - Función validadora
   */
  addCustomValidator(name, validator) {
    this.customValidators[name] = validator;
  }

  /**
   * Agrega un campo dinámicamente
   * @param {string} fieldName - Nombre del campo
   * @param {Object} config - Configuración del campo
   */
  addField(fieldName, config) {
    const fieldsConfig = { [fieldName]: config };
    this.initFields(fieldsConfig);
  }

  /**
   * Elimina un campo
   * @param {string} fieldName - Nombre del campo
   */
  removeField(fieldName) {
    delete this.fields[fieldName];
    delete this.errors[fieldName];
  }

  /**
   * Habilita/deshabilita validación en tiempo real
   * @param {boolean} enabled - Si habilitar
   */
  setRealtimeValidation(enabled) {
    this.config.validateOnInput = enabled;
    this.config.validateOnBlur = enabled;
  }
}

/**
 * Factory function para crear validador rápidamente
 * @param {Object} config - Configuración
 * @returns {FormValidator}
 * 
 * @example
 * const validator = createFormValidator({
 *   fields: { ... }
 * });
 */
export function createFormValidator(config) {
  return new FormValidator(config);
}

/**
 * Función auxiliar para crear reglas comunes rápidamente
 */
export const Rules = {
  /**
   * Campo requerido
   */
  required: (message = null) => ({
    type: 'required',
    ...(message && { message })
  }),

  /**
   * Usuario (username)
   */
  username: (minLength = 3, maxLength = 100) => ({
    type: 'alphanumeric',
    minLength,
    maxLength,
    allowedChars: '._-',
    allowSpaces: false
  }),

  /**
   * Nombre completo
   */
  fullName: (minLength = 2, maxLength = 120) => ({
    type: 'text',
    minLength,
    maxLength,
    allowSpaces: true,
    allowAccents: true
  }),

  /**
   * Email
   */
  email: (allowedDomains = null) => ({
    type: 'email',
    ...(allowedDomains && { allowedDomains })
  }),

  /**
   * Teléfono
   */
  phone: (country = 'SV', requireCountryCode = false) => ({
    type: 'phone',
    country,
    requireCountryCode
  }),

  /**
   * Contraseña
   */
  password: (options = {}) => ({
    type: 'password',
    ...options
  }),

  /**
   * Confirmación de contraseña
   */
  confirmPassword: (passwordField = 'password') => ({
    type: 'equals',
    field: passwordField,
    message: 'Las contraseñas no coinciden.'
  }),

  /**
   * Fecha
   */
  date: (options = {}) => ({
    type: 'date',
    format: 'YYYY-MM-DD',
    ...options
  }),

  /**
   * Fecha de nacimiento
   */
  birthDate: () => ({
    type: 'date',
    format: 'YYYY-MM-DD',
    allowFuture: false,
    maxDate: new Date()
  }),

  /**
   * Número entero
   */
  integer: (min = null, max = null) => ({
    type: 'integer',
    ...(min !== null && { min }),
    ...(max !== null && { max })
  }),

  /**
   * Número decimal
   */
  decimal: (min = null, max = null, decimals = 2) => ({
    type: 'decimal',
    ...(min !== null && { min }),
    ...(max !== null && { max }),
    decimals
  }),

  /**
   * Calificación
   */
  grade: (min = 0, max = 10, decimals = 2) => ({
    type: 'grade',
    min,
    max,
    decimals
  }),

  /**
   * Enum/Select
   */
  enum: (allowedValues) => ({
    type: 'enum',
    allowedValues
  }),

  /**
   * UUID
   */
  uuid: () => ({
    type: 'uuid'
  }),

  /**
   * Longitud
   */
  length: (minLength = null, maxLength = null) => ({
    type: 'length',
    ...(minLength !== null && { minLength }),
    ...(maxLength !== null && { maxLength })
  }),

  /**
   * Alfanumérico
   */
  alphanumeric: (minLength = null, maxLength = null, allowedChars = '') => ({
    type: 'alphanumeric',
    ...(minLength !== null && { minLength }),
    ...(maxLength !== null && { maxLength }),
    allowedChars
  }),

  /**
   * Texto solo letras
   */
  text: (minLength = null, maxLength = null) => ({
    type: 'text',
    ...(minLength !== null && { minLength }),
    ...(maxLength !== null && { maxLength }),
    allowSpaces: true,
    allowAccents: true
  }),

  /**
   * Formato personalizado
   */
  format: (formatType, pattern = null, message = null) => ({
    type: 'format',
    formatType,
    ...(pattern && { pattern }),
    ...(message && { message })
  }),

  /**
   * Comparación de fechas
   */
  dateComparison: (field, comparison = 'before', message = null) => ({
    type: 'compareDate',
    field,
    comparison,
    ...(message && { message })
  }),

  /**
   * Validador personalizado
   */
  custom: (validator, message = null) => ({
    type: 'custom',
    validator,
    ...(message && { message })
  }),

  /**
   * Validación de archivos genéricos
   */
  file: (options = {}) => ({
    type: 'file',
    allowedExtensions: null,
    allowedTypes: null,
    maxSizeMB: 10,
    minSizeMB: null,
    required: false,
    ...options
  }),

  /**
   * Validación de imágenes
   */
  image: (maxSizeMB = 10, required = false) => ({
    type: 'image',
    maxSizeMB,
    required
  }),

  /**
   * Validación de documentos
   */
  document: (maxSizeMB = 10, required = false) => ({
    type: 'document',
    maxSizeMB,
    required
  })
};