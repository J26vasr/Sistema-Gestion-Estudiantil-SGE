const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-swtich"),
  modeText = body.querySelector(".mode-text");

// === Mantener el modo oscuro entre páginas ===
const savedMode = localStorage.getItem("darkMode");
if (savedMode === "true") {
  body.classList.add("dark");
  modeText.innerText = "Modo claro";
} else {
  body.classList.remove("dark");
  modeText.innerText = "Modo oscuro";
}

// === Abrir y cerrar sidebar ===
toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.remove("close");
});

// === Cambiar modo oscuro ===
modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");

  const isDark = body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark); // Guarda el estado

  if (isDark) {
    modeText.innerText = "Modo claro";
  } else {
    modeText.innerText = "Modo oscuro";
  }
});

