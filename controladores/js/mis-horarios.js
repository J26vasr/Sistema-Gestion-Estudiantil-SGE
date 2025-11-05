const monthAndYear = document.getElementById("monthAndYear");
const calendarBody = document.getElementById("calendar-body");
const monthSelect = document.getElementById("month");
const yearSelect = document.getElementById("year");

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = null;

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
        cell.addEventListener("click", () => openModal(date, month, year, cell));
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
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

  // Cambiar color de la celda según prioridad
  selectedCell.classList.remove("alta", "media", "baja");
  selectedCell.classList.add(prioridad);

  // Agregar a tabla
  const tabla = document.querySelector("#tabla-actividades tbody");
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${selectedDate.toLocaleDateString()}</td>
    <td>${hora}</td>
    <td>${actividad}</td>
    <td>${prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}</td>
  `;
  tabla.appendChild(fila);

  modal.style.display = "none";
  document.getElementById("actividad").value = "";
  document.getElementById("hora").value = "";
});

// Mostrar calendario al cargar
showCalendar(currentMonth, currentYear);
