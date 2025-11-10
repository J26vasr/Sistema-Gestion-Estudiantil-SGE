const monthAndYear = document.getElementById("monthAndYear");
const calendarBody = document.getElementById("calendar-body");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = null;

// ========== FUNCIONES DE LOCALSTORAGE ==========

/**
 * Obtiene todas las actividades guardadas en localStorage
 * @returns {Array} Array de objetos con las actividades
 */
function obtenerActividades() {
  const actividades = localStorage.getItem('actividadesAgenda');
  return actividades ? JSON.parse(actividades) : [];
}

/**
 * Guarda una nueva actividad en localStorage
 * @param {Object} actividad - Objeto con fecha, hora, descripcion, prioridad
 */
function guardarActividad(actividad) {
  const actividades = obtenerActividades();
  actividades.push({
    ...actividad,
    id: Date.now() // ID único basado en timestamp
  });
  localStorage.setItem('actividadesAgenda', JSON.stringify(actividades));
}

/**
 * Elimina una actividad por su ID
 * @param {number} id - ID de la actividad a eliminar
 */
function eliminarActividad(id) {
  let actividades = obtenerActividades();
  actividades = actividades.filter(act => act.id !== id);
  localStorage.setItem('actividadesAgenda', JSON.stringify(actividades));
}

/**
 * Obtiene actividades de una fecha específica
 * @param {Date} fecha - Fecha a buscar
 * @returns {Array} Actividades de esa fecha
 */
function obtenerActividadesPorFecha(fecha) {
  const actividades = obtenerActividades();
  // Normalizar fecha para comparación (día/mes/año)
  const fechaBuscar = fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
  
  return actividades.filter(act => {
    // Normalizar la fecha guardada también
    const fechaAct = new Date(act.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return fechaAct === fechaBuscar || act.fecha === fechaBuscar;
  });
}

// ========== FIN FUNCIONES LOCALSTORAGE ==========

// Llenar selects
for (let i = 0; i < 12; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.text = new Date(0, i).toLocaleString("es", { month: "long" });
  monthSelect.appendChild(option);
}
for (let i = 2020; i <= 2030; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.text = i;
  yearSelect.appendChild(option);
}

document.getElementById("prev").addEventListener("click", () => {
  currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
  if (currentMonth === 11) currentYear--;
  showCalendar(currentMonth, currentYear);
});

document.getElementById("next").addEventListener("click", () => {
  currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
  if (currentMonth === 0) currentYear++;
  showCalendar(currentMonth, currentYear);
});

monthSelect.addEventListener("change", () => {
  currentMonth = parseInt(monthSelect.value);
  showCalendar(currentMonth, currentYear);
});
yearSelect.addEventListener("change", () => {
  currentYear = parseInt(yearSelect.value);
  showCalendar(currentMonth, currentYear);
});

function showCalendar(month, year) {
  calendarBody.innerHTML = "";
  monthAndYear.textContent = `${new Date(year, month).toLocaleString("es", { month: "long", year: "numeric" })}`;
  monthSelect.value = month;
  yearSelect.value = year;

  const firstDay = new Date(year, month).getDay();
  const daysInMonth = 32 - new Date(year, month, 32).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      if (i === 0 && j < firstDay) {
        cell.textContent = "";
      } else if (date > daysInMonth) {
        break;
      } else {
        cell.textContent = date;
        
        // Verificar si hay actividades en esta fecha
        const fechaCell = new Date(year, month, date);
        const actividadesDia = obtenerActividadesPorFecha(fechaCell);
        
        // Debug: mostrar en consola
        if (actividadesDia.length > 0) {
          console.log(`📅 Día ${date}: ${actividadesDia.length} actividad(es)`, actividadesDia);
        }
        
        // Aplicar color según la prioridad más alta del día
        if (actividadesDia.length > 0) {
          const prioridades = actividadesDia.map(a => a.prioridad);
          if (prioridades.includes('alta')) {
            cell.classList.add('alta');
          } else if (prioridades.includes('media')) {
            cell.classList.add('media');
          } else if (prioridades.includes('baja')) {
            cell.classList.add('baja');
          }
        }
        
        cell.addEventListener("click", () => openModal(date, month, year, cell));
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
  
  // Cargar actividades en la tabla
  cargarTablaActividades();
}

// Modal
const modal = document.getElementById("modal");
const cerrar = document.getElementById("cerrar");
const agendar = document.getElementById("agendar");
let selectedCell = null;

function openModal(day, month, year, cell) {
  selectedDate = new Date(year, month, day);
  selectedCell = cell;
  modal.style.display = "block";
}

cerrar.addEventListener("click", () => {
  modal.style.display = "none";
});

agendar.addEventListener("click", () => {
  const actividad = document.getElementById("actividad").value;
  const hora = document.getElementById("hora").value;
  const prioridad = document.getElementById("prioridad").value;

  if (!actividad || !hora) {
    alert("Por favor completa todos los campos");
    return;
  }

  // Guardar en localStorage con formato consistente
  const fechaFormateada = selectedDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
  
  const nuevaActividad = {
    fecha: fechaFormateada,
    hora: hora,
    descripcion: actividad,
    prioridad: prioridad
  };
  
  guardarActividad(nuevaActividad);
  
  console.log('✅ Actividad guardada:', nuevaActividad);

  // Mostrar mensaje de éxito
  if (typeof swal !== 'undefined') {
    swal("¡Actividad agendada!", "La actividad se guardó correctamente", "success");
  } else {
    alert("Actividad agendada correctamente");
  }

  // Actualizar calendario para mostrar el color
  showCalendar(currentMonth, currentYear);

  // Cerrar modal y limpiar campos
  modal.style.display = "none";
  document.getElementById("actividad").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("prioridad").value = "baja";
});

/**
 * Carga todas las actividades en la tabla
 */
function cargarTablaActividades() {
  const tabla = document.querySelector("#tabla-actividades tbody");
  tabla.innerHTML = "";
  
  const actividades = obtenerActividades();
  
  // Ordenar por fecha y hora
  actividades.sort((a, b) => {
    const fechaA = new Date(a.fecha + ' ' + a.hora);
    const fechaB = new Date(b.fecha + ' ' + b.hora);
    return fechaA - fechaB;
  });
  
  if (actividades.length === 0) {
    tabla.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#999;">No hay actividades agendadas</td></tr>';
    return;
  }
  
  actividades.forEach(act => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${act.fecha}</td>
      <td>${act.hora}</td>
      <td>${act.descripcion}</td>
      <td>${act.prioridad.charAt(0).toUpperCase() + act.prioridad.slice(1)}</td>
      <td><button class="btn-eliminar" data-id="${act.id}">🗑️</button></td>
    `;
    tabla.appendChild(fila);
  });
  
  // Agregar eventos para eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      if (confirm('¿Estás seguro de eliminar esta actividad?')) {
        eliminarActividad(id);
        showCalendar(currentMonth, currentYear); // Recargar calendario
      }
    });
  });
}

// Mostrar calendario al cargar
showCalendar(currentMonth, currentYear);
