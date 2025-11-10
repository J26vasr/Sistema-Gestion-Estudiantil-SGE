// bloques-horarios.js
import { sweetAlert } from '../utils/sweetAlert.js';
import { getBloquesOrdenados } from '../services/bloqueHorario.service.js';
import { getAllHorarios } from '../services/horarioCurso.service.js';

let bloquesHorario = [];
let todosLosHorarios = [];

// Cargar horario al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await cargarTodosLosHorarios();
    configurarEventos();
});

// Función para normalizar respuesta de la API
function normalizeResponse(res) {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.content && Array.isArray(res.content)) return res.content;
    if (res.data && Array.isArray(res.data)) return res.data;
    for (const v of Object.values(res)) {
        if (Array.isArray(v)) return v;
    }
    return [];
}

// Función para formatear hora (HH:MM:SS -> HH:MM)
function formatearHora(hora) {
    if (!hora) return '';
    
    // Convertir a string si viene como objeto
    const horaStr = String(hora);
    
    // Si viene en formato HH:MM:SS, quitar los segundos
    if (horaStr.length === 8 && horaStr.includes(':')) {
        return horaStr.substring(0, 5);
    }
    
    // Si viene en formato HH:MM
    if (horaStr.length === 5 && horaStr.includes(':')) {
        return horaStr;
    }
    
    // Si es un array (LocalTime de Java puede venir como [H, M, S])
    if (Array.isArray(hora) && hora.length >= 2) {
        const h = String(hora[0]).padStart(2, '0');
        const m = String(hora[1]).padStart(2, '0');
        return `${h}:${m}`;
    }
    
    return horaStr;
}

// Mapeo de días
const diasSemana = {
    'LUN': 0,
    'LUNES': 0,
    'MAR': 1,
    'MARTES': 1,
    'MIE': 2,
    'MIERCOLES': 2,
    'MIÉRCOLES': 2,
    'JUE': 3,
    'JUEVES': 3,
    'VIE': 4,
    'VIERNES': 4,
    'SAB': 5,
    'SABADO': 5,
    'SÁBADO': 5,
    'DOM': 6,
    'DOMINGO': 6
};

// Colores para diferentes cursos
const coloresCursos = [
    'linear-gradient(135deg, #b98dd4 0%, #c9a0e0 100%)', // Morado claro
    'linear-gradient(135deg, #9d7dff 0%, #b98dd4 100%)', // Morado medio
    'linear-gradient(135deg, #8b5fbf 0%, #a67bc7 100%)', // Morado oscuro
    'linear-gradient(135deg, #c9a0e0 0%, #dbb8f0 100%)', // Morado muy claro
    'linear-gradient(135deg, #a582ce 0%, #b98dd4 100%)', // Morado intermedio
];

// Función principal para cargar todos los horarios
async function cargarTodosLosHorarios() {
    const tbody = document.querySelector('.tabla-horario tbody');
    
    try {
        // Mostrar loading
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#999;">Cargando horarios...</td></tr>';

        // 1. Cargar bloques de horario ordenados
        const bloquesResponse = await getBloquesOrdenados();
        bloquesHorario = normalizeResponse(bloquesResponse);

        if (bloquesHorario.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#ff4444;">No hay bloques de horario registrados.</td></tr>';
            await sweetAlert(2, 'No hay bloques de horario en la base de datos', false);
            return;
        }

        console.log('✅ Bloques de horario cargados:', bloquesHorario.length);
        console.log('📋 Primer bloque:', bloquesHorario[0]);

        // 2. Cargar TODOS los horarios de cursos (page=0, size=50)
        const horariosResponse = await getAllHorarios(0, 50);
        todosLosHorarios = normalizeResponse(horariosResponse);

        console.log('✅ Horarios de cursos cargados:', todosLosHorarios.length);
        console.log('📊 Datos de horarios:', todosLosHorarios);

        // 3. Renderizar la tabla con todos los horarios
        renderizarTablaConTodosLosHorarios();

    } catch (error) {
        console.error('❌ Error al cargar los horarios:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:2rem;">
                    <p style="color:#ff4444; margin-bottom:1rem;">Error al cargar los horarios</p>
                    <p style="color:#999; font-size:0.9rem; margin-bottom:1rem;">${error.message || 'Error desconocido'}</p>
                    <button onclick="location.reload()" style="background:#8b5fbf; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;">
                        Reintentar
                    </button>
                </td>
            </tr>
        `;
        await sweetAlert(2, 'No se pudieron cargar los horarios. Verifica tu conexión.', false);
    }
}


// Función para renderizar la tabla con todos los horarios
function renderizarTablaConTodosLosHorarios() {
    const tbody = document.querySelector('.tabla-horario tbody');
    tbody.innerHTML = '';

    // Crear un mapa de cursos únicos para asignar colores
    const cursosUnicos = new Map();
    let colorIndex = 0;
    
    todosLosHorarios.forEach(horario => {
        const cursoId = horario.curso?.id;
        if (cursoId && !cursosUnicos.has(cursoId)) {
            cursosUnicos.set(cursoId, {
                color: coloresCursos[colorIndex % coloresCursos.length],
                nombre: horario.curso?.asignatura?.nombre || 
                       horario.curso?.nombreGrupo || 
                       'Sin nombre'
            });
            colorIndex++;
        }
    });

    console.log('🎨 Cursos únicos encontrados:', cursosUnicos.size);

    // Renderizar cada bloque de horario
    bloquesHorario.forEach((bloque, bloqueIndex) => {
        const tr = document.createElement('tr');
        
        // Celda de hora
        const tdHora = document.createElement('td');
        tdHora.className = 'celda-hora';
        
        // Obtener horas del bloque - ACTUALIZADO para leer 'inicio' y 'fin'
        const horaInicio = bloque.inicio || bloque.horaInicio || bloque.hora_inicio || '';
        const horaFin = bloque.fin || bloque.horaFin || bloque.hora_fin || '';
        
        const horaInicioFormateada = formatearHora(horaInicio);
        const horaFinFormateada = formatearHora(horaFin);
        
        console.log(`📅 Bloque ${bloqueIndex}:`, {
            inicio: bloque.inicio,
            fin: bloque.fin,
            inicioFormateado: horaInicioFormateada,
            finFormateado: horaFinFormateada
        });
        
        // Mostrar hora de inicio y hora fin en el formato deseado
        if (horaInicioFormateada && horaFinFormateada) {
            tdHora.innerHTML = `<div style="font-weight: 700; font-size: 1rem; color: #6b4a8e; line-height: 1.4;">${horaInicioFormateada} - ${horaFinFormateada}</div>`;
        } else if (bloque.nombre) {
            // Si el bloque tiene un nombre, mostrarlo con las horas si existen
            if (horaInicioFormateada || horaFinFormateada) {
                tdHora.innerHTML = `<div style="font-weight: 600; font-size: 0.9rem; color: #6b4a8e; margin-bottom: 4px;">${bloque.nombre}</div><div style="font-weight: 700; font-size: 0.95rem; color: #8b5fbf;">${horaInicioFormateada} - ${horaFinFormateada}</div>`;
            } else {
                tdHora.innerHTML = `<div style="font-weight: 600; font-size: 0.95rem; color: #6b4a8e;">${bloque.nombre}</div>`;
            }
        } else {
            // Fallback por defecto
            tdHora.innerHTML = `<div style="font-weight: 600; font-size: 0.95rem; color: #6b4a8e;">Bloque ${bloqueIndex + 1}</div>`;
        }
        
        tr.appendChild(tdHora);

        // Celdas para cada día de la semana (Lunes a Viernes)
        for (let diaIndex = 0; diaIndex < 5; diaIndex++) {
            const td = document.createElement('td');
            td.className = 'celda-vacia';
            td.dataset.bloqueId = bloque.id;
            td.dataset.bloqueIndex = bloqueIndex;
            td.dataset.dia = diaIndex;

            // Buscar TODOS los horarios que coincidan con este bloque y día
            const diaKeys = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE'];
            const diaActual = diaKeys[diaIndex];
            
            const horariosEncontrados = todosLosHorarios.filter(horario => {
                const horarioDia = (horario.dia || horario.diaSemana || '').toUpperCase().trim();
                const horarioBloqueId = horario.bloqueHorario?.id || horario.bloqueHorarioId;
                
                // Mapear el día al índice correcto
                const diaMatch = diasSemana[horarioDia] === diaIndex || horarioDia === diaActual;
                const bloqueMatch = horarioBloqueId === bloque.id;
                
                return diaMatch && bloqueMatch;
            });

            if (horariosEncontrados.length > 0) {
                // Hay una o más clases en este horario
                const contenidoCelda = [];
                
                horariosEncontrados.forEach(horario => {
                    const nombreCurso = horario.curso?.asignatura?.nombre || 
                                       horario.curso?.nombreGrupo || 
                                       'Sin nombre';
                    const aula = horario.aula || horario.curso?.aulaDefault || '';
                    const cursoInfo = cursosUnicos.get(horario.curso?.id);
                    
                    if (aula) {
                        contenidoCelda.push(`${nombreCurso} - ${aula}`);
                    } else {
                        contenidoCelda.push(nombreCurso);
                    }
                });

                // Si hay múltiples clases en el mismo horario
                if (horariosEncontrados.length > 1) {
                    td.innerHTML = contenidoCelda.map((texto, idx) => 
                        `<div style="margin-bottom: ${idx < contenidoCelda.length - 1 ? '5px' : '0'}; padding: 3px; background: rgba(255,255,255,0.2); border-radius: 5px;">${texto}</div>`
                    ).join('');
                } else {
                    td.textContent = contenidoCelda[0];
                }
                
                td.classList.remove('celda-vacia');
                td.classList.add('celda-ocupada');
                
                // Asignar color del primer curso encontrado
                const cursoInfo = cursosUnicos.get(horariosEncontrados[0].curso?.id);
                td.style.background = cursoInfo?.color || coloresCursos[0];
                td.style.color = 'white';
                td.style.fontWeight = '600';
                td.style.fontSize = horariosEncontrados.length > 1 ? '0.85rem' : '0.9rem';
                td.style.whiteSpace = 'pre-line';
                td.style.padding = '12px 8px';
                td.style.lineHeight = '1.3';
                td.style.cursor = 'pointer';
                
                // Tooltip con información detallada
                const tooltipTexto = horariosEncontrados.map(h => {
                    const nombre = h.curso?.asignatura?.nombre || h.curso?.nombreGrupo || 'Sin nombre';
                    const aula = h.aula || h.curso?.aulaDefault || 'Sin aula';
                    const profesor = h.curso?.profesor?.usuario?.nombre || 'Sin profesor';
                    return `${nombre}\nAula: ${aula}\nProfesor: ${profesor}`;
                }).join('\n\n');
                
                td.title = tooltipTexto;
                
                // Evento click para ver detalles
                td.addEventListener('click', () => {
                    mostrarDetallesClase(horariosEncontrados);
                });
            }

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    });

    console.log('✅ Tabla renderizada con', todosLosHorarios.length, 'horarios distribuidos');
}

// Función para mostrar detalles de una clase
async function mostrarDetallesClase(horarios) {
    if (horarios.length === 0) return;
    
    const detalles = horarios.map(h => {
        const nombre = h.curso?.asignatura?.nombre || h.curso?.nombreGrupo || 'Sin nombre';
        const aula = h.aula || h.curso?.aulaDefault || 'Sin aula';
        const profesor = h.curso?.profesor?.usuario?.nombre || 'Sin profesor';
        const periodo = h.curso?.periodo?.nombre || 'Sin periodo';
        return `📚 ${nombre}\n🚪 Aula: ${aula}\n👨‍🏫 Profesor: ${profesor}\n📅 Periodo: ${periodo}`;
    }).join('\n\n---\n\n');
    
    alert(detalles);
}

// Función para agregar una clase al horario (deprecated)
async function agregarClase(bloqueIndex, diaIndex, celda) {
    await sweetAlert(3, 'Los horarios se cargan automáticamente desde la base de datos', false);
}


// Configurar eventos adicionales
function configurarEventos() {
    // Botón compartir
    const btnCompartir = document.querySelector('.compartir-btn button');
    if (btnCompartir) {
        btnCompartir.addEventListener('click', compartirHorario);
    }
}

// Función para compartir horario
async function compartirHorario() {
    try {
        // Obtener la URL actual
        const url = window.location.href;
        
        // Copiar al portapapeles
        await navigator.clipboard.writeText(url);
        
        await sweetAlert(1, 'Enlace copiado al portapapeles', false);
    } catch (error) {
        console.error('Error al copiar:', error);
        await sweetAlert(2, 'No se pudo copiar el enlace', false);
    }
}
