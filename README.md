# Marcello Coppola Academy

Sito statico professionale per `academy.marcellocoppola.com`, sviluppato in Astro.

## Stack

- Astro static output
- CSS modulare tramite componenti Astro e foglio globale
- Sitemap automatica con `@astrojs/sitemap`
- Form contatti predisposto per endpoint configurabile

## Requisiti

- Node.js 18 o superiore
- npm

## Installazione

```bash
npm install
```

## Sviluppo locale

```bash
npm run dev
```

Di norma Astro espone il sito su `http://localhost:4321`.

## Build

```bash
npm run build
```

La build statica viene generata in `dist/`.

## Preview

```bash
npm run preview
```

## Deploy

Pubblicare il contenuto di `dist/` su `academy.marcellocoppola.com`.

Il progetto include:

- pagine statiche SEO-oriented
- canonical e Open Graph per ogni pagina
- sitemap generata in build
- `public/robots.txt`
- dati strutturati JSON-LD per Organization, Person e Course

## Form contatti

Il form è in `src/components/ContactForm.astro`.

Per configurare l'invio:

```bash
CONTACT_FORM_ENDPOINT=https://tuo-endpoint.example/api/contact npm run build
```

Il valore di `CONTACT_FORM_ENDPOINT` viene inserito nel markup generato durante la build. Non deve contenere chiavi API o password.

Il form invia via `POST`:

- nome e cognome
- organizzazione
- email
- telefono
- target di interesse
- messaggio
- pagina di provenienza
- campo honeypot antispam

Il destinatario previsto è `academy@marcellocoppola.com`.

## Invio email

Per inviare realmente le email a `academy@marcellocoppola.com` è necessario configurare un endpoint backend, una serverless function o un servizio di form handling.

Il file `examples/contact-function.mjs` contiene una funzione serverless di esempio. Usa variabili ambiente:

- `EMAIL_API_ENDPOINT`
- `EMAIL_API_KEY`
- `FORM_RECIPIENT`

Oggetto email previsto:

```text
Nuova richiesta da Marcello Coppola Academy
```

Corpo email previsto:

```text
Nome e cognome:
Organizzazione:
Email:
Telefono:
Target di interesse:
Messaggio:
Data invio:
Pagina di provenienza:
```

## Personalizzazioni consigliate

- Sostituire il telefono placeholder in `src/data/site.ts`.
- Collegare `CONTACT_FORM_ENDPOINT` al provider scelto.
- Aggiungere eventuali asset fotografici reali se disponibili.
