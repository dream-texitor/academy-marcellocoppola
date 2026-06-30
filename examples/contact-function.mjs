/**
 * Funzione serverless di esempio per ricevere il form contatti.
 *
 * Variabili ambiente previste:
 * EMAIL_API_ENDPOINT  endpoint del provider email o della serverless interna
 * EMAIL_API_KEY       chiave API del provider, se richiesta
 * FORM_RECIPIENT      destinatario, es. academy@marcellocoppola.com
 *
 * Adattare payload e header al provider scelto. Non inserire password o chiavi nel codice.
 */
export default async function handler(request) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" }
    });
  }

  const form = await request.formData();
  const honeypot = String(form.get("website") || "").trim();

  if (honeypot) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  const required = ["name", "email", "target", "message"];
  for (const field of required) {
    if (!String(form.get(field) || "").trim()) {
      return new Response(JSON.stringify({ error: `Missing field: ${field}` }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
  }

  const recipient = process.env.FORM_RECIPIENT || "academy@marcellocoppola.com";
  const body = [
    "Nome e cognome: " + form.get("name"),
    "Organizzazione: " + (form.get("organization") || ""),
    "Email: " + form.get("email"),
    "Telefono: " + (form.get("phone") || ""),
    "Target di interesse: " + form.get("target"),
    "Messaggio: " + form.get("message"),
    "Data invio: " + new Date().toISOString(),
    "Pagina di provenienza: " + (form.get("sourcePage") || "")
  ].join("\n");

  const endpoint = process.env.EMAIL_API_ENDPOINT;
  if (!endpoint) {
    return new Response(JSON.stringify({ error: "EMAIL_API_ENDPOINT not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.EMAIL_API_KEY ? { authorization: `Bearer ${process.env.EMAIL_API_KEY}` } : {})
    },
    body: JSON.stringify({
      to: recipient,
      subject: "Nuova richiesta da Marcello Coppola Academy",
      text: body
    })
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Email provider error" }), {
      status: 502,
      headers: { "content-type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
}
