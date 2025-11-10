// bloques-horarios.js
import { sweetAlert } from '../utils/sweetAlert.js';

// Definir los bloques de horario (puedes ajustar según tu necesidad)
const bloquesHorario = [
    '7:00 - 8:00',
    '8:00 - 9:00',
    '9:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00'
];

// Cargar horario al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarHorario();
    configurarEventos();
});

// Función para cargar el horario
function cargarHorario() {
    const tbody = document.querySelector('.tabla-horario tbody');
    tbody.innerHTML = '';

    bloquesHorario.forEach((bloque, index) => {
        const tr = document.createElement('tr');
        
        // Celda de hora
        const tdHora = document.createElement('td');
        tdHora.className = 'celda-hora';
        tdHora.textContent = bloque;
        tr.appendChild(tdHora);

        // Celdas para cada día de la semana (Lunes a Viernes)
        for (let dia = 0; dia < 5; dia++) {
            const td = document.createElement('td');
            td.className = 'celda-vacia';
            td.dataset.bloque = index;
            td.dataset.dia = dia;
            
            // Agregar evento click para agregar clase
            td.addEventListener('click', () => {
                agregarClase(index, dia, td);
            });

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    });
}

// Función para agregar una clase al horario
async function agregarClase(bloqueIndex, diaIndex, celda) {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const bloque = bloquesHorario[bloqueIndex];
    const dia = dias[diaIndex];

    // Mostrar mensaje (puedes reemplazar con un modal más elaborado)
    const nombreClase = prompt(`Agregar clase para ${dia} - ${bloque}\n\nIngresa el nombre de la materia:`);
    
    if (nombreClase && nombreClase.trim() !== '') {
        celda.textContent = nombreClase;
        celda.classList.remove('celda-vacia');
        celda.classList.add('celda-ocupada');
        celda.style.background = 'linear-gradient(135deg, #b98dd4 0%, #c9a0e0 100%)';
        celda.style.color = 'white';
        celda.style.fontWeight = '600';
        celda.style.cursor = 'default';
        
        await sweetAlert(1, `Clase agregada: ${nombreClase}`, false);
    }
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

// Función para guardar horario en localStorage (opcional)
function guardarHorario() {
    const celdas = document.querySelectorAll('.tabla-horario tbody td:not(.celda-hora)');
    const horarioData = [];

    celdas.forEach(celda => {
        if (celda.textContent.trim() !== '') {
            horarioData.push({
                bloque: celda.dataset.bloque,
                dia: celda.dataset.dia,
                materia: celda.textContent
            });
        }
    });

    localStorage.setItem('horario', JSON.stringify(horarioData));
}

// Función para cargar horario desde localStorage (opcional)
function cargarHorarioGuardado() {
    const horarioGuardado = localStorage.getItem('horario');
    
    if (horarioGuardado) {
        const horarioData = JSON.parse(horarioGuardado);
        
        horarioData.forEach(item => {
            const celda = document.querySelector(
                `.tabla-horario tbody td[data-bloque="${item.bloque}"][data-dia="${item.dia}"]`
            );
            
            if (celda) {
                celda.textContent = item.materia;
                celda.classList.remove('celda-vacia');
                celda.classList.add('celda-ocupada');
                celda.style.background = 'linear-gradient(135deg, #b98dd4 0%, #c9a0e0 100%)';
                celda.style.color = 'white';
                celda.style.fontWeight = '600';
            }
        });
    }
}
