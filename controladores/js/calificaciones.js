// Importar servicios
import { getAllCalificaciones, deleteCalificacion, permanentDeleteCalificacion } from '../services/calificacion.service.js';
import { sweetAlert, confirmAction } from '../utils/sweetAlert.js';
import { getImageUrl } from '../utils/fileUrl.js';

// Variables globales
let calificacionesData = [];
let calificacionIdToDelete = null;

// ============================================
// FORMATEAR FECHA
// ============================================
const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

// ============================================
// CALCULAR SI APROBÓ (nota >= 6)
// ============================================
const calcularAprobado = (nota) => {
    return nota >= 6;
};

// ============================================
// AGRUPAR CALIFICACIONES POR EVALUACIÓN
// ============================================
const agruparPorEvaluacion = (calificaciones) => {
    const grupos = {};
    
    calificaciones.forEach(calificacion => {
        const evaluacionId = calificacion.evaluacion.id;
        const evaluacionNombre = calificacion.evaluacion.nombre;
        
        if (!grupos[evaluacionId]) {
            grupos[evaluacionId] = {
                evaluacion: calificacion.evaluacion,
                calificaciones: []
            };
        }
        
        grupos[evaluacionId].calificaciones.push(calificacion);
    });
    
    return grupos;
};

// ============================================
// RENDERIZAR ACORDEONES DE EVALUACIONES
// ============================================
const renderizarEvaluaciones = (calificaciones) => {
    const contenedor = document.getElementById('evaluacionesContainer');
    
    if (!calificaciones || calificaciones.length === 0) {
        contenedor.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #666;">
                <p style="font-size: 1.1rem;">No hay calificaciones registradas</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Las calificaciones aparecerán aquí una vez que sean agregadas.</p>
            </div>
        `;
        return;
    }
    
    // Agrupar por evaluación
    const grupos = agruparPorEvaluacion(calificaciones);
    
    let html = '';
    
    Object.keys(grupos).forEach((evaluacionId, index) => {
        const grupo = grupos[evaluacionId];
        const evaluacion = grupo.evaluacion;
        const califs = grupo.calificaciones;
        
        // Calcular promedio de la evaluación
        const promedio = (califs.reduce((sum, cal) => sum + cal.nota, 0) / califs.length).toFixed(2);
        
        // Contar aprobados
        const aprobados = califs.filter(cal => calcularAprobado(cal.nota)).length;
        
        html += `
            <div class="evaluacion-card">
                <div class="evaluacion-header" onclick="toggleEvaluacion('eval-${evaluacionId}')">
                    <div class="evaluacion-info">
                        <h3>${evaluacion.nombre}</h3>
                        <div class="evaluacion-meta">
                            <span><strong>Curso:</strong> ${evaluacion.curso.asignatura.nombre} - ${evaluacion.curso.nombreGrupo}</span>
                            <span><strong>Tipo:</strong> ${evaluacion.tipoEvaluacion.nombre}</span>
                            <span><strong>Fecha:</strong> ${formatearFecha(evaluacion.fecha)}</span>
                            <span><strong>Peso:</strong> ${evaluacion.peso}%</span>
                        </div>
                    </div>
                    <div class="evaluacion-stats">
                        <div class="stat-item">
                            <span class="stat-label">Estudiantes</span>
                            <span class="stat-value">${califs.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Promedio</span>
                            <span class="stat-value">${promedio}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Aprobados</span>
                            <span class="stat-value">${aprobados}/${califs.length}</span>
                        </div>
                    </div>
                    <div class="accordion-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
                
                <div id="eval-${evaluacionId}" class="evaluacion-content">
                    <div class="evaluacion-actions">
                        <button onclick="agregarCalificacion('${evaluacionId}')" class="btn-action btn-add">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Agregar Calificación
                        </button>
                    </div>
                    
                    <div class="table-header">
                        <span>Foto</span>
                        <span>Estudiante</span>
                        <span>Carnet</span>
                        <span>Nota</span>
                        <span>Comentario</span>
                        <span>Estado</span>
                        <span>Acciones</span>
                    </div>
                    
                    <div class="calificaciones-list">
                        ${califs.map(cal => `
                            <div class="calificacion-item">
                                <img src="${getImageUrl(cal.estudiante.usuario.fotoPerfilUrl)}" alt="Foto" class="student-photo">
                                <span class="student-name">${cal.estudiante.usuario.nombre}</span>
                                <span class="student-code">${cal.estudiante.codigoEstudiante}</span>
                                <span class="nota-value ${calcularAprobado(cal.nota) ? 'aprobado' : 'reprobado'}">${cal.nota}</span>
                                <span class="comentario">${cal.comentario || 'Sin comentario'}</span>
                                <span class="estado ${calcularAprobado(cal.nota) ? 'aprobado' : 'reprobado'}">
                                    ${calcularAprobado(cal.nota) ? '✓ Aprobado' : '✗ Reprobado'}
                                </span>
                                <div class="actions">
                                    <button onclick="editarCalificacion('${cal.id}')" class="btn-action btn-edit" title="Editar">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                    </button>
                                    <button onclick="abrirModalEliminar('${cal.id}')" class="btn-action btn-delete" title="Eliminar">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
};

// ============================================
// TOGGLE ACORDEÓN
// ============================================
window.toggleEvaluacion = (id) => {
    const content = document.getElementById(id);
    const card = content.parentElement;
    
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        card.classList.remove('active');
    } else {
        // Cerrar otros acordeones
        document.querySelectorAll('.evaluacion-content').forEach(el => {
            el.style.maxHeight = null;
            el.parentElement.classList.remove('active');
        });
        
        content.style.maxHeight = content.scrollHeight + "px";
        card.classList.add('active');
    }
};

// ============================================
// AGREGAR CALIFICACIÓN
// ============================================
window.agregarCalificacion = (evaluacionId) => {
    window.location.href = `agregar-calificaciones.html?evaluacionId=${evaluacionId}`;
};

// ============================================
// EDITAR CALIFICACIÓN
// ============================================
window.editarCalificacion = (calificacionId) => {
    window.location.href = `editar-calificaciones.html?id=${calificacionId}`;
};

// ============================================
// ABRIR MODAL DE ELIMINACIÓN
// ============================================
window.abrirModalEliminar = (calificacionId) => {
    calificacionIdToDelete = calificacionId;
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';
    
    // Reset radio buttons
    document.querySelectorAll('input[name="deleteType"]').forEach(radio => {
        radio.checked = radio.value === 'logical';
    });
};

// ============================================
// CERRAR MODAL
// ============================================
window.cerrarModal = () => {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
    calificacionIdToDelete = null;
};

// ============================================
// CONFIRMAR ELIMINACIÓN
// ============================================
window.confirmarEliminacion = async () => {
    if (!calificacionIdToDelete) return;
    
    const tipoBorrado = document.querySelector('input[name="deleteType"]:checked').value;
    const esPermanente = tipoBorrado === 'permanent';
    
    const mensaje = esPermanente 
        ? '¿Estás seguro de eliminar permanentemente esta calificación? Esta acción no se puede deshacer.'
        : '¿Estás seguro de eliminar esta calificación? Podrás recuperarla después.';
    
    const confirmar = await confirmAction(mensaje);
    
    if (confirmar) {
        try {
            if (esPermanente) {
                await permanentDeleteCalificacion(calificacionIdToDelete);
                await sweetAlert(1, 'Calificación eliminada permanentemente', true);
            } else {
                await deleteCalificacion(calificacionIdToDelete);
                await sweetAlert(1, 'Calificación eliminada correctamente', true);
            }
            
            cerrarModal();
            await cargarCalificaciones();
        } catch (error) {
            console.error('Error al eliminar calificación:', error);
            await sweetAlert(2, error.message || 'Error al eliminar la calificación', false);
        }
    }
};

// ============================================
// CARGAR CALIFICACIONES
// ============================================
const cargarCalificaciones = async () => {
    try {
        const response = await getAllCalificaciones(0, 100);
        calificacionesData = response.content || response;
        renderizarEvaluaciones(calificacionesData);
    } catch (error) {
        console.error('Error al cargar calificaciones:', error);
        await sweetAlert(2, 'Error al cargar las calificaciones', false);
    }
};

// ============================================
// BUSCAR/FILTRAR
// ============================================
const buscarCalificaciones = () => {
    const termino = document.getElementById('buscador').value.toLowerCase().trim();
    
    if (!termino) {
        renderizarEvaluaciones(calificacionesData);
        return;
    }
    
    const filtradas = calificacionesData.filter(cal => {
        const evaluacion = cal.evaluacion.nombre.toLowerCase();
        const estudiante = cal.estudiante.usuario.nombre.toLowerCase();
        const carnet = cal.estudiante.codigoEstudiante.toLowerCase();
        const materia = cal.evaluacion.curso.asignatura.nombre.toLowerCase();
        
        return evaluacion.includes(termino) || 
               estudiante.includes(termino) || 
               carnet.includes(termino) || 
               materia.includes(termino);
    });
    
    renderizarEvaluaciones(filtradas);
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Aplicar modo oscuro
    if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.classList.add("dark");
    }
    
    // Cargar menú
    try {
        const menuResponse = await fetch("../vista/menu.html");
        const menuData = await menuResponse.text();
        document.getElementById("menu").innerHTML = menuData;
        
        const script = document.createElement("script");
        script.type = "module";
        script.src = "../controladores/js/menu.js";
        document.body.appendChild(script);
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
    
    // Event listeners
    document.getElementById('btnBuscar').addEventListener('click', buscarCalificaciones);
    document.getElementById('buscador').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            buscarCalificaciones();
        }
    });
    
    // Cargar calificaciones
    await cargarCalificaciones();
});

