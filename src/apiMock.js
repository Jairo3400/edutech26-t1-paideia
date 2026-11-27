const USE_MOCK = true;
const N8N_WEBHOOK_URL = ""; // Mateo te pasará esta URL al llegar

export async function enviarIntento(payload) {
  if (!USE_MOCK && N8N_WEBHOOK_URL) {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  }

  // Simulación del contrato oficial con n8n (latencia artificial de 400ms)
  await new Promise((r) => setTimeout(r, 400));

  if (payload.respuesta === "48") {
    return {
      correcto: true,
      error: null,
      accion: "resuelto",
      escalon: 0,
      siguiente_pista: null,
      beto: {
        estado: "fiesta",
        dice: "¡Lo lograste! Sofía tenía $48.",
      },
    };
  }

  return {
    correcto: false,
    error: "E1",
    accion: "pista",
    escalon: 1,
    siguiente_pista: "bloqueada_hasta_paso_nuevo",
    beto: {
      estado: "duda",
      dice: "El almuerzo fue 1/4… ¿de todo el dinero o de lo que quedó?",
    },
  };
}