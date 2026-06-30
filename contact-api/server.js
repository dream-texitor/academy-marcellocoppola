import "dotenv/config";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";

const app = express();

const config = {
  port: Number(process.env.PORT || 9025),
  allowedOrigin: process.env.ALLOWED_ORIGIN || "https://academy.marcellocoppola.com",
  mailTo: process.env.MAIL_TO || "academy@marcellocoppola.com",
  mailFrom: process.env.MAIL_FROM || "academy@marcellocoppola.com",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS
};

const limits = {
  name: 120,
  organization: 160,
  email: 180,
  phone: 60,
  target: 80,
  message: 4000,
  sourcePage: 500
};

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpSecure,
  auth: config.smtpUser && config.smtpPass ? {
    user: config.smtpUser,
    pass: config.smtpPass
  } : undefined
});

app.set("trust proxy", 1);

app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === config.allowedOrigin) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin not allowed"));
  },
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept"],
  optionsSuccessStatus: 204
}));

app.use(express.urlencoded({ extended: false, limit: "32kb" }));
app.use(express.json({ limit: "32kb" }));

app.use("/api/contact", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Troppe richieste. Riprova più tardi." }
}));

function clean(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPrivacyAccepted(value) {
  return value === true || value === "true" || value === "on" || value === "1";
}

function collectFormData(body) {
  return {
    name: clean(body.name, limits.name),
    organization: clean(body.organization, limits.organization),
    email: clean(body.email, limits.email).toLowerCase(),
    phone: clean(body.phone, limits.phone),
    target: clean(body.target, limits.target),
    message: clean(body.message, limits.message),
    privacy: body.privacy,
    website: clean(body.website || body.company_website, 200),
    sourcePage: clean(body.sourcePage, limits.sourcePage)
  };
}

function validate(data) {
  const errors = [];

  if (!data.name) errors.push("name obbligatorio");
  if (!data.email) errors.push("email obbligatoria");
  if (data.email && !isValidEmail(data.email)) errors.push("email non valida");
  if (!data.target) errors.push("target obbligatorio");
  if (!data.message) errors.push("message obbligatorio");
  if (!isPrivacyAccepted(data.privacy)) errors.push("privacy obbligatoria");

  return errors;
}

function buildEmail(data, ip) {
  const sentAt = new Date().toISOString();
  const rows = [
    ["Nome e cognome", data.name],
    ["Organizzazione", data.organization || "-"],
    ["Email", data.email],
    ["Telefono", data.phone || "-"],
    ["Target di interesse", data.target],
    ["Messaggio", data.message],
    ["Pagina di provenienza", data.sourcePage || "-"],
    ["Data invio", sentAt],
    ["IP", ip || "-"]
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlRows = rows
    .map(([label, value]) => `<tr><th align="left" style="padding:6px 12px 6px 0;">${escapeHtml(label)}</th><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#102a43;">
      <h1 style="font-size:20px;">Nuova richiesta da Marcello Coppola Academy</h1>
      <table cellspacing="0" cellpadding="0">${htmlRows}</table>
    </div>
  `;

  return { text, html };
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/contact", async (req, res) => {
  const data = collectFormData(req.body || {});

  if (data.website) {
    console.info("Contact form honeypot triggered");
    res.json({ ok: true });
    return;
  }

  const errors = validate(data);
  if (errors.length > 0) {
    res.status(400).json({ error: "Dati non validi", details: errors });
    return;
  }

  if (!config.smtpHost) {
    console.error("SMTP_HOST is not configured");
    res.status(500).json({ error: "Servizio email non configurato" });
    return;
  }

  const ip = req.ip || req.headers["x-forwarded-for"] || "";
  const { text, html } = buildEmail(data, ip);

  try {
    await transporter.sendMail({
      from: config.mailFrom,
      to: config.mailTo,
      replyTo: data.email,
      subject: "Nuova richiesta da Marcello Coppola Academy",
      text,
      html
    });

    console.info("Contact email sent", {
      target: data.target,
      hasOrganization: Boolean(data.organization),
      sourcePage: data.sourcePage || undefined
    });
    res.json({ ok: true });
  } catch (error) {
    console.error("Contact email failed", {
      message: error instanceof Error ? error.message : "Unknown error"
    });
    res.status(502).json({ error: "Invio email non riuscito" });
  }
});

app.use((error, _req, res, _next) => {
  console.error("Request failed", {
    message: error instanceof Error ? error.message : "Unknown error"
  });
  res.status(403).json({ error: "Richiesta non consentita" });
});

app.listen(config.port, () => {
  console.info(`Academy contact API listening on port ${config.port}`);
});
