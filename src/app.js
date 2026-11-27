import { enviarIntento } from "./apiMock.js";

// Registrar Service Worker para PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

const encontrados = new Set();
const tokens = document.querySelectorAll(".token");
const foundCounter = document.getElementById("found-counter");
const foundBar = document.getElementById("found-bar");
const betoMsg = document.getElementById("beto-msg");
const btnToResolver = document.getElementById("btn-to-resolver");
const screenTitle = document.getElementById("screen-title");

// Lógica Pantalla 4: Entender
tokens.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    encontrados.add(id);
    btn.classList.add("found");

    const item = document.querySelector(`[data-check="${id}"]`);
    if (item) item.classList.replace("pending", "done");

    const total = encontrados.size;
    foundCounter.textContent = `${total} de 4`;
    foundBar.style.width = `${(total / 4) * 100}%`;

    if (total === 4) {
      betoMsg.innerHTML = "¿Los dos gastos salen <strong>del mismo dinero</strong>? Piénsalo antes de calcular.";
      btnToResolver.disabled = false;
    }
  });
});

// Navegación básica
function mostrarVista(nombre) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById(`view-${nombre}`).classList.add("active");
  screenTitle.textContent = nombre === "entender" ? "Entender" : "Resolver";

  document.querySelectorAll(".polya-bar .step").forEach((s) => {
    s.classList.toggle("active", s.dataset.step === nombre);
  });
}

btnToResolver.addEventListener("click", () => mostrarVista("resolver"));
document.getElementById("btn-back-entender").addEventListener("click", () => mostrarVista("entender"));

// Lógica Pantalla 5: Pasos + Comprobar + Candado de pistas
const pasos = [];
let pistasUsadas = 0;
let pasoNuevoDespuesDePista = false;

const stepsList = document.getElementById("steps-list");
const inputPaso = document.getElementById("input-paso");
const btnAddPaso = document.getElementById("btn-add-paso");
const inputRespuesta = document.getElementById("input-respuesta");
const btnEnviar = document.getElementById("btn-enviar");
const statusMsg = document.getElementById("status-msg");

const hintPanel = document.getElementById("hint-panel");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackText = document.getElementById("feedback-text");
const lockBox = document.getElementById("lock-box");
const btnNextHint = document.getElementById("btn-next-hint");
const hintCount = document.getElementById("hint-count");

function renderPasos() {
  stepsList.innerHTML = pasos.map((p, i) => `<li>${i + 1}. ${p}</li>`).join("");
}

btnAddPaso.addEventListener("click", () => {
  const texto = inputPaso.value.trim();
  if (!texto) return;
  pasos.push(texto);
  inputPaso.value = "";
  renderPasos();

  // Si había una pista bloqueada, al escribir un paso nuevo se desbloquea
  if (pistasUsadas > 0 && !pasoNuevoDespuesDePista) {
    pasoNuevoDespuesDePista = true;
    lockBox.classList.add("hidden");
    btnNextHint.classList.remove("hidden");
  }
});

async function consultarTutor() {
  const respuesta = inputRespuesta.value.trim() || "sin_respuesta";
  btnEnviar.disabled = true;
  btnNextHint.disabled = true;

  const res = await enviarIntento({
    estudiante: "EST-014",
    reto: "P8-RESTO-01",
    paso_polya: "resolver",
    fase: "simbolizar",
    intento: pistasUsadas + 1,
    respuesta,
    pasos,
  });

  hintPanel.classList.remove("hidden");
  statusMsg.classList.remove("hidden", "ok", "bad");

  if (res.correcto) {
    statusMsg.textContent = "✓ ¡Correcto! Sofía tenía $48.";
    statusMsg.classList.add("ok");
    feedbackTitle.textContent = "¡Reto resuelto!";
    feedbackText.textContent = res.beto.dice;
    lockBox.classList.add("hidden");
    btnNextHint.classList.add("hidden");
  } else {
    pistasUsadas = res.escalon;
    pasoNuevoDespuesDePista = false;
    hintCount.textContent = `${pistasUsadas}/5`;

    statusMsg.textContent = "Todavía no. Revisa la pista de Beto.";
    statusMsg.classList.add("bad");
    feedbackTitle.textContent = `Pista ${pistasUsadas} de 5`;
    feedbackText.textContent = res.beto.dice;

    lockBox.classList.remove("hidden");
    btnNextHint.classList.add("hidden");
  }

  btnEnviar.disabled = false;
  btnNextHint.disabled = false;
}

btnEnviar.addEventListener("click", consultarTutor);
btnNextHint.addEventListener("click", consultarTutor);

document.getElementById("btn-to-barras").addEventListener("click", () => {
  alert("Siguiente paso: Pantalla 6 y 7 (Visualizar con barras).");
});