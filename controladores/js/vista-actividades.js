// Importar servicios
import { getAllActividades } from '../services/actividad.service.js';
import { getImageUrl, getDocumentUrl } from '../utils/fileUrl.js';
import { sweetAlert } from '../utils/sweetAlert.js';

// Variables globales
let actividadesCargadas = [];
let asignaturaSeleccionada = '';

// ============================================
// FORMATEO DE FECHAS
// ============================================
const formatearFecha = (fechaISO) => {
    if (!fechaISO) return 'No especificada';
    
    const fecha = new Date(fechaISO);
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return fecha.toLocaleDateString('es-ES', opciones);
};

// ============================================
// RENDERIZADO DE ACTIVIDADES
// ============================================
const renderizarActividad = (actividad) => {
    const imagenUrl = getImageUrl(actividad.imagenUrl);
    const documentoUrl = getDocumentUrl(actividad.documentoUrl);
    const nombreDocumento = actividad.documentoNombre || 'Documento de actividad';
    
    // Determinar estado de la actividad
    const ahora = new Date();
    const fechaApertura = new Date(actividad.fechaApertura);
    const fechaCierre = new Date(actividad.fechaCierre);
    
    let estadoClase = '';
    let estadoTexto = '';
    
    if (ahora < fechaApertura) {
        estadoClase = 'proxima';
        estadoTexto = '📅 Próximamente';
    } else if (ahora > fechaCierre) {
        estadoClase = 'cerrada';
        estadoTexto = '🔒 Cerrada';
    } else {
        estadoClase = 'abierta';
        estadoTexto = '✅ Abierta';
    }
    
    return `
        <div class="card ${estadoClase}" data-actividad-id="${actividad.id}">
            <div class="card-img-act">
                <img src="${imagenUrl}" alt="${actividad.titulo}">
                <span class="estado-badge ${estadoClase}">${estadoTexto}</span>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h3>${actividad.titulo}</h3>
                    <p class="profesor-nombre">👤 ${actividad.profesor.usuario.nombre}</p>
                </div>
                <p><strong>Descripción de actividad:</strong> ${actividad.descripcion}</p>
                
                ${documentoUrl ? `
                    <a href="${documentoUrl}" download="${nombreDocumento}" class="btn-descargar">
                        <img src="../recursos/img/document-icon-img.png" alt="icono" class="icono-descargar">
                        Descargar ${nombreDocumento}
                    </a>
                ` : '<p class="sin-documento">📄 Sin documento adjunto</p>'}

                <hr class="style-one">
                <div class="footer">
                    <p><strong>Abre:</strong> ${formatearFecha(actividad.fechaApertura)}</p>
                    <hr>
                    <p><strong>Cierra:</strong> ${formatearFecha(actividad.fechaCierre)}</p>
                    <button class="btn-view btn-eliminar" data-id="${actividad.id}">Eliminar</button>
                    <a href="../vista/editar-actividad.html?id=${actividad.id}" class="btn-view">Editar</a>
                </div>
            </div>
        </div>
    `;
};

// ============================================
// AGRUPAR ACTIVIDADES POR ASIGNATURA
// ============================================
const agruparPorAsignatura = (actividades) => {
    const grupos = {};
    
    actividades.forEach(actividad => {
        const asignaturaId = actividad.asignatura.id;
        const asignaturaNombre = actividad.asignatura.nombre;
        
        if (!grupos[asignaturaId]) {
            grupos[asignaturaId] = {
                id: asignaturaId,
                nombre: asignaturaNombre,
                actividades: []
            };
        }
        
        grupos[asignaturaId].actividades.push(actividad);
    });
    
    return Object.values(grupos);
};

// ============================================
// RENDERIZAR GRUPOS DE ACTIVIDADES
// ============================================
const renderizarGrupos = (grupos) => {
    const container = document.querySelector('.container-materia');
    
    if (grupos.length === 0) {
        container.innerHTML = `
            <div class="sin-actividades">
                <h2>📚 No hay actividades disponibles</h2>
                <p>Aún no se han creado actividades para mostrar.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = grupos.map(grupo => `
        <div class="grupo-asignatura" data-asignatura-id="${grupo.id}">
            <h2>${grupo.nombre}</h2>
            <div class="cards-grid">
                ${grupo.actividades.map((actividad, index) => {
                    const separator = index < grupo.actividades.length - 1 ? '<hr class="style-two">' : '';
                    return renderizarActividad(actividad) + separator;
                }).join('')}
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners para botones de eliminar
    agregarEventListenersEliminar();
};

// ============================================
// CARGAR ACTIVIDADES DESDE LA API
// ============================================
const cargarActividades = async () => {
    try {
        const response = await getAllActividades(0, 100); // Cargar hasta 100 actividades
        actividadesCargadas = response.content || [];
        
        // Filtrar por asignatura si hay una seleccionada
        let actividadesFiltradas = actividadesCargadas;
        if (asignaturaSeleccionada) {
            actividadesFiltradas = actividadesCargadas.filter(
                act => act.asignatura.id === asignaturaSeleccionada
            );
        }
        
        // Agrupar y renderizar
        const grupos = agruparPorAsignatura(actividadesFiltradas);
        renderizarGrupos(grupos);
        
        // Llenar el select de asignaturas
        llenarSelectAsignaturas();
        
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        await sweetAlert(2, 'Error al cargar las actividades. Por favor, intenta de nuevo.', false);
    }
};

// ============================================
// LLENAR SELECT DE ASIGNATURAS
// ============================================
const llenarSelectAsignaturas = () => {
    const select = document.querySelector('.fancy-select');
    
    // Obtener asignaturas únicas
    const asignaturasUnicas = [...new Map(
        actividadesCargadas.map(act => [act.asignatura.id, act.asignatura])
    ).values()];
    
    // Limpiar select (mantener la opción por defecto)
    select.innerHTML = '<option value="" selected>Todas las asignaturas</option>';
    
    // Agregar opciones
    asignaturasUnicas.forEach(asignatura => {
        const option = document.createElement('option');
        option.value = asignatura.id;
        option.textContent = asignatura.nombre;
        select.appendChild(option);
    });
};

// ============================================
// FILTRAR POR ASIGNATURA
// ============================================
const filtrarPorAsignatura = () => {
    const select = document.querySelector('.fancy-select');
    
    select.addEventListener('change', (e) => {
        asignaturaSeleccionada = e.target.value;
        
        // Filtrar actividades
        let actividadesFiltradas = actividadesCargadas;
        if (asignaturaSeleccionada) {
            actividadesFiltradas = actividadesCargadas.filter(
                act => act.asignatura.id === asignaturaSeleccionada
            );
        }
        
        // Re-renderizar
        const grupos = agruparPorAsignatura(actividadesFiltradas);
        renderizarGrupos(grupos);
    });
};

// ============================================
// ELIMINAR ACTIVIDAD
// ============================================
const agregarEventListenersEliminar = () => {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const actividadId = e.target.dataset.id;
            
            // Confirmar eliminación
            const confirmar = await swal({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará la actividad de forma permanente.',
                icon: 'warning',
                buttons: ['Cancelar', 'Sí, eliminar'],
                dangerMode: true
            });
            
            if (confirmar) {
                try {
                    // Importar dinámicamente el servicio de eliminación
                    const { deleteActividad } = await import('../services/actividad.service.js');
                    await deleteActividad(actividadId);
                    
                    await sweetAlert(1, 'Actividad eliminada correctamente', true);
                    
                    // Recargar actividades
                    await cargarActividades();
                    
                } catch (error) {
                    console.error('Error al eliminar actividad:', error);
                    await sweetAlert(2, 'Error al eliminar la actividad. Por favor, intenta de nuevo.', false);
                }
            }
        });
    });
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Aplicar modo oscuro si está activado
    if (localStorage.getItem("darkMode") === "true") {
        document.documentElement.classList.add("dark");
    }
    
    // Cargar actividades
    await cargarActividades();
    
    // Configurar filtro de asignaturas
    filtrarPorAsignatura();
});
