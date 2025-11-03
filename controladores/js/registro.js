
// Evitar escribir números en el campo de nombre
const nombreInput = document.getElementById('nombre');
const nombreError = document.getElementById('nombreError');

nombreInput.addEventListener('keypress', (event) => {
  const char = event.key;
  if (/\d/.test(char)) {
    event.preventDefault(); // bloquea el número
    nombreError.textContent = "No se aceptan números en este campo.";
  } else {
    nombreError.textContent = "";
  }
});

// También limpia el mensaje si el usuario pega texto con números
nombreInput.addEventListener('input', () => {
  if (/\d/.test(nombreInput.value)) {
    nombreInput.value = nombreInput.value.replace(/\d/g, '');
    nombreError.textContent = "No se aceptan números en este campo.";
  } else {
    nombreError.textContent = "";
  }
});


nombreInput.addEventListener('input', () => {
  const regex = /\d/;
  if (regex.test(nombreInput.value)) {
    nombreError.textContent = "No se aceptan números en este campo.";
  } else {
    nombreError.textContent = "";
  }
});

// Validación de contraseña
const form = document.getElementById('registroForm');
const passwordInput = document.getElementById('contraseña');
const confirmInput = document.getElementById('confirmar');

form.addEventListener('submit', (e) => {
  const password = passwordInput.value;
  const confirm = confirmInput.value;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  if (!regexPassword.test(password)) {
    alert("La contraseña no cumple con los requisitos.");
    e.preventDefault();
  } else if (password !== confirm) {
    alert("Las contraseñas no coinciden.");
    e.preventDefault();
  }
});
