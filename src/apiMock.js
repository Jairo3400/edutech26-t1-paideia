// src/apiMock.js
const USE_MOCK = true;
const N8N_WEBHOOK_URL = "";

const PISTAS_MOCK = [
  "El almuerzo fue 1/4… ¿de todo el dinero o de lo que quedó?",
  "Si gastó 1/3 en el libro, ¿qué fracción del dinero le quedó antes del almuerzo?",
  "Prueba dibujarlo en barras: divide el total en 3 partes iguales y mira cuántas quedan."
];

export async function enviarIntento(payload) {
  if (!USE_MOCK && N8N_WEBHOOK_URL) {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  }

  await new Promise((r) => setTimeout(r, 350));

  const respLimpia = payload.respuesta.replace(",", ".").trim();
  if (respLimpia === "48" || respLimpia === "48.0" || respLimpia === "48.00") {
    return {
      correcto: true,
      error: null,
      accion: "resuelto",
      escalon: payload.intento,
      siguiente_pista: null,
      beto: {
        estado: "fiesta",
        dice: "¡Lo lograste! Sofía tenía $48.",
      },
    };
  }

  const escalon = Math.min(payload.intento, PISTAS_MOCK.length);
  return {
    correcto: false,
    error: "E1",
    accion: "pista",
    escalon,
    siguiente_pista: "bloqueada_hasta_paso_nuevo",
    beto: {
      estado: "duda",
      dice: PISTAS_MOCK[escalon - 1],
    },
  };
}