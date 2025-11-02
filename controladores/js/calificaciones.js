// calificaciones.js

// Datos simulados por grado
const grados = {
  "7A": [
    { id: "7A-001", nombre: "Juan", apellido: "Pérez", grado: "7°", seccion: "A", cum: 8.5 },
    { id: "7A-002", nombre: "María", apellido: "López", grado: "7°", seccion: "A", cum: 9.0 },
    { id: "7A-003", nombre: "Andrés", apellido: "Castro", grado: "7°", seccion: "A", cum: 7.8 },
    { id: "7A-004", nombre: "Laura", apellido: "Gómez", grado: "7°", seccion: "A", cum: 8.9 },
    { id: "7A-005", nombre: "Diego", apellido: "Hernández", grado: "7°", seccion: "A", cum: 8.2 },
    { id: "7A-006", nombre: "Carla", apellido: "Ruiz", grado: "7°", seccion: "A", cum: 9.1 }
  ],
  "7B": [
    { id: "7B-001", nombre: "Ana", apellido: "Martínez", grado: "7°", seccion: "B", cum: 8.7 },
    { id: "7B-002", nombre: "Luis", apellido: "Gómez", grado: "7°", seccion: "B", cum: 7.9 },
    { id: "7B-003", nombre: "Sofía", apellido: "Ramírez", grado: "7°", seccion: "B", cum: 9.2 }
  ],
  "8D": [
    { id: "8D-001", nombre: "Pedro", apellido: "Díaz", grado: "8°", seccion: "D", cum: 8.3 },
    { id: "8D-002", nombre: "Valeria", apellido: "Morales", grado: "8°", seccion: "D", cum: 8.8 },
    { id: "8D-003", nombre: "Javier", apellido: "Fernández", grado: "8°", seccion: "D", cum: 7.5 },
    { id: "8D-004", nombre: "Isabel", apellido: "Torres", grado: "8°", seccion: "D", cum: 9.0 }
  ],
  "9": [
    { id: "9-001", nombre: "Miguel", apellido: "Rojas", grado: "9°", seccion: "A", cum: 8.6 },
    { id: "9-002", nombre: "Lucía", apellido: "Vargas", grado: "9°", seccion: "A", cum: 9.3 },
    { id: "9-003", nombre: "Felipe", apellido: "Silva", grado: "9°", seccion: "A", cum: 7.7 },
    { id: "9-004", nombre: "Camila", apellido: "Ortiz", grado: "9°", seccion: "A", cum: 8.9 }
  ]
};

function generarTablas() {
  const contenedor = document.getElementById('tablasGrados');
  const ordenGrados = ["7A", "7B", "8D", "9"];
  
  let gridHTML = `<div class="tablas-grid">`;
  ordenGrados.forEach(grado => {
    if (grados[grado]) { 
      const estudiantes = grados[grado];
      const nombreGrado = getNombreGrado(grado);
      
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
                  <th>CUM</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${estudiantes.map(est => `
                  <tr>
                    <td>${est.nombre} ${est.apellido}</td>
                    <td>${est.grado}</td>
                    <td>${est.seccion}</td>
                    <td>${est.cum.toFixed(1)}</td>
                    <td><button class="btn-detalle" onclick="verDetalle('${est.id}')">Detalles</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
  });
  
  gridHTML += `</div>`;
  
  contenedor.innerHTML = gridHTML;
}

function getNombreGrado(id) {
  switch(id) {
    case "7A": return "7° Grado A";
    case "7B": return "7° Grado B";
    case "8D": return "8° Grado D";
    case "9": return "9° Grado";
    default: return id;
  }
}

function verDetalle(id) {
  localStorage.setItem('estudianteId', id);
  window.location.href = 'perfil-estudiante.html';
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.documentElement.classList.add("dark");
  }

  generarTablas();

  // Cargar menú
  fetch("../vista/menu.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("menu").innerHTML = data;
      const script = document.createElement("script");
      script.src = "../controladores/js/menu.js";
      document.body.appendChild(script);
    });
});