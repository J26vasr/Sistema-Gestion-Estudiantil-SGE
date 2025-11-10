// Importar servicios
import { getActividadById, updateActividad } from '../services/actividad.service.js';
import { getAllCursos } from '../services/curso.service.js';
import { uploadFile, deleteFile } from '../services/file.service.js';

// Importar utilidades
import { createFormValidator, Rules } from '../utils/formValidator.js';
import { fillSelect } from '../utils/fillSelect.js';
import { sweetAlert } from '../utils/sweetAlert.js';
import { getImageUrl, getDocumentUrl } from '../utils/fileUrl.js';

// Obtener referencias a elementos del DOM
const form = document.getElementById('actividadForm');
const btnGuardar = document.getElementById('btnGuardar');
const imagenInput = document.getElementById('imagenActividad');
const documentoInput = document.getElementById('documentoActividad');
const imagenPreview = document.getElementById('imagenPreview');
const documentoPreview = document.getElementById('documentoPreview');

// Variables globales
let actividadId = null;
let actividadOriginal = null;
let nuevaImagenArchivo = null;
let nuevoDocumentoArchivo = null;
let imagenUrlActual = null;
let documentoUrlActual = null;
let cursoSeleccionado = null; // Guardar el curso completo seleccionado

// ============================================
// OBTENER ID DE LA ACTIVIDAD DE LA URL
// ============================================
const obtenerIdDeURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

// ============================================
// VISTA PREVIA DE LA IMAGEN
// ============================================
imagenInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file) {
        nuevaImagenArchivo = file;
        
        // Crear FileReader para mostrar vista previa
        const reader = new FileReader();
        reader.onload = function(e) {
            imagenPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        nuevaImagenArchivo = null;
        // Restaurar imagen original o default
        if (imagenUrlActual) {
            imagenPreview.src = getImageUrl(imagenUrlActual);
        } else {
            imagenPreview.src = '../recursos/img/Subir-Img-Act.png';
        }
    }
});

// ============================================
// VISTA PREVIA DEL DOCUMENTO
// ============================================
documentoInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const contenedor = documentoPreview;
    
    contenedor.innerHTML = '';
    
    if (!file) {
        nuevoDocumentoArchivo = null;
        // Restaurar vista previa del documento original
        if (documentoUrlActual) {
            mostrarDocumentoExistente(actividadOriginal.documentoNombre, documentoUrlActual);
        } else {
            contenedor.innerHTML = '<p style="color: #666;">📄 La vista previa del documento aparecerá aquí</p>';
        }
        return;
    }
    
    nuevoDocumentoArchivo = file;
    const nombre = file.name;
    const tipo = file.type;
    
    if (tipo === 'application/pdf') {
        // Vista previa de PDF
        const iframe = document.createElement('iframe');
        iframe.src = URL.createObjectURL(file);
        iframe.width = '100%';
        iframe.height = '500px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '10px';
        contenedor.appendChild(iframe);
    } else {
        // Otros documentos: mostrar enlace de descarga
        const infoDiv = document.createElement('div');
        infoDiv.style.padding = '20px';
        infoDiv.style.background = '#f0f0f0';
        infoDiv.style.borderRadius = '10px';
        infoDiv.style.textAlign = 'center';
        
        const icono = document.createElement('p');
        icono.textContent = '📄';
        icono.style.fontSize = '48px';
        icono.style.margin = '10px 0';
        
        const texto = document.createElement('p');
        texto.textContent = `Archivo: ${nombre}`;
        texto.style.fontWeight = 'bold';
        texto.style.marginBottom = '10px';
        
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(file);
        enlace.download = nombre;
        enlace.textContent = 'Descargar archivo';
        enlace.style.color = '#6b4eff';
        enlace.style.textDecoration = 'underline';
        
        infoDiv.appendChild(icono);
        infoDiv.appendChild(texto);
        infoDiv.appendChild(enlace);
        contenedor.appendChild(infoDiv);
    }
});

// ============================================
// MOSTRAR DOCUMENTO EXISTENTE
// ============================================
const mostrarDocumentoExistente = (nombreDocumento, documentoUrl) => {
    const contenedor = documentoPreview;
    contenedor.innerHTML = '';
    
    const infoDiv = document.createElement('div');
    infoDiv.style.padding = '20px';
    infoDiv.style.background = '#e8f5e9';
    infoDiv.style.borderRadius = '10px';
    infoDiv.style.textAlign = 'center';
    
    const icono = document.createElement('p');
    icono.textContent = '✅';
    icono.style.fontSize = '48px';
    icono.style.margin = '10px 0';
    
    const texto = document.createElement('p');
    texto.textContent = `Documento actual: ${nombreDocumento}`;
    texto.style.fontWeight = 'bold';
    texto.style.marginBottom = '10px';
    
    const enlace = document.createElement('a');
    enlace.href = getDocumentUrl(documentoUrl);
    enlace.target = '_blank';
    enlace.textContent = 'Ver/Descargar documento actual';
    enlace.style.color = '#6b4eff';
    enlace.style.textDecoration = 'underline';
    
    infoDiv.appendChild(icono);
    infoDiv.appendChild(texto);
    infoDiv.appendChild(enlace);
    contenedor.appendChild(infoDiv);
};

// ============================================
// CARGAR DATOS INICIALES
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Aplicar modo oscuro
    if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.classList.add("dark");
    }
    
    // Obtener ID de la actividad
    actividadId = obtenerIdDeURL();
    
    if (!actividadId) {
        await sweetAlert(2, 'No se especificó la actividad a editar.', false);
        window.location.href = 'vista-actividades.html';
        return;
    }
    
    try {
        // Cargar datos en paralelo
        const [cursosResponse, actividad] = await Promise.all([
            getAllCursos(0, 100),
            getActividadById(actividadId)
        ]);
        
        // Guardar actividad original
        actividadOriginal = actividad;
        imagenUrlActual = actividad.imagenUrl;
        documentoUrlActual = actividad.documentoUrl;
        
        // Obtener cursos y buscar el que coincida con asignatura y profesor de la actividad
        const cursos = cursosResponse.content || cursosResponse;
        window.cursosData = cursos;
        
        // Buscar el curso que corresponde a esta actividad (mismo asignatura y profesor)
        const cursoActual = cursos.find(c => 
            c.asignatura.id === actividad.asignatura.id && 
            c.profesor.id === actividad.profesor.id
        );
        
        // Llenar select de cursos
        fillSelect('curso', cursos, {
            valueKey: 'id',
            textKey: 'nombreGrupo',
            defaultOption: 'Selecciona un curso (asignatura-profesor)',
            textFormatter: (curso) => {
                const asignatura = curso.asignatura.nombre;
                const profesor = curso.profesor.usuario?.nombre || curso.profesor.especialidad;
                return `${asignatura} - ${profesor}`;
            },
            selectedValue: cursoActual ? cursoActual.id : null
        });
        
        // Establecer el curso seleccionado inicialmente
        cursoSeleccionado = cursoActual;
        
        // Agregar event listener para cambios en el select
        const cursoSelect = document.getElementById('curso');
        cursoSelect.addEventListener('change', function() {
            const cursoId = this.value;
            if (cursoId) {
                cursoSeleccionado = cursos.find(c => c.id === cursoId);
                console.log('Curso seleccionado:', cursoSeleccionado);
            } else {
                cursoSeleccionado = null;
            }
        });
        
        // Llenar campos del formulario
        document.getElementById('titulo').value = actividad.titulo;
        document.getElementById('descripcion').value = actividad.descripcion;
        
        // Formatear fechas para datetime-local (formato: YYYY-MM-DDTHH:mm)
        const fechaApertura = new Date(actividad.fechaApertura);
        const fechaCierre = new Date(actividad.fechaCierre);
        
        document.getElementById('fechaApertura').value = formatearFechaParaInput(fechaApertura);
        document.getElementById('fechaCierre').value = formatearFechaParaInput(fechaCierre);
        
        // Estado activo
        document.getElementById('activo').checked = actividad.activo;
        
        // Mostrar imagen actual
        if (actividad.imagenUrl) {
            imagenPreview.src = getImageUrl(actividad.imagenUrl);
        }
        
        // Mostrar documento actual
        if (actividad.documentoUrl && actividad.documentoNombre) {
            mostrarDocumentoExistente(actividad.documentoNombre, actividad.documentoUrl);
        }
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        await sweetAlert(2, 'Error al cargar los datos de la actividad.', false);
        window.location.href = 'vista-actividades.html';
    }
});

// ============================================
// FORMATEAR FECHA PARA INPUT DATETIME-LOCAL
// ============================================
const formatearFechaParaInput = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// ============================================
// CONFIGURAR VALIDADOR DEL FORMULARIO
// ============================================
const validator = createFormValidator({
    fields: {
        curso: {
            input: '#curso',
            error: '#cursoError',
            label: 'Curso',
            rules: [Rules.required('Debes seleccionar un curso (asignatura-profesor).')]
        },
        titulo: {
            input: '#titulo',
            error: '#tituloError',
            label: 'Título',
            rules: [
                Rules.required(),
                Rules.text(3, 200)
            ]
        },
        descripcion: {
            input: '#descripcion',
            error: '#descripcionError',
            label: 'Descripción',
            rules: [Rules.required()]
        },
        fechaApertura: {
            input: '#fechaApertura',
            error: '#fechaAperturaError',
            label: 'Fecha de apertura',
            rules: [Rules.required('Debes especificar la fecha de apertura.')]
        },
        fechaCierre: {
            input: '#fechaCierre',
            error: '#fechaCierreError',
            label: 'Fecha de cierre',
            rules: [Rules.required('Debes especificar la fecha de cierre.')]
        },
        imagenActividad: {
            input: '#imagenActividad',
            error: '#imagenError',
            label: 'Imagen',
            rules: [Rules.image(10, false)]
        },
        documentoActividad: {
            input: '#documentoActividad',
            error: '#documentoError',
            label: 'Documento',
            rules: [Rules.document(10, false)]
        }
    },
    validateOnInput: true,
    validateOnBlur: true,
    focusFirstError: true
});

// ============================================
// MANEJO DEL ENVÍO DEL FORMULARIO
// ============================================
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validator.validateAll()) {
        return;
    }
    
    // Obtener valores
    const values = validator.getAllValues();
    
    // Validar fechas
    const fechaApertura = new Date(values.fechaApertura);
    const fechaCierre = new Date(values.fechaCierre);
    
    if (fechaCierre <= fechaApertura) {
        await sweetAlert(3, 'La fecha de cierre debe ser posterior a la fecha de apertura.', false);
        return;
    }
    
    // Deshabilitar botón
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Actualizando...';
    
    try {
        let imagenUrl = imagenUrlActual;
        let documentoUrl = documentoUrlActual;
        let documentoNombre = actividadOriginal.documentoNombre;
        
        // Si hay nueva imagen, subir y eliminar la anterior
        if (nuevaImagenArchivo) {
            btnGuardar.textContent = 'Subiendo nueva imagen...';
            
            // Eliminar imagen anterior si existe
            if (imagenUrlActual) {
                try {
                    // Extraer path relativo de la URL
                    const pathRelativo = imagenUrlActual.replace('/uploads/', '');
                    await deleteFile(pathRelativo);
                } catch (error) {
                    console.error('Error al eliminar imagen anterior:', error);
                }
            }
            
            // Subir nueva imagen
            const imagenResponse = await uploadFile(nuevaImagenArchivo, 'ACTIVIDADES');
            imagenUrl = imagenResponse.fileUrl;
        }
        
        // Si hay nuevo documento, subir y eliminar el anterior
        if (nuevoDocumentoArchivo) {
            btnGuardar.textContent = 'Subiendo nuevo documento...';
            
            // Eliminar documento anterior si existe
            if (documentoUrlActual) {
                try {
                    const pathRelativo = documentoUrlActual.replace('/uploads/', '');
                    await deleteFile(pathRelativo);
                } catch (error) {
                    console.error('Error al eliminar documento anterior:', error);
                }
            }
            
            // Subir nuevo documento
            const documentoResponse = await uploadFile(nuevoDocumentoArchivo, 'ACTIVIDADES');
            documentoUrl = documentoResponse.fileUrl;
            documentoNombre = documentoResponse.fileName;
        }
        
        // Preparar datos para actualizar
        btnGuardar.textContent = 'Guardando cambios...';
        
        // Validar que tengamos el curso seleccionado con sus datos
        if (!cursoSeleccionado) {
            throw new Error('No se pudo obtener la información del curso seleccionado.');
        }
        
        const actividadData = {
            asignaturaId: cursoSeleccionado.asignatura.id,
            profesorId: cursoSeleccionado.profesor.id,
            titulo: values.titulo.trim(),
            descripcion: values.descripcion.trim(),
            fechaApertura: values.fechaApertura,
            fechaCierre: values.fechaCierre,
            imagenUrl: imagenUrl,
            documentoUrl: documentoUrl,
            documentoNombre: documentoNombre,
            activo: document.getElementById('activo').checked
        };
        
        console.log('Payload a actualizar:', actividadData);
        
        // Actualizar actividad
        await updateActividad(actividadId, actividadData);
        
        // Éxito
        await sweetAlert(1, 'Actividad actualizada correctamente', true, 'vista-actividades.html');
        
    } catch (error) {
        console.error('Error al actualizar actividad:', error);
        await sweetAlert(2, error.message || 'Error al actualizar la actividad. Por favor, intenta de nuevo.', false);
        
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar Cambios';
    }
});
