# TsewangBistaX Portfolio

Modern single-page portfolio website for Tsewang Bista, built with Next.js.

## Tech Stack

- Next.js
- React
- TypeScript
- Lucide icons
- CSS animations and responsive styling

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

## Deploying To Vercel

1. Import this GitHub repository into Vercel.
2. Keep the framework preset as `Next.js`.
3. Add the environment variables from `.env.example`.
4. Use the default build command: `npm run build`.
5. Use the default output settings.
6. Deploy.

## Order System Setup

The order form submits to `/api/orders`. A successful order:

- Creates/uses an `Orders` tab in Google Sheets.
- Appends the order row.
- Emails the owner.
- Emails the customer an order received confirmation.

Required Vercel environment variables:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `GOOGLE_SPREADSHEET_ID`
- `SMTP_USER`
- `SMTP_APP_PASSWORD`
- `ORDER_NOTIFICATION_EMAIL`

Important: share the Google Sheet with the service account email as an editor, and use a valid Gmail app password for `SMTP_USER`.
