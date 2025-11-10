// Importar servicios
import { getCalificacionById, updateCalificacion } from '../services/calificacion.service.js';

// Importar utilidades
import { sweetAlert } from '../utils/sweetAlert.js';
import { createFormValidator, Rules } from '../utils/formValidator.js';

// Obtener referencias a elementos del DOM
const form = document.getElementById('calificacionForm');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const comentarioTextarea = document.getElementById('comentario');
const comentarioCount = document.getElementById('comentarioCount');
const evaluacionInfo = document.getElementById('evaluacionInfo');

// Variables globales
let calificacionId = null;
let calificacionOriginal = null;

// ============================================
// OBTENER ID DE LA CALIFICACIÓN DE LA URL
// ============================================
const obtenerIdDeURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
};

// ============================================
// CONTADOR DE CARACTERES
// ============================================
comentarioTextarea.addEventListener('input', () => {
    const length = comentarioTextarea.value.length;
    comentarioCount.textContent = length;
});

// ============================================
// CARGAR DATOS INICIALES
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    calificacionId = obtenerIdDeURL();
    
    if (!calificacionId) {
        await sweetAlert(2, 'No se especificó la calificación a editar', false);
        window.location.href = 'calificaciones.html';
        return;
    }
    
    try {
        // Cargar calificación
        calificacionOriginal = await getCalificacionById(calificacionId);
        
        // Mostrar información de la evaluación
        const evaluacion = calificacionOriginal.evaluacion;
        evaluacionInfo.innerHTML = `
            <strong>Evaluación:</strong> ${evaluacion.nombre} | 
            <strong>Curso:</strong> ${evaluacion.curso.asignatura.nombre} - ${evaluacion.curso.nombreGrupo} | 
            <strong>Fecha:</strong> ${new Date(evaluacion.fecha).toLocaleDateString('es-ES')} |
            <strong>Peso:</strong> ${evaluacion.peso}%
        `;
        
        // Llenar formulario con datos existentes
        document.getElementById('estudiante').value = 
            `${calificacionOriginal.estudiante.usuario.nombre} (${calificacionOriginal.estudiante.codigoEstudiante})`;
        document.getElementById('nota').value = calificacionOriginal.nota;
        document.getElementById('comentario').value = calificacionOriginal.comentario || '';
        comentarioCount.textContent = calificacionOriginal.comentario ? calificacionOriginal.comentario.length : 0;
        
    } catch (error) {
        console.error('Error al cargar calificación:', error);
        await sweetAlert(2, 'Error al cargar los datos de la calificación', false);
        window.location.href = 'calificaciones.html';
    }
});

// ============================================
// CONFIGURAR VALIDADOR DEL FORMULARIO
// ============================================
const validator = createFormValidator({
    fields: {
        nota: {
            input: '#nota',
            error: '#notaError',
            label: 'Nota',
            rules: [
                Rules.required('La nota es obligatoria.'),
                Rules.decimal(0, 10, 1)
            ]
        },
        comentario: {
            input: '#comentario',
            error: '#comentarioError',
            label: 'Comentario',
            rules: [
                Rules.text(null, 255)
            ]
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
    const isValid = validator.validateAll();
    
    if (!isValid) {
        await sweetAlert(3, 'Por favor, corrige los errores en el formulario', false);
        return;
    }
    
    // Deshabilitar botón de guardar
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Actualizando...';
    
    try {
        // Preparar datos
        const formData = {
            nota: parseFloat(document.getElementById('nota').value),
            comentario: document.getElementById('comentario').value.trim() || null
        };
        
        // Actualizar calificación
        await updateCalificacion(calificacionId, formData);
        
        await sweetAlert(1, 'Calificación actualizada exitosamente', true);
        
        // Redirigir a lista de calificaciones
        window.location.href = 'calificaciones.html';
        
    } catch (error) {
        console.error('Error al actualizar calificación:', error);
        await sweetAlert(2, error.message || 'Error al actualizar la calificación', false);
        
        // Rehabilitar botón
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Actualizar Calificación';
    }
});

// ============================================
// BOTÓN CANCELAR
// ============================================
btnCancelar.addEventListener('click', () => {
    window.location.href = 'calificaciones.html';
});
