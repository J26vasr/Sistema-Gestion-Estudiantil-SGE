// Importar servicios
import { getClaseById, updateClase } from '../services/clase.service.js';
import { getAllTemas } from '../services/tema.service.js';
import { uploadFile, deleteFile } from '../services/file.service.js';

// Importar utilidades
import { createFormValidator, Rules } from '../utils/formValidator.js';
import { fillSelect } from '../utils/fillSelect.js';
import { sweetAlert } from '../utils/sweetAlert.js';
import { getDocumentUrl } from '../utils/fileUrl.js';

// Obtener referencias a elementos del DOM
const form = document.getElementById('claseForm');
const btnGuardar = document.getElementById('btnGuardar');
const documentoInput = document.getElementById('documentoClase');
const documentoPreview = document.getElementById('documentoPreview');

// Variables globales
let claseId = null;
let claseOriginal = null;
let nuevoDocumentoArchivo = null;
let documentoUrlActual = null;
let temaSeleccionado = null; // Guardar el tema completo seleccionado
let cursoIdFiltro = null; // ID del curso para filtrar temas

// ============================================
// OBTENER ID DE LA CLASE DE LA URL
// ============================================
const obtenerIdDeURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

// ============================================
// VISTA PREVIA DEL DOCUMENTO
// ============================================
documentoInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const contenedor = documentoPreview;
    
    contenedor.innerHTML = '';
    
    if (!file) {
        nuevoDocumentoArchivo = null;
        // Restaurar documento existente si hay
        if (claseOriginal && claseOriginal.documentoUrl && claseOriginal.documentoNombre) {
            mostrarDocumentoExistente(claseOriginal.documentoNombre, claseOriginal.documentoUrl);
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
        iframe.height = '400px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '10px';
        contenedor.appendChild(iframe);
    } else {
        // Otros documentos: mostrar información
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
    
    // Obtener ID de la clase
    claseId = obtenerIdDeURL();
    
    if (!claseId) {
        await sweetAlert(2, 'No se especificó la clase a editar.', false);
        window.location.href = 'material.html';
        return;
    }
    
    // Obtener cursoId de la URL si existe
    const params = new URLSearchParams(window.location.search);
    cursoIdFiltro = params.get('cursoId');
    
    try {
        // Cargar datos en paralelo
        const [temasResponse, clase] = await Promise.all([
            getAllTemas(0, 100),
            getClaseById(claseId)
        ]);
        
        // Guardar clase original
        claseOriginal = clase;
        documentoUrlActual = clase.documentoUrl;
        
        // Obtener temas y filtrar si hay cursoId
        let temas = temasResponse.content || temasResponse;
        
        // Si hay cursoIdFiltro, filtrar solo temas de ese curso
        if (cursoIdFiltro) {
            temas = temas.filter(tema => tema.unidad?.curso?.id === cursoIdFiltro);
        }
        
        window.temasData = temas;
        
        // Buscar el tema que corresponde a esta clase
        const temaActual = temas.find(t => t.id === clase.tema?.id);
        
        // Llenar select de temas
        fillSelect('tema', temas, {
            valueKey: 'id',
            textKey: 'titulo',
            defaultOption: 'Selecciona un tema',
            textFormatter: (tema) => {
                const tituloTema = tema.titulo;
                const unidad = tema.unidad?.titulo || 'Sin unidad';
                const asignatura = tema.unidad?.curso?.asignatura?.nombre || 'Sin asignatura';
                return `${tituloTema} - ${unidad} - ${asignatura}`;
            },
            selectedValue: temaActual ? temaActual.id : null
        });
        
        // Establecer el tema seleccionado inicialmente
        temaSeleccionado = temaActual;
        
        // Agregar event listener para cambios en el select
        const temaSelect = document.getElementById('tema');
        temaSelect.addEventListener('change', function() {
            const temaId = this.value;
            if (temaId) {
                temaSeleccionado = temas.find(t => t.id === temaId);
                console.log('Tema seleccionado:', temaSeleccionado);
            } else {
                temaSeleccionado = null;
            }
        });
        
        // Llenar campos del formulario
        document.getElementById('fecha').value = clase.fecha;
        document.getElementById('inicio').value = clase.inicio;
        document.getElementById('fin').value = clase.fin;
        document.getElementById('notas').value = clase.notas || '';
        
        // Mostrar documento actual si existe
        if (clase.documentoUrl && clase.documentoNombre) {
            mostrarDocumentoExistente(clase.documentoNombre, clase.documentoUrl);
        }
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        await sweetAlert(2, 'Error al cargar los datos de la clase.', false);
        window.location.href = 'material.html';
    }
    
    // Configurar botón cancelar
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            const url = cursoIdFiltro 
                ? `material.html?cursoId=${cursoIdFiltro}` 
                : 'material.html';
            window.location.href = url;
        });
    }
});

// ============================================
// CONFIGURAR VALIDADOR DEL FORMULARIO
// ============================================
const validator = createFormValidator({
    fields: {
        tema: {
            input: '#tema',
            error: '#temaError',
            label: 'Tema',
            rules: [Rules.required('Debes seleccionar un tema.')]
        },
        fecha: {
            input: '#fecha',
            error: '#fechaError',
            label: 'Fecha',
            rules: [Rules.required('Debes especificar la fecha de la clase.')]
        },
        inicio: {
            input: '#inicio',
            error: '#inicioError',
            label: 'Hora de inicio',
            rules: [Rules.required('Debes especificar la hora de inicio.')]
        },
        fin: {
            input: '#fin',
            error: '#finError',
            label: 'Hora de fin',
            rules: [Rules.required('Debes especificar la hora de fin.')]
        },
        notas: {
            input: '#notas',
            error: '#notasError',
            label: 'Notas',
            rules: [] // Opcional
        },
        documentoClase: {
            input: '#documentoClase',
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
    
    // Validar horarios
    if (values.fin <= values.inicio) {
        await sweetAlert(3, 'La hora de fin debe ser posterior a la hora de inicio.', false);
        return;
    }
    
    // Deshabilitar botón
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Actualizando...';
    
    try {
        let documentoUrl = documentoUrlActual;
        let documentoNombre = claseOriginal.documentoNombre;
        
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
            const documentoResponse = await uploadFile(nuevoDocumentoArchivo, 'CLASES');
            documentoUrl = documentoResponse.fileUrl;
            documentoNombre = documentoResponse.fileName;
        }
        
        // Preparar datos para actualizar
        btnGuardar.textContent = 'Guardando cambios...';
        
        // Validar que tengamos el tema seleccionado con sus datos
        if (!temaSeleccionado) {
            throw new Error('No se pudo obtener la información del tema seleccionado.');
        }
        
        // Extraer el cursoId del tema seleccionado
        const cursoId = temaSeleccionado.unidad?.curso?.id;
        
        if (!cursoId) {
            throw new Error('No se pudo obtener el curso del tema seleccionado.');
        }
        
        const claseData = {
            fecha: values.fecha,
            inicio: values.inicio,
            fin: values.fin,
            unidadId: temaSeleccionado.unidad?.id || null,
            temaId: temaSeleccionado.id,
            notas: values.notas ? values.notas.trim() : null,
            documentoUrl: documentoUrl,
            documentoNombre: documentoNombre
        };
        
        console.log('Payload a actualizar:', claseData);
        
        // Actualizar clase
        await updateClase(claseId, claseData);
        
        // Éxito - redirigir con cursoId si existe
        const redirectUrl = cursoIdFiltro 
            ? `material.html?cursoId=${cursoIdFiltro}` 
            : 'material.html';
        await sweetAlert(1, 'Clase actualizada correctamente', true, redirectUrl);
        
    } catch (error) {
        console.error('Error al actualizar clase:', error);
        await sweetAlert(2, error.message || 'Error al actualizar la clase. Por favor, intenta de nuevo.', false);
        
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar Cambios';
    }
});
