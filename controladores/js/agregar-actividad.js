// Importar servicios
import { createActividad } from '../services/actividad.service.js';
import { getAllCursos } from '../services/curso.service.js';
import { uploadFile } from '../services/file.service.js';

// Importar utilidades
import { createFormValidator, Rules } from '../utils/formValidator.js';
import { fillSelect } from '../utils/fillSelect.js';
import { sweetAlert } from '../utils/sweetAlert.js';

// Obtener referencias a elementos del DOM
const form = document.getElementById('actividadForm');
const btnGuardar = document.getElementById('btnGuardar');
const imagenInput = document.getElementById('imagenActividad');
const documentoInput = document.getElementById('documentoActividad');
const imagenPreview = document.getElementById('imagenPreview');
const documentoPreview = document.getElementById('documentoPreview');

// Variables globales
let imagenArchivo = null;
let documentoArchivo = null;
let cursoSeleccionado = null; // Guardar el curso completo seleccionado

// ============================================
// VISTA PREVIA DE LA IMAGEN
// ============================================
imagenInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file) {
        imagenArchivo = file;
        
        // Crear FileReader para mostrar vista previa
        const reader = new FileReader();
        reader.onload = function(e) {
            imagenPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        imagenArchivo = null;
        imagenPreview.src = '../recursos/img/Subir-Img-Act.png';
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
        documentoArchivo = null;
        return;
    }
    
    documentoArchivo = file;
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
// CARGAR DATOS INICIALES
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Aplicar modo oscuro
    if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.classList.add("dark");
    }
    
    try {
        // Cargar cursos (contienen asignatura y profesor)
        const cursosResponse = await getAllCursos(0, 100);
        const cursos = cursosResponse.content || cursosResponse;
        
        // Guardar referencia a los cursos para usarlos después
        window.cursosData = cursos;
        
        fillSelect('curso', cursos, {
            valueKey: 'id',
            textKey: 'nombreGrupo',
            defaultOption: 'Selecciona una asignatura',
            textFormatter: (curso) => {
                const asignatura = curso.asignatura.nombre;
                const profesor = curso.profesor.usuario?.nombre || curso.profesor.especialidad;
                return `${asignatura} - ${profesor}`;
            }
        });
        
        // Agregar event listener para cuando se seleccione un curso
        const cursoSelect = document.getElementById('curso');
        cursoSelect.addEventListener('change', function() {
            const cursoId = this.value;
            if (cursoId) {
                // Buscar el curso seleccionado en los datos
                cursoSeleccionado = cursos.find(c => c.id === cursoId);
                console.log('Curso seleccionado:', cursoSeleccionado);
            } else {
                cursoSeleccionado = null;
            }
        });
        
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        showAlert('error', 'Error', 'No se pudieron cargar los cursos disponibles.');
    }
});

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
            rules: [Rules.image(10, false)] // Max 10MB, no requerido
        },
        documentoActividad: {
            input: '#documentoActividad',
            error: '#documentoError',
            label: 'Documento',
            rules: [Rules.document(10, false)] // Max 10MB, no requerido
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
    btnGuardar.textContent = 'Guardando...';
    
    try {
        let imagenUrl = null;
        let documentoUrl = null;
        let documentoNombre = null;
        
        // Subir imagen si existe
        if (imagenArchivo) {
            btnGuardar.textContent = 'Subiendo imagen...';
            const imagenResponse = await uploadFile(imagenArchivo, 'ACTIVIDADES');
            imagenUrl = imagenResponse.fileUrl;
        }
        
        // Subir documento si existe
        if (documentoArchivo) {
            btnGuardar.textContent = 'Subiendo documento...';
            const documentoResponse = await uploadFile(documentoArchivo, 'ACTIVIDADES');
            documentoUrl = documentoResponse.fileUrl;
            documentoNombre = documentoResponse.fileName;
        }
        
        // Preparar datos para enviar
        btnGuardar.textContent = 'Creando actividad...';
        
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
        
        console.log('Payload a enviar:', actividadData);
        
        // Crear actividad
        await createActividad(actividadData);
        
        // Éxito
        await sweetAlert(1, 'Actividad creada correctamente', true, 'vista-actividades.html');
        
    } catch (error) {
        console.error('Error al crear actividad:', error);
        await sweetAlert(2, error.message || 'Error al crear la actividad. Por favor, intenta de nuevo.', false);
        
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar Actividad';
    }
});
