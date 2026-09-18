# eBuzz.ai: AI-first, problem-solving e-commerce

> **Tell us what's wrong. Brands compete live to fix it. Play a little, and save a little more.**

eBuzz.ai is a concept for a chat-first marketplace:

- **Shoppers** describe a problem, get a step-by-step plan and a shortlist of about 3 products, and receive **live, private offers** from the shortlisted vendors. They can also tap *Ask for a better deal*. Vendors can reply instantly (auto-bid) or ask for a few minutes.
- **Play & Win**: short skill games paid for by ads earn shoppers store credits that are applied automatically at checkout.
- **An agentic back office**: 24 AI agents cover trend research, Top10 content, video, supplier outreach, search-to-order, order-to-cash, customer service, returns, shipping, legal, finance and regulatory work. Humans approve anything that publishes content, signs contracts or moves money.

**Live site:** https://ravikrali.github.io/ebuzz-demo/

## What's in this repo

| Path | What it is |
|---|---|
| [`docs/THESIS.md`](docs/THESIS.md) | Investment thesis: why now, the insight, flywheel, moat, hypotheses, risks, the ask |
| [`docs/BUSINESS_PLAN.md`](docs/BUSINESS_PLAN.md) | Full business plan: validation & recommendations, competition, revenue model, unit economics, GTM, agent architecture, operations, tech, legal/regulatory, team, 5-year financials, KPIs, risks, milestones |
| `index.html` | Landing page |
| `docs.html` | Renders the thesis and plan with a table of contents |
| `app/customer.html` | **Shopper**: chat concierge, live offers, contextual browse, checkout with credits, playable match-3 & memory games, Wallet, Orders, Account & Preferences |
| `app/vendor.html` | **Vendor Manager, Deal Room**: live sessions, anonymised price-to-beat, AI-suggested offers, *Need 5 min*, auto-bid rules, win/loss, Deal Boost |
| `app/supplier.html` | **Supplier Hub**: contracts & e-sign, SKU upload with AI validation, inventory, orders, returns, payouts, compliance |
| `app/finance.html` | **Finance Manager**: GMV/take rate, revenue mix, payout-batch approval, prize-pool governor, reconciliation, tax, forecast |
| `app/agents.html` | **Agent Ops / COO**: agent fleet, approval queue (video, Top10, outreach), Problem Radar, incidents, autonomy policies |

## Try the live negotiation

Open **Shopper** and **Deal Room** in two tabs of the same browser. As the shopper, pick *"My back hurts after working from home"*, then tap **Ask for a better deal**. The request appears in the Deal Room. Send an offer (or *Need 5 min*) and it shows up in the shopper's chat. Accept it and check out: the Deal Room records the win, and the Finance console and Agent Ops event stream update live. The tabs talk to each other through `BroadcastChannel`. There is no backend.

## Run locally

It's a static site. Any static server works:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. The docs page needs a server because browsers block `fetch` for local files.

---
*Prototype only. All brands, products, people and numbers are fictional or illustrative. Financials are planning estimates, not a forecast or an offer of securities.*
