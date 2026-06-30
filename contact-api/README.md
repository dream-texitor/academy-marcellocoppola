# Academy Contact API

Piccolo backend Node.js/Express per gestire il form contatti di Marcello Coppola Academy.

Endpoint pubblico previsto:

```text
POST https://academy.marcellocoppola.com/api/contact
```

Cartella di deploy prevista sul server:

```text
/opt/academy-contact-api
```

## Installazione

Sul server Ubuntu:

```bash
sudo mkdir -p /opt/academy-contact-api
sudo chown -R $USER:$USER /opt/academy-contact-api
cd /opt/academy-contact-api
npm install
```

## Configurazione `.env`

Creare il file `.env` partendo da `.env.example`:

```bash
cp .env.example .env
nano .env
```

Variabili:

```env
PORT=9025
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_TO=academy@marcellocoppola.com
MAIL_FROM=academy@marcellocoppola.com
ALLOWED_ORIGIN=https://academy.marcellocoppola.com
```

Nessuna credenziale SMTP deve essere inserita nel codice.

## Avvio locale

```bash
npm run dev
```

Oppure:

```bash
npm start
```

Health check:

```bash
curl http://127.0.0.1:9025/health
```

## Avvio con PM2

```bash
sudo npm install -g pm2
cd /opt/academy-contact-api
pm2 start server.js --name academy-contact-api
pm2 save
pm2 startup
```

Comandi utili:

```bash
pm2 logs academy-contact-api
pm2 restart academy-contact-api
pm2 status
```

## Nginx reverse proxy

Nel virtual host di `academy.marcellocoppola.com`, aggiungere:

```nginx
location /api/contact {
    proxy_pass http://127.0.0.1:9025/api/contact;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Poi verificare e ricaricare:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Test con curl

Test locale:

```bash
curl -X POST http://127.0.0.1:9025/api/contact \
  -H "Origin: https://academy.marcellocoppola.com" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mario Rossi",
    "organization": "Hotel Esempio",
    "email": "mario@example.com",
    "phone": "+39 333 1234567",
    "target": "Hotel",
    "message": "Vorrei informazioni sul percorso AI Literacy per hotel.",
    "privacy": true,
    "website": "",
    "sourcePage": "https://academy.marcellocoppola.com/corso-ai-literacy-hotel-strutture-ricettive"
  }'
```

Test produzione:

```bash
curl -X POST https://academy.marcellocoppola.com/api/contact \
  -H "Origin: https://academy.marcellocoppola.com" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mario Rossi",
    "email": "mario@example.com",
    "target": "Hotel",
    "message": "Vorrei una proposta.",
    "privacy": true
  }'
```

## Integrazione con Astro

Il sito Astro deve usare:

```env
CONTACT_FORM_ENDPOINT=https://academy.marcellocoppola.com/api/contact
```

Questa variabile va impostata prima di eseguire la build del sito.
