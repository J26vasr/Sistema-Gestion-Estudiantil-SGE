// Crear modal
const modalHTML = `
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <h2>Agregar Reporte</h2>
    <p><strong>Seleccione el nivel del reporte</strong></p>
    <!-- Combobox-->
            <div class="combo-wrap">
                <select class="fancy-select" aria-label="Seleccione un nivel">
                    <option value="" disabled selected>Seleccione un nivel...</option>
                    <option value="1">Leve</option>
                    <option value="2">Fuerte</option>
                    <option value="3">Grave</option>
                </select>
            </div>
    <p><strong>Escriba el carnet del estudiante a agregar el reporte:</strong></p>
     <div class="custom_input">
      <input type="text" name="carnetRepo" id="carnetRepo" class="input" placeholder="Carnet">
    </div>
    <p><strong>Escriba la razón del reporte:</strong></p>
      <textarea name="razonRepo" id="razonRepo" class="input" placeholder="Razón del reporte"></textarea>
    <div class="modal-footer">
      <button id="guardarNota">Guardar</button>
      <button id="cerrarModal">Cancelar</button>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

// Seleccionar elementos
const abrirModalBtn = document.getElementById('btnAgregarRepo');
const modalOverlay = document.getElementById('modalOverlay');
const cerrarModalBtn = document.getElementById('cerrarModal');

// Abrir modal
abrirModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modalOverlay.style.display = 'flex';
});

// Cerrar modal
cerrarModalBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});


// Constante para que el textArea del modal se expanda el solito
const textarea = document.getElementById('razonRepo');

textarea.addEventListener('input', () => {
    textarea.style.height = 'auto'; // resetea la altura
    textarea.style.height = textarea.scrollHeight + 'px'; // ajusta a contenido
});



// ANIMACION ELIMINAR REPORTE
const fullNotif = document.getElementById('fullNotif');
const btnEliminar = document.getElementById('btnEliminarReporte');
const bgStars = fullNotif.querySelector('.bg-stars');

// Crear 50 partículas para el fondo
for (let i = 0; i < 50; i++) {
    const star = document.createElement('span');
    star.style.left = Math.random() * 100 + 'vw'; // posición horizontal random
    star.style.animationDuration = 2 + Math.random() * 2 + 's'; // duración aleatoria
    star.style.animationDelay = Math.random() * 2 + 's';
    star.style.width = 4 + Math.random() * 6 + 'px'; // tamaño aleatorio
    star.style.height = star.style.width;
    star.style.backgroundColor = `hsl(${270 + Math.random() * 30}, 80%, 80%)`; // tonos morados
    bgStars.appendChild(star);
}

// Mostrar overlay al eliminar
btnEliminar.addEventListener('click', (e) => {
    e.preventDefault();
    fullNotif.classList.add('show');

    setTimeout(() => {
        fullNotif.classList.remove('show');
    }, 4000); // duración total del efecto
});

