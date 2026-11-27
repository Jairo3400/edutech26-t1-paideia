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

// Prueba de envío al mock de n8n
const btnEnviar = document.getElementById("btn-enviar");
const inputRespuesta = document.getElementById("input-respuesta");
const feedbackBox = document.getElementById("feedback-box");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackText = document.getElementById("feedback-text");
const hintCount = document.getElementById("hint-count");

btnEnviar.addEventListener("click", async () => {
  const respuesta = inputRespuesta.value.trim();
  if (!respuesta) return;

  btnEnviar.disabled = true;
  btnEnviar.textContent = "Consultando a Beto...";

  const res = await enviarIntento({
    estudiante: "EST-014",
    reto: "P8-RESTO-01",
    paso_polya: "resolver",
    fase: "simbolizar",
    intento: 1,
    respuesta,
    pasos: ["1/3+1/4=7/12", "1-7/12=5/12"],
  });

  feedbackBox.classList.remove("hidden");
  feedbackTitle.textContent = res.correcto ? "¡Correcto!" : `Pista ${res.escalon} de 5`;
  feedbackText.textContent = res.beto.dice;
  if (!res.correcto) hintCount.textContent = `${res.escalon}/5`;

  btnEnviar.disabled = false;
  btnEnviar.textContent = "Comprobar con n8n";
});