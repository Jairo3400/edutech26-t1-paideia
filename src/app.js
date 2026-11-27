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

function mostrarVista(nombre) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById(`view-${nombre}`).classList.add("active");

  const titulos = { entender: "Entender", resolver: "Resolver", barras: "Planificar" };
  screenTitle.textContent = titulos[nombre] || "Paideia";

  const pasoActivo = nombre === "barras" ? "planificar" : nombre;
  document.querySelectorAll(".polya-bar .step").forEach((s) => {
    s.classList.toggle("active", s.dataset.step === pasoActivo);
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

// Lógica Pantallas 6 y 7: Visualizar con barras
let pasoBarras = 1;
const barContainer = document.getElementById("bar-container");
const barStepLabel = document.getElementById("bar-step-label");
const barInstruction = document.getElementById("bar-instruction");
const barLegend = document.getElementById("bar-legend");
const barBetoMsg = document.getElementById("bar-beto-msg");
const btnBarrasNext = document.getElementById("btn-barras-next");
const unitBox = document.getElementById("unit-box");
const inputUnidad = document.getElementById("input-unidad");
const btnCheckUnidad = document.getElementById("btn-check-unidad");
const unidadMsg = document.getElementById("unidad-msg");

document.getElementById("btn-to-barras").addEventListener("click", () => mostrarVista("barras"));
document.getElementById("btn-barras-back").addEventListener("click", () => mostrarVista("resolver"));

// Paso 1: marcar 1/3 (libro)
barContainer.addEventListener("click", (e) => {
  const seg = e.target.closest(".bar-seg");
  if (!seg) return;

  if (pasoBarras === 1) {
    barContainer.querySelectorAll(".bar-seg").forEach((s) => s.classList.remove("libro"));
    seg.classList.add("libro");
    seg.textContent = "Libro";
    barLegend.textContent = "✓ Libro marcado (1/3). Quedan 2 bloques sin gastar.";
    btnBarrasNext.disabled = false;
  } else if (pasoBarras === 2 && !seg.classList.contains("libro")) {
    barContainer.querySelectorAll(".bar-seg").forEach((s) => {
      if (!s.classList.contains("libro")) {
        s.classList.remove("almuerzo");
        s.classList.add("queda");
        s.textContent = "Queda";
      }
    });
    seg.classList.remove("queda");
    seg.classList.add("almuerzo");
    seg.textContent = "Alm.";
    barLegend.textContent = "✓ Almuerzo = 1 unidad (1/4 del resto). Quedan 3 unidades = $24.";
    unitBox.classList.remove("hidden");
  }
});

btnBarrasNext.addEventListener("click", () => {
  if (pasoBarras === 1) {
    pasoBarras = 2;
    barStepLabel.textContent = "Paso 2 de 2";
    barInstruction.innerHTML = "Ahora todo son <strong>6 unidades iguales</strong>. Toca <strong>1 de las 4 unidades del resto</strong> para el almuerzo.";
    barContainer.className = "bar-grid cols-6";
    barContainer.innerHTML = `
      <button type="button" class="bar-seg libro" disabled>Libro</button>
      <button type="button" class="bar-seg libro" disabled>Libro</button>
      <button type="button" class="bar-seg" data-idx="2">Resto</button>
      <button type="button" class="bar-seg" data-idx="3">Resto</button>
      <button type="button" class="bar-seg" data-idx="4">Resto</button>
      <button type="button" class="bar-seg" data-idx="5">Resto</button>
    `;
    barLegend.textContent = "Toca 1 bloque del resto para marcar el almuerzo (1/4 del resto).";
    barBetoMsg.innerHTML = "Fíjate: el libro ocupa 2 unidades y el resto 4. ¡Todas son del <strong>mismo tamaño</strong>!";
    btnBarrasNext.textContent = "Volver a escribir con números →";
    btnBarrasNext.disabled = true;
  } else {
    mostrarVista("resolver");
  }
});

btnCheckUnidad.addEventListener("click", () => {
  const val = Number(inputUnidad.value);
  unidadMsg.classList.remove("hidden", "ok", "bad");
  if (val === 8) {
    unidadMsg.textContent = "✓ ¡Exacto! 24 ÷ 3 = $8 por unidad. Si todo son 6 unidades, ¿cuánto es 8 × 6?";
    unidadMsg.classList.add("ok");
    barContainer.querySelectorAll(".bar-seg.queda").forEach((s) => (s.textContent = "$8"));
    barBetoMsg.innerHTML = "¡Buenísima! Tu dibujo quedó guardado para explicarle a Beto. Ahora vuelve a <strong>Resolver</strong> y pon el total.";
    btnBarrasNext.disabled = false;
  } else {
    unidadMsg.textContent = "Pista: si 3 unidades iguales valen $24, divide 24 entre 3.";
    unidadMsg.classList.add("bad");
  }
});