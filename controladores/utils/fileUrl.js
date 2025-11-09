/**
 * Utilidad para construir URLs de archivos estáticos del servidor.
 * Los archivos (imágenes, documentos) se encuentran en la carpeta uploads/ de la API.
 */

const SERVER_BASE_URL = 'http://localhost:8080';

/**
 * Construye la URL completa de un archivo estático del servidor.
 * @param {string} filePath - Ruta relativa del archivo (ej: "/uploads/actividades/image.jpg")
 * @returns {string} URL completa del archivo
 */
export const getFileUrl = (filePath) => {
    if (!filePath) return null;
    
    // Si ya tiene el protocolo (http/https), devolver tal cual
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        return filePath;
    }
    
    // Si empieza con /, construir URL completa
    if (filePath.startsWith('/')) {
        return `${SERVER_BASE_URL}${filePath}`;
    }
    
    // Si no empieza con /, agregar /
    return `${SERVER_BASE_URL}/${filePath}`;
};

/**
 * Construye la URL para una imagen.
 * @param {string} imagePath - Ruta relativa de la imagen
 * @param {string} defaultImage - Imagen por defecto si no hay ruta
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (imagePath, defaultImage = '../recursos/img/Subir-Img-Act.png') => {
    if (!imagePath) return defaultImage;
    return getFileUrl(imagePath);
};

/**
 * Construye la URL para un documento.
 * @param {string} documentPath - Ruta relativa del documento
 * @returns {string|null} URL completa del documento o null si no existe
 */
export const getDocumentUrl = (documentPath) => {
    if (!documentPath) return null;
    return getFileUrl(documentPath);
};

/**
 * Obtiene el tipo de archivo según su extensión.
 * @param {string} fileName - Nombre del archivo
 * @returns {string} Tipo de archivo (pdf, doc, image, etc.)
 */
export const getFileType = (fileName) => {
    if (!fileName) return 'unknown';
    
    const extension = fileName.split('.').pop().toLowerCase();
    
    const types = {
        // Documentos
        pdf: 'pdf',
        doc: 'doc',
        docx: 'doc',
        xls: 'excel',
        xlsx: 'excel',
        ppt: 'powerpoint',
        pptx: 'powerpoint',
        txt: 'text',
        
        // Imágenes
        jpg: 'image',
        jpeg: 'image',
        png: 'image',
        gif: 'image',
        webp: 'image',
        svg: 'image',
        
        // Otros
        zip: 'zip',
        rar: 'zip'
    };
    
    return types[extension] || 'unknown';
};

/**
 * Obtiene el ícono Font Awesome según el tipo de archivo.
 * @param {string} fileName - Nombre del archivo
 * @returns {string} Clase de ícono de Font Awesome
 */
export const getFileIcon = (fileName) => {
    const type = getFileType(fileName);
    
    const icons = {
        pdf: 'fa-file-pdf',
        doc: 'fa-file-word',
        excel: 'fa-file-excel',
        powerpoint: 'fa-file-powerpoint',
        text: 'fa-file-text',
        image: 'fa-file-image',
        zip: 'fa-file-archive',
        unknown: 'fa-file'
    };
    
    return icons[type] || icons.unknown;
};
