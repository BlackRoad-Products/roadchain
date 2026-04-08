# RoadChain

*Every mile, stamped and sealed.*

Blockchain verification layer that timestamps, seals, and protects every action, creation, memory, and mile on The BlackRoad. 58 platform webhook handlers live.

## The Ride

Every mile stamped on RoadChain. Every action, every creation, every memory — hashed, chained, tamper-proof. Your history is your proof. Nobody can rewrite your road.

## What It Does

Universal webhook blockchain that receives events from 58+ platforms, hashes them with PS-SHA infinity, writes immutable blocks to a D1 ledger, and auto-mints RoadCoin per action. Every other BlackRoad product feeds into RoadChain.

## Integrations

RoadChain is the integration backbone — **58 webhook handlers live**:

### Payments
| Service | Verification |
|---------|-------------|
| **Stripe** | Signature verified |
| **Coinbase** | Onramp + charge events |
| **Shopify** | Order/product events |
| **PayPal** | Payment events |
| **Square** | Transaction events |
| **Plaid** | Financial data events |

### AI Providers (14)
| Service | What's Tracked |
|---------|---------------|
| **Anthropic** | Inference events |
| **OpenAI** | Inference events |
| **Ollama** | Per-token rewards — every local inference earns ROAD |
| **Google AI / Replicate / Together / Groq** | Inference events |
| **Fireworks / Mistral / Cohere / Perplexity** | Inference events |
| **Stability / ElevenLabs / Hugging Face** | Model/generation events |

### DevOps
| Service | Verification |
|---------|-------------|
| **GitHub** | Signature verified — push, PR, release, deploy |
| **Vercel** | Deployment events |
| **Railway** | Deployment events |
| **DigitalOcean** | Droplet/app events |
| **Docker Hub** | Image push events |
| **npm** | Package publish events |
| **Sentry** | HMAC verified — error events |
| **Linear** | Signature verified — issue events |
| **Jira** | Issue/sprint events |
| **Grafana / Datadog / PagerDuty** | Alert events |

### Cloud
| Service | What's Tracked |
|---------|---------------|
| **Cloudflare** | Worker/Pages deploy events |
| **AWS (SNS + EventBridge)** | SNS message parsing |
| **Google Cloud (Pub/Sub)** | Pub/Sub events |
| **Tailscale** | Signature verified — network events |
| **Supabase / Neon / PlanetScale / Upstash** | Database events |

### Communication
| Service | What's Tracked |
|---------|---------------|
| **Clerk** | Signature verified — user/session events |
| **Slack / Discord / Telegram** | Message events |
| **Meta / X / TikTok / YouTube / Pinterest** | Social events |
| **Twilio / SendGrid / Mailchimp** | Delivery events |
| **Salesforce / Notion** | CRM/doc events |
| **Zapier / Make / Figma / Canva** | Automation/design events |

### Catch-All
- `/webhook/{anything}` — auto-handles unknown platforms

## Features

- 58 platform-specific webhook handlers + generic catch-all
- PS-SHA infinity hash chain — every block linked to the previous
- Auto-mint RoadCoin per action
- Signature verification on GitHub, Stripe, Clerk, Tailscale, Sentry, Linear
- Immutable D1 ledger with block explorer
- 13 KPI endpoints: chain, economy, platforms, AI, dev, infra, social, payments, fleet, contributors, timeline, live
- Stats: `/api/webhook/stats`

## Status

**LIVE** — 28+ blocks, 27.3 ROAD minted, 11 holders, 58 platforms | [roadchain.blackroad.io](https://roadchain.blackroad.io)

## How It Powers The BlackRoad

RoadChain is the asphalt itself — the permanent, tamper-proof foundation that makes every other product trustworthy. No one can rewrite your road.

---

Part of [BlackRoad OS](https://blackroad.io) — Remember the Road. Pave Tomorrow.
