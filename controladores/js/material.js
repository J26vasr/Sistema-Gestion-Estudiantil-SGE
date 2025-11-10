// Importar servicios
import { getAllClases, getClasesByCursoId, deleteClase, permanentDeleteClase } from '../services/clase.service.js';
import { sweetAlert, confirmAction } from '../utils/sweetAlert.js';
import { getDocumentUrl } from '../utils/fileUrl.js';

// Variables globales
let clasesData = [];
let claseIdToDelete = null;
let cursoIdFiltro = null; // ID del curso para filtrar

// ============================================
// FORMATEAR FECHA Y HORA
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

const formatearHora = (hora) => {
    if (!hora) return 'Sin hora';
    return hora.substring(0, 5); // HH:MM
};

// ============================================
// RENDERIZAR CLASES
// ============================================
const renderizarClases = (clases) => {
    const contenedor = document.getElementById('clasesContainer');
    
    if (!clases || clases.length === 0) {
        contenedor.innerHTML = `
            <div class="no-data">
                <p>📚 No hay clases registradas</p>
                <p style="font-size: 14px; color: #999; margin-top: 10px;">
                    Haz clic en "Agregar Nueva Clase" para comenzar.
                </p>
            </div>
        `;
        return;
    }
    
    // Agrupar clases por curso (asignatura)
    const clasesPorCurso = {};
    
    clases.forEach(clase => {
        const asignatura = clase.curso?.asignatura?.nombre || 'Sin asignatura';
        const profesor = clase.curso?.profesor?.usuario?.nombre || 'Sin profesor';
        const clave = `${asignatura} - ${profesor}`;
        
        if (!clasesPorCurso[clave]) {
            clasesPorCurso[clave] = [];
        }
        clasesPorCurso[clave].push(clase);
    });
    
    // Renderizar por grupos
    let html = '';
    
    Object.keys(clasesPorCurso).sort().forEach(cursoNombre => {
        const clasesDelCurso = clasesPorCurso[cursoNombre];
        
        html += `
            <div class="curso-section">
                <h2 class="curso-titulo">📘 ${cursoNombre}</h2>
                <div class="clases-grid">
        `;
        
        clasesDelCurso.forEach(clase => {
            const tema = clase.tema?.titulo || 'Sin tema';
            const unidad = clase.tema?.unidad?.titulo || 'Sin unidad';
            const fecha = formatearFecha(clase.fecha);
            const inicio = formatearHora(clase.inicio);
            const fin = formatearHora(clase.fin);
            const notas = clase.notas || 'Sin notas adicionales';
            const documentoNombre = clase.documentoNombre || 'Sin documento';
            const documentoUrl = clase.documentoUrl;
            
            html += `
                <div class="clase-card">
                    <div class="clase-header">
                        <h3>📖 ${tema}</h3>
                        <span class="unidad-badge">${unidad}</span>
                    </div>
                    
                    <div class="clase-info">
                        <p><strong>📅 Fecha:</strong> ${fecha}</p>
                        <p><strong>🕐 Horario:</strong> ${inicio} - ${fin}</p>
                        <p><strong>📝 Notas:</strong> ${notas}</p>
                        ${documentoUrl ? `
                            <p>
                                <strong>📄 Documento:</strong> 
                                <a href="${getDocumentUrl(documentoUrl)}" target="_blank" class="documento-link">
                                    ${documentoNombre}
                                </a>
                            </p>
                        ` : '<p><strong>📄 Documento:</strong> Sin documento</p>'}
                    </div>
                    
                    <div class="clase-actions">
                        <button class="btn-editar" onclick="editarClase('${clase.id}')">
                            ✏️ Editar
                        </button>
                        <button class="btn-eliminar" onclick="abrirModalEliminar('${clase.id}')">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
};

// ============================================
// EDITAR CLASE
// ============================================
window.editarClase = (claseId) => {
    const url = cursoIdFiltro 
        ? `editar-material.html?id=${claseId}&cursoId=${cursoIdFiltro}` 
        : `editar-material.html?id=${claseId}`;
    window.location.href = url;
};

// ============================================
// ABRIR MODAL DE ELIMINACIÓN
// ============================================
window.abrirModalEliminar = (claseId) => {
    claseIdToDelete = claseId;
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';
    
    // Reset radio buttons
    document.getElementById('deleteSoft').checked = false;
    document.getElementById('deletePermanent').checked = false;
};

// ============================================
// CERRAR MODAL
// ============================================
window.cerrarModal = () => {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
    claseIdToDelete = null;
};

// ============================================
// CONFIRMAR ELIMINACIÓN
// ============================================
window.confirmarEliminacion = async () => {
    const tipoEliminacion = document.querySelector('input[name="deleteType"]:checked');
    
    if (!tipoEliminacion) {
        await sweetAlert(3, 'Por favor, selecciona un tipo de eliminación.', false);
        return;
    }
    
    if (!claseIdToDelete) {
        await sweetAlert(2, 'No se especificó la clase a eliminar.', false);
        cerrarModal();
        return;
    }
    
    try {
        const esPermanente = tipoEliminacion.value === 'permanent';
        
        if (esPermanente) {
            await permanentDeleteClase(claseIdToDelete);
            await sweetAlert(1, 'Clase eliminada permanentemente.', false);
        } else {
            await deleteClase(claseIdToDelete);
            await sweetAlert(1, 'Clase eliminada (soft delete).', false);
        }
        
        // Recargar clases
        await cargarClases();
        cerrarModal();
        
    } catch (error) {
        console.error('Error al eliminar clase:', error);
        await sweetAlert(2, 'Error al eliminar la clase. Por favor, intenta de nuevo.', false);
    }
};

// ============================================
// CARGAR CLASES
// ============================================
const cargarClases = async () => {
    try {
        let clasesResponse;
        
        // Si hay cursoId en la URL, filtrar por ese curso
        if (cursoIdFiltro) {
            clasesResponse = await getClasesByCursoId(cursoIdFiltro);
            clasesData = clasesResponse; // getClasesByCursoId retorna array directamente
        } else {
            // Cargar todas las clases
            clasesResponse = await getAllClases(0, 100); // Obtener hasta 100 clases
            clasesData = clasesResponse.content || clasesResponse;
        }
        
        // Filtrar solo clases no eliminadas (soft delete)
        const clasesActivas = clasesData.filter(clase => !clase.deleted);
        
        renderizarClases(clasesActivas);
        
    } catch (error) {
        console.error('Error al cargar clases:', error);
        await sweetAlert(2, 'Error al cargar las clases.', false);
    }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Aplicar modo oscuro
    if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.classList.add("dark");
    }
    
    // Obtener cursoId de la URL si existe
    const params = new URLSearchParams(window.location.search);
    cursoIdFiltro = params.get('cursoId');
    
    // Configurar botón de agregar clase
    const btnAgregar = document.getElementById('btnAgregarClase');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            const url = cursoIdFiltro 
                ? `agregar-material.html?cursoId=${cursoIdFiltro}` 
                : 'agregar-material.html';
            window.location.href = url;
        });
    }
    
    // Cargar clases al inicio
    await cargarClases();
    
    // Cerrar modal al hacer clic fuera de él
    window.onclick = (event) => {
        const modal = document.getElementById('deleteModal');
        if (event.target === modal) {
            cerrarModal();
        }
    };
});
