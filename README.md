# Sea Eagle Marine Patrol USA

Public charity website and private member management application. Red, black, white, and gold theme based on the supplied SEMP emblem.

## Public pages

- Home, mission, and flotillas
- Outreach: charitable initiatives and donation stories published by a full administrator
- Upcoming events: published event dates, location details, and descriptions
- SEMP TV: honest empty state until media is supplied
- Branding center with original emblem download

## Member access

Email/password login only; no public account registration. The owner creates the initial administrator at `/setup` using a private `ADMIN_SETUP_KEY` configured in the hosting environment. Setup locks permanently after the first successful account creation. No credentials belong in this repository.

Roles are enforced on the server:

| Role                  | Capabilities                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Member                | Own dues, own payments, member name/flotilla directory, events, password changes                                                                   |
| Finance administrator | Member capabilities, assign fees to individual members, record received payments, view balances and activity                                       |
| Full administrator    | All finance capabilities, create/remove/restore members, reset temporary passwords, publish/remove public events and outreach, void unpaid charges |

Removing a member deactivates the account and revokes sessions while preserving financial history. Temporary passwords must be changed before accessing data. No invitation or reset email is automatically sent.

## Dues

All monetary values are integer USD cents. Fixed fee presets: monthly membership $20, Converge $250, leadership retreat $100. Charges are assigned explicitly, never automatically. A member can have one charge of each type per billing period; monthly periods use YYYY-MM. Other charges use a distinct period/reference when necessary.

Partial payments are supported. Recording a payment does not collect money. The server rejects overpayments and duplicate charge periods, and uses atomic database statements and idempotency keys for payment records. Current and past-due balances use the America/New_York calendar date. Paid charges are retained.

Online payment processing, automated billing, email/SMS, uploaded documents, video publishing, and recurring event scheduling are not configured. Published donation values are descriptive records, not payment transactions. No real event dates, donation amounts, testimonials, impact statistics, or membership records are fabricated.

## Development

Node 22.13+ required. Install with `npm run install:ci`, then `npm run dev`. Build with `npm run build`. `npm start` previews the built Cloudflare Worker. Copy `.env.example` to an ignored `.env` and use a random private setup key for development.

Runtime: Vinext/React on Cloudflare Workers. Durable data: D1. `.openai/hosting.json` declares the logical `DB` binding. Apply generated `drizzle/*.sql` migrations in order to a local D1 database before testing member services. The Sites host applies production migrations during publication.

GitHub hosts the public source. GitHub Pages alone cannot run this application: authentication and financial records require a server and a private database. The published site runs separately on the Sites/Cloudflare runtime.

## Security and operations

Passwords are salted PBKDF2-SHA256 hashes (100,000 iterations, compatible with Workers WebCrypto). Sessions use cryptographically random tokens, only token hashes are stored, cookies are HttpOnly/Secure/SameSite=Strict, and sessions expire after eight hours. Write requests require same-origin JSON. Login/setup are rate-limited. Queries use bound parameters. Member and finance permissions are checked for every API request. Audit records track administrative changes. Production starts with no member data.

Use unique strong passwords. No MFA or self-service email recovery is implemented. The owner must retain administrator access and private hosting access. Database backup/restore policy is managed through the hosting platform; this repository does not claim a configured daily backup schedule.

The member dues page optionally exposes a feature-detected WebMCP read tool. Browsers without WebMCP use the normal interface.

Do not commit `.env`, private setup keys, local databases, real member exports, build output, or credentials. The supplied PDF is used as reference and is not published in the repository.

Payment plans: finance and full administrators can split the remaining balance into 2, 3, 4, or 6 monthly installments. Plans preserve previously received payments, allocate later payments to the oldest installment first, and use installment dates for past-due calculations. Month-end dates clamp to the last valid day. No merchant processor is connected.

The homepage maritime artwork is original AI-generated illustrative imagery; it does not document the organization’s actual fleet.

