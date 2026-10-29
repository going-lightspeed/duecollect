# DueCollect

Invoice tracker with AI payment reminders. Uses a **local NVIDIA Cosmos3** model (via vLLM) to write customer emails and verify the bills customers reply with.

## What it does

- Log **payables** (bills you owe) and **receivables** (invoices clients owe you)
- Schedule reminders before due dates (default 7 / 3 / 1 days)
- Flag parties who still have not paid after a **grace period**
- Admin uploads the payment QR; the local AI emails every customer with dues (all past dues in one email, QR attached)
- Customers reply with a bill; the AI reads it and the code checks amount, receiving account, unused txn id and tampering before marking paid
- Everything is stored in `data/` as CSV: `debts.csv`, `payments.csv`, `emails.csv`
- **Auto-email** those reminders via SMTP (when `partyEmail` + SMTP are set)
- Public **pay page + QR** (`/pay/[id]`) so clients can pay and submit a **payment ID**
- **Admin** (`/admin`, user `admin`) confirms payment IDs stored in `data/store.json`

## Quick start

```bash
cd duecollect
cp .env.example .env.local
# Copy the variables from .env.example into .env.local (LOCAL_AI_*, MAIL_EMAIL, MAIL_PASSWORD)

npm install
npm run dev
```
## Setup
- in order for this to be a fully operatable program you need to fill up the following
  | Variable | Purpose |
  | --- | --- |
  |`ADMIN_USERNAME`|name of admin default:`admin`|
  |`ADMIN_PASSWORD`|password of admin default:`admin`|
  |`ADMIN_SESSION_SECRET`| default:`long-random-string`|
  
- for auto reminder setup
  | Variable | Purpose |
  | --- | --- |
  |`MAIL_EMAIL`|default:`you@gmail.com`|
  |`MAIL_PASSWORD`|paceholder:`your-16-character-app-password`|
- for payment(upi)
  | Variable | Purpose |
  | --- | --- |
  |`PAYMENT_UPI_ID`|paceholder:`yourname@upi`|
  |`PAYMENT_PAYEE_NAME`|paceholder:`Your Business`|
  |`PAYMENT_NOTE_PREFIX`|paceholder:`INV`|
OPEN FILE IN CURRENT DIRECTRY THROUGH cd IF ON LINUX.
run "npm run dev".
Open [http://localhost:3000](http://localhost:3000).

1. Add invoices  
2. Click **Run AI reminder scan**  
3. Read generated reminders in the feed  

## How email + QR + payments work

1. Add a receivable with the client's **email**
2. Click **Run AI reminder scan** (or cron `POST /api/reminders/run`)
3. DueCollect writes AI copy, then **emails** it with a **Pay invoice / open QR** link
4. Client opens `/pay/[invoiceId]`, scans the QR (UPI if configured), pays, and enters their **payment ID**
5. That ID is saved in the database (`payments` in `data/store.json`)
6. Sign in at `/admin` as **admin** → confirm the payment → invoice marked paid

## Nebius + NVIDIA setup

| Variable | Purpose |
| --- | --- |
| `NEBIUS_API_KEY` | Token Factory API key |
| `NEBIUS_BASE_URL` | Default `https://api.tokenfactory.nebius.com/v1/` |
| `NEBIUS_MODEL` | Default `nvidia/Nemotron-3_5-Lightning` |

Also set SMTP + `ADMIN_PASSWORD` + optional `PAYMENT_UPI_ID` — see `.env.example`.

## Host on Nebius (container)

```bash
cp .env.example .env
# fill NEBIUS_API_KEY

docker compose up --build -d
```

Image listens on port `3000`. Persist invoice data with the `duecollect-data` volume.

Deploy the same image to a Nebius AI Cloud VM or Kubernetes workload and set the env vars above. Point a daily cron at:

```bash
curl -X POST https://your-host/api/reminders/run
```

## API

| Method | Path | Notes |
| --- | --- | --- |
| `GET/POST` | `/api/invoices` | List / create |
| `PATCH/DELETE` | `/api/invoices/:id` | Mark paid / delete |
| `GET` | `/api/reminders` | Reminder feed |
| `GET/POST` | `/api/reminders/run` | Scan due / overdue invoices |
| `GET` | `/api/stats` | Dashboard totals + AI status |

## Stack

Next.js · TypeScript · Tailwind · Nebius Token Factory (OpenAI-compatible) · JSON file store under `data/`
