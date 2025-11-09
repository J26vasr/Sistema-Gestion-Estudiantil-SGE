// controladores/services/file.service.js
import fetchData from '../utils/fetchData.js';
import { mapMethod } from '../utils/mapMethod.js';

const RESOURCE = '/files';

/**
 * Sube un archivo a una categoría específica.
 * POST /api/files/upload
 * @param {File} file - El archivo a subir (de un input type="file")
 * @param {string} category - Categoría: ACTIVIDADES, ESTUDIANTES, PROFESORES, etc.
 * @returns {Promise<Object>} Promesa con {fileName, filePath, fileUrl, category}
 */
export const uploadFile = async (file, category) => {
    // fetchData detectará que 'file' es un File y usará FormData automáticamente
    return fetchData(`${RESOURCE}/upload`, mapMethod('C'), { file, category });
};

/**
 * Elimina un archivo del servidor.
 * DELETE /api/files/delete?filePath=...
 * @param {string} filePath - Path relativo del archivo (ej: "actividades/abc123.jpg")
 * @returns {Promise<Object>} Promesa con {message, filePath}
 */
export const deleteFile = async (filePath) => {
    return fetchData(`${RESOURCE}/delete`, mapMethod('D'), {}, { filePath });
};