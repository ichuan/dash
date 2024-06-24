# Dash

Crypto Dashboard and Analytics.

- Framework: Next.js
- UI: Shadcn
- Charts: Recharts
- Deployed on Vercel
- Demo: <https://dash.981234.xyz>

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

Envs needed:

- `ONE_INCH_API_KEY`: Get it from <https://portal.1inch.dev/applications>
- `KV_*`: Create a KV Database on Vercel, and link it to your project
- `CRON_SECRET`: See the guides on <https://vercel.com/docs/cron-jobs/quickstart>

## Trigger cron jobs outside of Vercel

Cron jobs on Vercel's Hobby plan only includes [2 jobs and 1 trigger per day](https://vercel.com/docs/cron-jobs/usage-and-pricing). So we need to trigger jobs outside of Vercel, say VPS or [Cloudflare](https://developers.cloudflare.com/workers/configuration/cron-triggers/).

```
*/5 * * * * curl -H 'Authorization:Bearer xxx' 'https://dash-alpha-dusky.vercel.app/api/cron?job=updatePrice' >>/tmp/cron.5m.log
*/5 * * * * curl -H 'Authorization:Bearer xxx' 'https://dash-alpha-dusky.vercel.app/api/cron?job=updateAAVE' >>/tmp/cron.5m.log
1 * * * * curl -H 'Authorization:Bearer xxx' 'https://dash-alpha-dusky.vercel.app/api/cron?job=hourly' >>/tmp/cron.1h.log
# triggered on vercel
# 2 0 * * * curl -H 'Authorization:Bearer xxx' 'https://dash-alpha-dusky.vercel.app/api/cron?job=daily' >>/tmp/cron.1d.log
```
