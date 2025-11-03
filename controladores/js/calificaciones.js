// Crear modal
const modalHTML = `
<div class="modal-overlay" id="modalOverlay">
  <div class="modal">
    <h2>Agregar Nota</h2>
    <p><strong>Seleccione la materia</strong></p>
    <!-- Combobox-->
            <div class="combo-wrap">
                <select class="fancy-select" aria-label="Seleccione una materia">
                    <option value="" disabled selected>Seleccione una materia...</option>
                    <option value="1">Matematicas</option>
                    <option value="2">Ciencias</option>
                    <option value="3">Sociales</option>
                </select>
            </div>
    <p><strong>Escriba el carnet del estudiante a agregar la nota:</strong></p>
     <div class="custom_input">
      <input type="text" name="carnetNota" id="carnetNota" class="input" placeholder="Carnet">
    </div>
    <p><strong>Escriba el tipo de nota (parcial 1, laboratorio 1,...):</strong></p>
    <div class="custom_input">
      <input type="text" name="tipoNota" id="tipoNota" class="input" placeholder="Tipo de nota">
    </div>
    <p><strong>Escriba la nota que obtuvo:</strong></p>
    <div class="custom_input">
      <input type="number" name="nota" id="nota" class="input" placeholder="Nota">
    </div>
    <div class="modal-footer">
      <button id="guardarNota">Guardar</button>
      <button id="cerrarModal">Cancelar</button>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', modalHTML);

// Seleccionar elementos
const abrirModalBtn = document.getElementById('btnAgregarCal');
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


