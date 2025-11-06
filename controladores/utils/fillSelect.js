/**
 * Módulo para llenar elementos <select> de forma dinámica
 * @module fillSelect
 */

/**
 * Llena un elemento select con opciones desde una respuesta de API
 * 
 * @param {HTMLSelectElement|string} select - Elemento select o su ID
 * @param {Array|Object} data - Datos de la API (puede ser array directo o objeto con propiedad 'content')
 * @param {Object} options - Opciones de configuración
 * @param {string} [options.valueKey='id'] - Propiedad del objeto que se usará como valor del option
 * @param {string} [options.textKey='nombre'] - Propiedad del objeto que se usará como texto visible
 * @param {string} [options.defaultOption='Seleccionar...'] - Texto de la opción por defecto
 * @param {boolean} [options.includeDefault=true] - Si incluir opción por defecto
 * @param {string} [options.defaultValue=''] - Valor de la opción por defecto
 * @param {Function} [options.textFormatter=null] - Función personalizada para formatear el texto (recibe el objeto completo)
 * @param {Function} [options.filter=null] - Función para filtrar elementos (recibe el objeto, retorna boolean)
 * @param {string} [options.selectedValue=null] - Valor que debe estar seleccionado por defecto
 * @param {boolean} [options.clearExisting=true] - Si limpiar las opciones existentes antes de llenar
 * @param {Object} [options.dataAttributes={}] - Objeto con atributos data-* adicionales {key: propertyName}
 * 
 * @returns {boolean} - true si se llenó correctamente, false si hubo error
 * 
 * @example
 * // Uso básico
 * fillSelect('rolSelect', rolesData);
 * 
 * @example
 * // Con todas las opciones
 * fillSelect('rolSelect', rolesData, {
 *   valueKey: 'id',
 *   textKey: 'nombre',
 *   defaultOption: 'Selecciona un rol',
 *   includeDefault: true,
 *   selectedValue: 'uuid-del-rol',
 *   textFormatter: (rol) => `${rol.nombre} (${rol.descripcion})`,
 *   filter: (rol) => rol.activo === true,
 *   dataAttributes: {
 *     description: 'descripcion',
 *     code: 'codigo'
 *   }
 * });
 */
export function fillSelect(select, data, options = {}) {
  try {
    // Configuración por defecto
    const config = {
      valueKey: 'id',
      textKey: 'nombre',
      defaultOption: 'Seleccionar...',
      includeDefault: true,
      defaultValue: '',
      textFormatter: null,
      filter: null,
      selectedValue: null,
      clearExisting: true,
      dataAttributes: {},
      ...options
    };

    // Obtener el elemento select
    const selectElement = typeof select === 'string' 
      ? document.getElementById(select) 
      : select;

    if (!selectElement) {
      console.error('Elemento select no encontrado');
      return false;
    }

    // Limpiar opciones existentes si está configurado
    if (config.clearExisting) {
      selectElement.innerHTML = '';
    }

    // Agregar opción por defecto
    if (config.includeDefault) {
      const defaultOption = document.createElement('option');
      defaultOption.value = config.defaultValue;
      defaultOption.textContent = config.defaultOption;
      selectElement.appendChild(defaultOption);
    }

    // Extraer el array de datos
    let dataArray = [];
    
    if (Array.isArray(data)) {
      dataArray = data;
    } else if (data && data.content && Array.isArray(data.content)) {
      // Respuesta paginada de Spring Boot
      dataArray = data.content;
    } else if (data && typeof data === 'object') {
      // Si es un objeto individual, convertirlo en array
      dataArray = [data];
    } else {
      console.error('Formato de datos no válido para fillSelect');
      return false;
    }

    // Aplicar filtro si existe
    if (config.filter && typeof config.filter === 'function') {
      dataArray = dataArray.filter(config.filter);
    }

    // Llenar con las opciones
    dataArray.forEach(item => {
      const option = document.createElement('option');
      
      // Establecer valor
      option.value = item[config.valueKey];
      
      // Establecer texto
      if (config.textFormatter && typeof config.textFormatter === 'function') {
        option.textContent = config.textFormatter(item);
      } else {
        option.textContent = item[config.textKey];
      }

      // Agregar atributos data-* personalizados
      if (config.dataAttributes && typeof config.dataAttributes === 'object') {
        Object.keys(config.dataAttributes).forEach(dataKey => {
          const propertyName = config.dataAttributes[dataKey];
          if (item[propertyName] !== undefined) {
            option.setAttribute(`data-${dataKey}`, item[propertyName]);
          }
        });
      }

      // Seleccionar si coincide con selectedValue
      if (config.selectedValue && item[config.valueKey] === config.selectedValue) {
        option.selected = true;
      }

      selectElement.appendChild(option);
    });

    return true;

  } catch (error) {
    console.error('Error al llenar select:', error);
    return false;
  }
}

/**
 * Llena múltiples selects con la misma configuración
 * 
 * @param {Array<string|HTMLSelectElement>} selects - Array de IDs o elementos select
 * @param {Array|Object} data - Datos para llenar los selects
 * @param {Object} options - Opciones de configuración (mismas que fillSelect)
 * @returns {Object} - Objeto con resultados {selectId: boolean}
 * 
 * @example
 * fillMultipleSelects(['rol1', 'rol2'], rolesData, {textKey: 'nombre'});
 */
export function fillMultipleSelects(selects, data, options = {}) {
  const results = {};
  
  selects.forEach(select => {
    const selectId = typeof select === 'string' ? select : select.id;
    results[selectId] = fillSelect(select, data, options);
  });
  
  return results;
}

/**
 * Limpia un select dejando solo la opción por defecto
 * 
 * @param {HTMLSelectElement|string} select - Elemento select o su ID
 * @param {string} [defaultOption='Seleccionar...'] - Texto de la opción por defecto
 * @param {string} [defaultValue=''] - Valor de la opción por defecto
 * 
 * @example
 * clearSelect('rolSelect', 'Selecciona un rol');
 */
export function clearSelect(select, defaultOption = 'Seleccionar...', defaultValue = '') {
  const selectElement = typeof select === 'string' 
    ? document.getElementById(select) 
    : select;

  if (selectElement) {
    selectElement.innerHTML = '';
    const option = document.createElement('option');
    option.value = defaultValue;
    option.textContent = defaultOption;
    selectElement.appendChild(option);
  }
}

/**
 * Obtiene el texto visible de la opción seleccionada
 * 
 * @param {HTMLSelectElement|string} select - Elemento select o su ID
 * @returns {string|null} - Texto de la opción seleccionada o null
 * 
 * @example
 * const rolNombre = getSelectedText('rolSelect');
 */
export function getSelectedText(select) {
  const selectElement = typeof select === 'string' 
    ? document.getElementById(select) 
    : select;

  if (selectElement && selectElement.selectedIndex >= 0) {
    return selectElement.options[selectElement.selectedIndex].text;
  }
  
  return null;
}

/**
 * Obtiene todos los atributos data-* de la opción seleccionada
 * 
 * @param {HTMLSelectElement|string} select - Elemento select o su ID
 * @returns {Object|null} - Objeto con los atributos data o null
 * 
 * @example
 * const data = getSelectedData('rolSelect');
 * console.log(data.description, data.code);
 */
export function getSelectedData(select) {
  const selectElement = typeof select === 'string' 
    ? document.getElementById(select) 
    : select;

  if (selectElement && selectElement.selectedIndex >= 0) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const data = {};
    
    // Extraer todos los atributos data-*
    Array.from(selectedOption.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        const key = attr.name.replace('data-', '');
        data[key] = attr.value;
      }
    });
    
    return Object.keys(data).length > 0 ? data : null;
  }
  
  return null;
}

/**
 * Deshabilita opciones específicas del select basándose en valores
 * 
 * @param {HTMLSelectElement|string} select - Elemento select o su ID
 * @param {Array} valuesToDisable - Array de valores a deshabilitar
 * 
 * @example
 * disableOptions('rolSelect', ['uuid-rol-1', 'uuid-rol-2']);
 */
export function disableOptions(select, valuesToDisable) {
  const selectElement = typeof select === 'string' 
    ? document.getElementById(select) 
    : select;

  if (selectElement && Array.isArray(valuesToDisable)) {
    Array.from(selectElement.options).forEach(option => {
      if (valuesToDisable.includes(option.value)) {
        option.disabled = true;
      }
    });
  }
}

/**
 * Habilita todas las opciones del select
 * 
 * @param {HTMLSelectElement|string} select - Elemento select o su ID
 * 
 * @example
 * enableAllOptions('rolSelect');
 */
export function enableAllOptions(select) {
  const selectElement = typeof select === 'string' 
    ? document.getElementById(select) 
    : select;

  if (selectElement) {
    Array.from(selectElement.options).forEach(option => {
      option.disabled = false;
    });
  }
}