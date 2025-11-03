// asistencia.js

// Mensaje de inicio para depuración
console.log("Iniciando asistencia.js...");

try {
// Objeto que tiene los datos de los alumnos simulados para las tablas de asistencia
const asistenciaGrados = {
"7A": [
{ id: "7A-001", nombre: "Juan", apellido: "Pérez", grado: "7°", seccion: "A", asistencia: "Presente" },
{ id: "7A-002", nombre: "María", apellido: "López", grado: "7°", seccion: "A", asistencia: "Presente" },
{ id: "7A-003", nombre: "Andrés", apellido: "Castro", grado: "7°", seccion: "A", asistencia: "Presente" },
{ id: "7A-004", nombre: "Laura", apellido: "Gómez", grado: "7°", seccion: "A", asistencia: "Presente" },
{ id: "7A-005", nombre: "Diego", apellido: "Hernández", grado: "7°", seccion: "A", asistencia: "Presente" },
{ id: "7A-006", nombre: "Carla", apellido: "Ruiz", grado: "7°", seccion: "A", asistencia: "Presente" }
],
"7B": [
{ id: "7B-001", nombre: "Ana", apellido: "Martínez", grado: "7°", seccion: "B", asistencia: "Presente" },
{ id: "7B-002", nombre: "Luis", apellido: "Gómez", grado: "7°", seccion: "B", asistencia: "Presente" },
{ id: "7B-003", nombre: "Sofía", apellido: "Ramírez", grado: "7°", seccion: "B", asistencia: "Presente" }
],
"8D": [
{ id: "8D-001", nombre: "Pedro", apellido: "Díaz", grado: "8°", seccion: "D", asistencia: "Ausente" },
{ id: "8D-002", nombre: "Valeria", apellido: "Morales", grado: "8°", seccion: "D", asistencia: "Presente" },
{ id: "8D-003", nombre: "Javier", apellido: "Fernández", grado: "8°", seccion: "D", asistencia: "Tardío" },
{ id: "8D-004", nombre: "Isabel", apellido: "Torres", grado: "8°", seccion: "D", asistencia: "Presente" }
],
"9": [
{ id: "9-001", nombre: "Miguel", apellido: "Rojas", grado: "9°", seccion: "A", asistencia: "Tardío" },
{ id: "9-002", nombre: "Lucía", apellido: "Vargas", grado: "9°", seccion: "A", asistencia: "Presente" },
{ id: "9-003", nombre: "Felipe", apellido: "Silva", grado: "9°", seccion: "A", asistencia: "Ausente" },
{ id: "9-004", nombre: "Camila", apellido: "Ortiz", grado: "9°", seccion: "A", asistencia: "Presente" }
]
};

// Arreglo para definir el orden de las tablas
const ordenGrados = ["7A", "7B", "8D", "9"];

// Función que genera y muestra las tablas de asistencia en la página
function generarTablasAsistencia() {
console.log("generando tablas...");
// contenedor donde se insertarar las tablas
const contenedor = document.getElementById('tablasAsistencia');
// Verifica si el contenedor existe
if (!contenedor) {
console.error("No se encontró el elemento #tablasAsistencia");
return;
}

// Inicia el HTML para el contenedor de tablas usando grid
let gridHTML = `<div class="tablas-grid">`;

// Recorre los grados en el orden definido
ordenGrados.forEach(grado => {
// Verifica si el grado tiene datos
if (asistenciaGrados[grado]) {
const estudiantes = asistenciaGrados[grado];
const nombreGrado = getNombreGrado(grado);

// Construye el HTML para cada tabla de grado
gridHTML += `
<div>
<div class="grado-title">${nombreGrado}</div>
<div class="table-container">
<table>
<thead>
<tr>
<th>Nombre Completo</th>
<th>Grado</th>
<th>Sección</th>
<th>Asistencia</th>
</tr>
</thead>
<tbody>
${estudiantes.map(est => `
<tr>
<td>${est.nombre} ${est.apellido}</td>
<td>${est.grado}</td>
<td>${est.seccion}</td>
<td>
<select class="select-asistencia" data-id="${est.id}">
<option value="Presente" ${est.asistencia === "Presente" ? "selected" : ""}>Presente</option>
<option value="Ausente" ${est.asistencia === "Ausente" ? "selected" : ""}>Ausente</option>
<option value="Tardío" ${est.asistencia === "Tardío" ? "selected" : ""}>Tardío</option>
</select>
</td>
</tr>
`).join('')}
</tbody>
</table>
</div>
</div>
`;
}
});

// Cierra el contenedor grid y lo inserta en la página
gridHTML += `</div>`;
contenedor.innerHTML = gridHTML;

// Asigna los eventos a los botones de control
const btnGuardar = document.getElementById('btnGuardarTodo');
const btnMarcar = document.getElementById('btnMarcarPresentes');

if (btnGuardar) btnGuardar.addEventListener('click', guardarAsistencia);
if (btnMarcar) btnMarcar.addEventListener('click', marcarTodosPresentes);

console.log("Tablas generadas con éxito");
}

// Función que obtiene el nombre legible de un grado a partir de su identificador
function getNombreGrado(id) {
switch(id) {
case "7A": return "7° Grado A";
case "7B": return "7° Grado B";
case "8D": return "8° Grado D";
case "9": return "9° Grado";
default: return id;
}
}

// Función que recopila los cambios y simula el guardado de la asistencia
function guardarAsistencia() {
// Selecciona todos los elementos de tipo select en la página
const selects = document.querySelectorAll('.select-asistencia');
const cambios = [];

// Recorre cada select y guarda su valor
selects.forEach(select => {
cambios.push({
id: select.dataset.id,
estado: select.value
});
});

// Muestra una alerta informativa (en producción se enviaría a una API)
alert(`Asistencia guardada para ${cambios.length} estudiantes.\n(En una versión real, se enviaría a la API)`);
console.log("Asistencia a guardar:", cambios);
}

// Función que marca a todos los estudiantes como presentes
function marcarTodosPresentes() {
const selects = document.querySelectorAll('.select-asistencia');
selects.forEach(select => {
select.value = "Presente";
});
}

// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', () => {
console.log("DOMContentLoaded disparado");
try {
generarTablasAsistencia();
} catch (error) {
console.error("Error al generar tablas:", error);
alert("Hubo un error al cargar la asistencia. Revisa la consola del navegador.");
}
});

} catch (error) {
// Captura cualquier error que ocurra durante la ejecución del script
console.error("Error global en asistencia.js:", error);
alert("Hubo un error crítico al cargar la asistencia. Revisa la consola del navegador.");
}