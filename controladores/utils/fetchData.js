const SERVER_URL = 'http://localhost:8080/api';

/**
 * Realiza peticiones HTTP usando fetch nativo.
 * @param {string} endpoint - Endpoint de la API (ej: '/usuarios', '/roles/123')
 * @param {string} method - Método HTTP (GET, POST, PUT, PATCH, DELETE)
 * @param {Object} form - Datos a enviar en el body (para POST, PUT, PATCH, DELETE)
 * @param {Object} params - Parámetros de query string
 * @returns {Promise<any>} Promesa con los datos de la respuesta
 */
async function fetchData(endpoint, method, form = {}, params = {}) {
  // Construir URL con query params si existen
  let url = SERVER_URL + endpoint;
  
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  // Verificar si alguno de los valores en `form` es un archivo (instancia de File)
  const hasFile = Object.values(form).some(value => value instanceof File);

  const headers = {
    Authorization: localStorage.getItem('jwtToken')
      ? `Bearer ${localStorage.getItem('jwtToken')}`
      : '',
  };

  let body = null;

  // Para los métodos que envían body
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    if (hasFile) {
      // Si hay un archivo, usar FormData
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      body = formData;
      // No establecer Content-Type, el navegador lo hará automáticamente con boundary
    } else {
      // Si no hay archivo, enviar como JSON
      if (Object.keys(form).length > 0) {
        body = JSON.stringify(form);
        headers['Content-Type'] = 'application/json';
      }
    }
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = body;
  }

  console.log('Request Data:', form);
  console.log('Request Headers:', headers);
  console.log('Request URL:', url);
  console.log('Request Met hod:', method);

  try {
    const response = await fetch(url, options);
    
    console.log('RESPONSE:', {
      URL: url,
      Status: response.status,
      StatusText: response.statusText,
    });

    // Leer el cuerpo de la respuesta
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log('Response Data:', data);

    // Si la respuesta no es exitosa, lanzar error
    if (!response.ok) {
      // Manejar errores de validación (similar a Axios)
      if (data && Array.isArray(data.error)) {
        const errorMessages = data.error.map(err => err.msg).join(', ');
        throw new Error(`Errores: ${errorMessages}`);
      }
      throw new Error(data?.error || data?.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
}

export default fetchData;