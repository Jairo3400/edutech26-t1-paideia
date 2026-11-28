# Declaración de Uso de Inteligencia Artificial (`AI_USAGE.md`)

**Equipo:** Paideia  
**Evento:** n8n Hackathon Quito · Build with AI: EduTech (Track 1)  
**Fecha:** 27–28 de noviembre de 2026  

---

## 1. Herramientas de IA utilizadas en el desarrollo

| Herramienta | Quién la usa | Propósito y alcance | Revisión humana |
| :--- | :--- | :--- | :--- |
| **Google Antigravity** | Jairo (Frontend / PWA) | Asistencia en el desarrollo de la PWA en HTML, CSS y JavaScript puro (ES Modules) dentro de `src/`, depuración, estructuración de vistas mobile-first y apoyo en documentación (`AI_USAGE.md`). | Todo el código generado o asistido es revisado, probado localmente y subido manualmente mediante commits por el integrante responsable. |
| *(Por completar si aplica)* | Mateo (n8n / IA) | *(Completar antes de la entrega: modelos/herramientas usadas en flujos de n8n y desarrollo)* | *(Confirmar revisión humana y plan B sin IA)* |
| *(Por completar si aplica)* | Nadhine (Contenido / Diseño) | *(Completar antes de la entrega si se usaron herramientas de IA para redacción, bocetos o pitch)* | *(Confirmar revisión humana)* |

---

## 2. IA dentro del producto (Paideia)

- **Rol de la IA en el tutor:** Diagnóstico de errores conceptuales y redacción de pistas adaptativas sin entregar nunca la respuesta directa.
- **Lógica determinista:** La verificación matemática de respuestas y la regla de candado de pistas se ejecutan por código, no delegadas al modelo de lenguaje.
- **Respaldo (Plan B):** El sistema contempla pistas estructuradas de respaldo en caso de fallo o latencia de la API de IA.

---

## 3. Compromisos de cumplimiento y ética

1. **Código original desde las 17:00:** No se copió código HTML/CSS de documentos o bocetos previos de planificación (`Guia_equipo_Paideia_Hackaton_n8n.html` se usa únicamente como referencia visual y funcional).
2. **Privacidad y LOPDP:** No se ingresan ni almacenan datos reales de estudiantes o docentes; todos los registros utilizados en pruebas y demo son sintéticos (ej. `EST-014`, `EST-007`, `EST-019`).
3. **Control de versiones:** Ninguna herramienta de IA realiza `git push` automático; cada integrante revisa y sube sus propios commits desde su cuenta.
