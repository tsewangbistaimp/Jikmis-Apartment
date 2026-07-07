# TsewangBistaX Portfolio

Premium personal and business portfolio for Tsewang Bista.

## Tech Stack

- Next.js
- React
- TypeScript
- Google Sheets API for order storage
- Nodemailer SMTP for owner/customer email notifications

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Checks

```bash
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Order System

The order form submits to `/api/orders`. A successful order:

- Writes the order to the configured Google Sheet tab.
- Sends an owner notification email.
- Sends the customer an order received email.

Required environment variables are listed in `.env.example`.

Important setup:

- Share the Google Sheet with `GOOGLE_CLIENT_EMAIL` as an Editor.
- Paste `GOOGLE_PRIVATE_KEY` with escaped `\n` line breaks in Vercel.
- Use a valid Gmail app password for `SMTP_PASS`.
- Never commit `.env.local` or real secrets.

## Vercel Deployment

1. Import this GitHub repository into Vercel.
2. Keep the framework preset as `Next.js`.
3. Add every variable from `.env.example` in Vercel Project Settings.
4. Deploy.
