# eBuzz.ai — Business Plan

*Version 1.0 · September 2026 · Draft for founders, advisors and seed investors*

---

## 1. Executive summary

**eBuzz.ai is a problem-first, chat-based marketplace.** Shoppers describe a problem ("my back hurts after long days at my desk", "my dog destroys every toy") and the eBuzz Concierge suggests a solution: a short plan and a shortlist of about 3 products. While the shopper decides, the shortlisted vendors can **compete live** with special offers in the **Deal Room**. The shopper can also **ask for a better deal** with one tap. Vendors are notified, can ask for a few minutes, and reply without blocking the conversation.

Between purchases, shoppers play **short skill games** (match-3, memory, quick quizzes) in the **Play & Win** zone. Banner and rewarded ads pay for the games, and shoppers win **small store credits** that they can spend on eBuzz.

Behind the scenes, eBuzz is an **AI-first company**. A fleet of agents finds trending problems, researches products, writes Top10 guides, produces 60–90 second videos (published only after human approval), recruits vendors, and runs every operational process from search-to-order to regulatory monitoring.

| | |
|---|---|
| **Customers** | Shoppers aged 25–55 in the US with a specific need, starting in *Home, Sleep & Work-from-Home Wellness* |
| **Suppliers / vendors** | Brands, DTC sellers, distributors (Shopify, Amazon 3P and wholesale sellers) |
| **Revenue** | Transaction commission (core), ad revenue (games + sponsored), Deal Boost fees, vendor SaaS tiers, affiliate |
| **Year-5 target (estimate)** | ~$1.0B GMV, ~$220M revenue, ~27% EBITDA margin |
| **Funding ask** | $4.0M seed, 18-month runway to Series A milestones |

---

## 2. Business model validation

### 2.1 Verdict

**The model is viable and stands out, but only if three changes are made** (see 2.3). The strongest and most defensible part is the **live vendor competition at the shortlist moment**. The chat concierge on its own is becoming a commodity (Amazon, Google, OpenAI, Perplexity, Walmart all have one). Games are a proven engagement tool but a weak moat and carry regulatory risk. The agentic back office is a cost advantage, not a reason for customers to choose eBuzz.

### 2.2 Scorecard

| Component | Customer value | Defensibility | Risk | Verdict |
|---|---|---|---|---|
| Problem-first chat concierge | High | Low (being commoditised) | Low | **Keep.** It is the entry point, not the moat |
| Live Deal Room (vendor offers + ask-for-discount) | Very high | **High** (data + vendor workflow) | Medium (antitrust, race to the bottom) | **Core differentiator.** Invest most here |
| Ad-funded games & credits | Medium–high | Low–medium | Medium–high (sweepstakes law, dark-pattern regulation) | **Keep with guardrails** |
| Context-only browsing | High (less clutter) | Medium | Low | **Keep.** Clear UX positioning |
| AI content engine (Top10, video) | Medium | Medium | Medium (search/YouTube policy) | **Keep with human quality gates** |
| Agentic operations | Indirect | Medium | Medium (errors at scale) | **Keep.** Structural cost advantage |
| Commission + ads revenue | – | – | Low | **Add Deal Boost, SaaS and data products** |

### 2.3 Recommended improvements

1. **Start in one vertical ("wedge"), not everything.** Two-sided marketplaces die of cold start. Launch in *Home, Sleep & WFH Wellness*: problem-driven, $40–$400 price points, many competing DTC brands, low regulatory load (not medical devices or supplements at first).
2. **Make the Deal Room legally safe by design.**
   - Vendors see only the **"price to beat"** and their anonymised rank *inside a single shopper session*. There is no persistent competitor-price feed. This lowers the risk of price-signalling/collusion claims.
   - Offers expire (default 15 minutes) and are tied to a specific shopper, not public price changes.
   - Disclose to shoppers that offers are personalised (follow emerging algorithmic-pricing disclosure laws, e.g. New York's).
3. **Let agents negotiate for vendors.** Priceline's "Name Your Own Price" faded because of bidding hassle, opaqueness and slow trades. So most vendor replies should come **instantly from vendor-configured auto-bid rules** (floor price, max discount, bundle options). Humans step in only on high-value sessions ("I need 5 min").
4. **Compete on value, not only price.** Offers can include free shipping, bundles, extended warranty, free returns, or a gift item. This protects vendor margins and makes the offer more interesting than "−3%".
5. **Gate the "ask for a better deal" button** so it doesn't turn into constant haggling: available once the shopper has shortlisted ≤ 3 items or has an item in the cart; 3 requests per day; vendor response SLA shown.
6. **Games: skill-based and free, with published odds.** No purchase needed to play, a free way to enter any chance-based bonus, 18+, daily play caps, credits with an expiry date and a cap per order (e.g. max 10% of basket). The prize pool is automatically limited to a set share of ad revenue.
7. **Add brand-sponsored games.** A vendor sponsors a level ("Beat level 5 to unlock 15% off the ErgoMax chair"). This earns much higher ad rates than generic banners and links fun directly to shopping.
8. **Distribute through agent protocols.** Expose eBuzz catalog and Deal Room offers via **UCP** (Google/Shopify) and **ACP** (OpenAI/Stripe) endpoints. Shoppers starting in Gemini, ChatGPT or Perplexity can still get eBuzz live offers, and we earn commission.
9. **Add an "Honest AI" trust layer**: "Why this product?" explanations, clear "Sponsored" labels, a best-price-match promise within the session, and aggregated review sentiment with sources. Trust is the main weakness of cashback/coupon players.
10. **Monetise the data (anonymised).** "Problem Radar" trend reports and price-elasticity benchmarks for vendors, sold as part of the Pro/Enterprise plans.

---

## 3. Problem & opportunity

### 3.1 Shopper problems
- **Choice overload.** Mass marketplaces show thousands of near-identical listings, sponsored results and fake-looking reviews.
- **People shop for outcomes, not SKUs.** "Sleep better" might need a pillow, a white-noise machine *and* blackout curtains from three brands.
- **Static prices.** Shoppers know discounts exist but have no simple way to get them except coupon hunting.
- **Shopping is a chore.** Content-heavy apps are tiring; chat is faster for considered purchases.

### 3.2 Vendor problems
- **Rising cost to get customers.** Marketplace ads and social ads keep getting more expensive; brands pay for impressions that don't convert.
- **No second chance.** A brand never knows it was shortlisted and lost by $8.
- **Channel sprawl.** Contracts, inventory, pricing and payouts are spread across many tools.

### 3.3 The opportunity
Connect **high-intent shoppers** and **brands willing to compete** at the moment of decision, with AI doing the matching, negotiating and operations.

---

## 4. Solution & product

### 4.1 Personas & portals

All portals are **chat-first**: a copilot conversation in the centre, rich interactive components inside the chat (cards, comparisons, tables, forms), and a **context panel** that shows only the filters and information relevant to the current task. The chat is where people get things done. Every portal also has a **Dashboard** with all KPIs and the *full* transaction list (search, filters, sorting, paging, CSV export), because long lists don't belong in a chat window.

Each portal has its own accent colour (Shopper honey, Deal Room violet, Supplier green, Admin blue, Agent Ops rose). Every portal offers a **Light** (light bluish-gray) and a **Dark** (gray) theme.

| Persona | Portal | Core jobs |
|---|---|---|
| **Shopper** | Customer Concierge | Describe problem → get a plan and shortlist → compare → receive/ask for offers. A **persistent right pane** has the **cart & checkout** at the top and **"For you" suggestions** from the current context and on-device memory. Also: Dashboard (all KPIs and every transaction), Play & Win, Wallet, Orders, Account & Preferences |
| **Supplier (catalog/ops admin)** | Supplier Hub | Dashboard (all KPIs and every order, refund, fee and payout), **staff & role-based access control**, contracts & e-sign, SKU/inventory upload, orders & fulfilment, returns, payouts, compliance documents |
| **Vendor Manager (pricing/sales)** | Deal Room | Live shopper sessions, competitor "price to beat", make offers, "need 5 min", auto-bid rules, win/loss analytics, Deal Boost budget |
| **Admin (eBuzz)** | Admin Console | Dashboard (platform KPIs and every transaction, with customers shown as pseudonymous IDs), **daily / weekly / monthly win limits**, **staff & RBAC** (Territory Managers, Customer Service Associates, Finance, Content, Compliance), payout approval, reconciliation, tax, forecast |
| **Agent Ops / COO (eBuzz)** | Agent Control Tower | Monitor all agents, human-approval queue (videos, contracts, high-value refunds), policies, incidents |
| Also: Legal & Compliance, Trust & Safety, Category Manager | Role-scoped views of the control tower | |

### 4.2 Key shopper journey

1. **"What are you trying to solve?"** Shopper types or speaks a problem.
2. Concierge asks up to 3 clarifying questions shown as chips (budget, space, preferences).
3. Concierge shows a **Solution Plan** (steps and reasoning) plus a **shortlist of 3** with "why this" explanations.
4. **Live offers appear** as shortlisted vendors react (e.g. "ErgoMax: −$25 + free shipping, 12:00 left").
5. Shopper taps **"Ask for a better deal"** → vendors notified → status chips ("ChairCo replied", "ErgoMax asked for 5 min") → shopper can keep chatting in the meantime.
6. **Contextual browse**: "See more like this" opens a drawer filtered *only* to this problem. There is no endless catalog.
7. **Checkout inside the chat**: address, payment (wallet credits applied automatically), delivery estimate.
8. After purchase: tracking, returns and support all through the same chat.

### 4.3 Deal Room mechanics

| Parameter | Default | Notes |
|---|---|---|
| Session trigger | Shortlist shown or item added to cart | Only for items with ≥ 2 competing vendors |
| Participants | 2–5 shortlisted vendors | Anonymised shopper (segment, budget band, intent score) |
| Visibility | "Price to beat" + your rank | No vendor identities, no history |
| Offer types | % / $ off, free shipping, bundle, warranty, gift | Vendor can combine |
| Response window | Instant (auto-bid) or up to 10 min | "Need 5 min" extends once |
| Offer validity | 15 min, one shopper, one use | Not a public price change |
| Fees | Commission on won sale; optional **Deal Boost** (pay to be highlighted) | Boosted offers labelled "Sponsored" |
| Guardrails | Vendor floor price, MAP compliance, max 3 rounds | Stops endless loops |

### 4.4 Play & Win

- **Games:** Match-3 ("Buzz Crush"), Memory Flip, 60-second product quiz, daily streak.
- **Funding:** Rewarded video and banner ads within the Play zone only. US rewarded video eCPMs are roughly **$16–20** in 2026. With ~2 rewarded views per session, ad revenue is about **$0.03–0.04 per session**.
- **Prize economics:** Prize pool = **40% of Play-zone ad revenue** (governed automatically). Typical prizes are $0.10–$2.00 credits, with rare $5–$25 "jackpot" credits sponsored by brands. Credits expire after 60 days and can cover at most 10% of an order.
- **Win limits (set in the Admin portal):** per player $1/day, $4/week, $12/month and 5 plays/day by default, plus platform prize-pool caps per day, week and month. A prize that would go over a limit is reduced to the remaining room; games stay free to play. Changes sync to every shopper device right away.
- **Compliance:** Skill-based scoring decides credits. Any chance element (daily spin) has a free alternative way to enter, published odds and official rules. 18+ only. No purchase needed. Daily caps and no manipulative countdowns.

### 4.5 Account, Preferences & Wallet
- Profile, addresses, saved payment tokens (handled by the payment provider, never stored by eBuzz), household members, sizes.
- **Preferences:** budget style (value/premium), brands to avoid, sustainability focus, delivery speed, notification rules for deals.
- **Wallet:** credit balance, pending credits, expiry schedule, history, "apply automatically" toggle.
- **Memory:** what the Concierge remembers (e.g. "light sleeper", "large dog") is visible and deletable. It is stored **on the device only**.

### 4.6 Staff & role-based access control (RBAC)

| Portal | Default roles | Scoping |
|---|---|---|
| Supplier Hub | Owner (all), Ops Admin, Catalog Manager, Pricing Manager, Fulfilment, Finance Viewer | By vendor organisation |
| Admin Console | Super Admin (all), Finance Manager, **Territory Manager**, **Customer Service Associate**, Content Editor, Compliance Officer | By territory (US-West, US-Central, US-South, US-Northeast, Canada) for vendors, customers and cases |

- Permissions are grouped: catalog, pricing & Deal Room, orders, money, legal/compliance and administration for suppliers; dashboards, money, vendors, customers and platform for eBuzz staff. Roles are edited in a permission matrix, and custom roles can be added.
- Sensitive actions carry built-in limits. For example, CS Associates can refund up to $200 and grant goodwill credits up to $10; bigger refunds need Finance.
- Access is **enforced server-side on every request**. AI agents act only within the permissions of the person or process that started them.
- Staff names and emails live in the organisation's encrypted vault. Only role, scope and status are stored centrally in plaintext.

---

## 5. Market analysis

### 5.1 Market size (planning estimates, to be checked again)

| Level | Definition | Estimate |
|---|---|---|
| **TAM** | Global B2C e-commerce | ~$6–7T GMV |
| **US e-commerce** | US Census-reported online retail | ~$1.3T GMV |
| **SAM** | US "considered", problem-driven purchases $30–$500 in home, wellness, pet, baby, home office, outdoor, small appliance, DIY | ~$250B GMV |
| **SOM (Year 5)** | eBuzz target | ~$1.0B GMV (~0.4% of SAM) |

Agentic commerce is projected (McKinsey) to reach **$3–5T** in annual revenue by 2030. The AI shopping assistant software market is estimated at ~$12.8B by end of 2026 (Grand View Research).

### 5.2 Target segments (launch)
1. **"Fix-it shoppers"** (primary): 28–50, working from home or hybrid, household income $60k+. They buy to solve a pain (sleep, back, clutter, allergies).
2. **Deal-seekers** (secondary): drawn in by games and live offers, then converted to problem-solving shopping.
3. **Busy parents & pet owners** (Year 2 expansion).

---

## 6. Competitive landscape

### 6.1 Who is running similar models

| Player | Model | Overlap with eBuzz | Gap eBuzz exploits |
|---|---|---|---|
| **Amazon – Alexa for Shopping** (formerly Rufus) | AI assistant inside the Amazon catalog; "Buy for Me" on other sites | Chat-based discovery | No vendor competition in real time; content-heavy; ads decide ranking |
| **Walmart – Sparky** | AI shopping assistant | Chat discovery | 1P-first; no negotiation |
| **Google AI Mode + UCP** | AI search with agentic checkout (Etsy, Wayfair live) | Discovery + protocol | Neutral router. **eBuzz plugs into UCP** as a supply source |
| **OpenAI ChatGPT Shopping** | Discovery; Instant Checkout retired March 2026 | Chat discovery | No merchant tools, no live offers |
| **Perplexity Shopping / Instant Buy** | Answer engine with shopping | Discovery | Legal conflict with Amazon over agent access; no vendor side |
| **Klarna AI** | Payments-linked shopping assistant | Chat + wallet | Built around payments, not vendor bidding |
| **Temu / Pinduoduo** | Gamified discount commerce (Farmland, Fishland) | Games → credits | Content-heavy, cross-border 1P, trust issues, dark-pattern criticism |
| **AliExpress / Shein** | Coins, games, flash deals | Gamification | Same as above |
| **eBay "Offers to interested buyers" / Best Offer**, **Poshmark/Mercari offers** | Seller sends an offer to a watcher; haggling | Live offers | One seller at a time, no competition, no AI |
| **Priceline "Name Your Own Price"** (historical) | Buyer sets price, suppliers accept | Reverse pricing | Faded 2016–2018 due to hassle and opaqueness. **eBuzz lesson: be instant and transparent** |
| **Sokoz and other reverse-auction retail** | Falling-price live auctions | Live price competition | Scheduled events, not intent-driven |
| **Honey, Capital One Shopping, Rakuten** | Coupons/cashback funded by affiliate commissions (5–20%) | Discounts | Passive; trust damaged by attribution controversies |
| **Whatnot, TikTok Shop** | Live-stream shopping | Real-time selling | Entertainment-led, not problem-led |
| **Wirecutter, RTINGS** | Expert review content + affiliate | Top10 content | No transaction or negotiation |
| **Rep AI, Gorgias, Alhena, Kore.ai** | AI shopping/support agents for single stores | Chat UX | Single-merchant tools. Possible partners, not competitors |

### 6.2 Positioning

```
                 Live multi-vendor price competition
                               ▲
          Priceline NYOP ●     │                ★ eBuzz.ai
          Sokoz ●              │
                               │
  Catalog / ──────────────────────────────────────────►  Conversational /
  content-heavy                │                         problem-first
          Temu ● Shein ●       │        ● Alexa for Shopping
          Amazon ●             │        ● ChatGPT ● Perplexity ● Google AI Mode
          Honey ●              │
                               ▼
                    Static / passive pricing
```

**No one currently combines** (1) problem-first conversational discovery, (2) live competitive offers from multiple vendors at the shortlist moment, and (3) ad-funded games that pay shopping credits.

---

## 7. Revenue model & pricing

| Stream | Mechanism | Pricing (launch) | Share of revenue in Y5 (est.) |
|---|---|---|---|
| **Transaction commission** | % of GMV on every sale | 8–15% by category (blended ~11–12%) | ~55% |
| **Retail media: Deal Boost & sponsored offers** | Vendors pay to highlight an offer or appear in "Also consider" | CPC / fixed boost fee; always labelled | ~18% |
| **Play-zone advertising** | Rewarded video, banners, brand-sponsored levels | CPM (tier-1 rewarded ~$16–20) | ~16% |
| **Vendor SaaS** | Deal Room Pro (auto-bid, analytics, Problem Radar) | Free · Pro $149/mo · Enterprise $999/mo | ~8% |
| **Affiliate** | Top10 content linking to products we don't stock | 3–15% of partner sales | ~2% |
| **Future: eBuzz+ membership** | Free shipping, extra game lives, priority deals | $4.99/mo (Year 3+) | – |

**Vendor promise:** *"No listing fees. Pay when you win."*

---

## 8. Unit economics (Year 3 steady-state estimate)

| Per order | $ |
|---|---|
| Average order value (AOV) | 82.00 |
| Commission (11.5%) | 9.43 |
| Retail media per order | 2.46 |
| Payment processing (~2.4% GMV) | (1.97) |
| AI inference & cloud per order | (2.25) |
| Customer service, returns, fraud losses | (0.41) |
| **Contribution per order (before marketing)** | **7.26** |

| Per customer | |
|---|---|
| Orders / active buyer / year | 2.4 |
| Contribution from orders / year | $17.40 |
| Play-zone ad revenue per active user / year (net of prizes) | ~$1.80 |
| 3-year LTV (retention 100% → 55% → 40%) | ~$37 |
| Blended CAC (paid + content) | ~$12.70 |
| **LTV / CAC** | **~2.9–3.1x** |
| CAC payback | ~8 months |

---

## 9. Go-to-market

### 9.1 Phases

| Phase | Timing | Focus | Targets |
|---|---|---|---|
| **0. Concierge MVP** | Months 0–4 | 1 vertical, 30 design-partner vendors, Deal Room with manual + auto-bid, 1 game | 5k waitlist, 1k beta buyers, H1–H3 signal |
| **1. Wedge launch** | Months 5–12 | Home, Sleep & WFH Wellness; content engine live on 50 problem clusters | 150k MAU, 300 vendors, $4.7M GMV (Y1) |
| **2. Adjacent verticals** | Year 2 | Pet, Baby & Kids, Outdoor, Small Kitchen | 700k MAU, 1,500 vendors |
| **3. Protocol distribution** | Year 2–3 | UCP/ACP endpoints; eBuzz offers inside third-party agents | 20% of GMV via external agents |
| **4. Scale & international** | Year 4–5 | UK/Canada/Australia; brand-sponsored games at scale | 12M MAU, $1B GMV |

### 9.2 Customer acquisition
- **Owned content (lowest CAC):** Top10 guide pages per problem cluster, 60–90 second "problem → solution" videos on YouTube Shorts, TikTok and Instagram Reels. All human-approved.
- **Community:** Reddit/Discord presence around problem communities (sleep, WFH, pets). Genuine and disclosed, never astroturfing.
- **Referral:** "Give $5, get $5" plus bonus game lives.
- **Paid:** Search ads on problem queries ("best chair for lower back pain"), creator partnerships.
- **Partnerships:** Employer wellness programmes (WFH stipends), credit-card-linked offers.

### 9.3 Vendor acquisition
- The **Supplier Scout Agent** finds brands whose products fit trending problems and sends personalised, CAN-SPAM-compliant outreach. It books calls; humans close.
- Pitch: *"Your competitor's shopper is about to buy. Want a chance to win them?"*
- Onboarding in < 48 hours: e-sign contract, Shopify/Amazon/CSV catalog import, AI catalog clean-up, first auto-bid rules.
- Launch incentive: 0% commission for the first 30 days or $5k GMV.

---

## 10. The agentic platform

### 10.1 Architecture

```
┌─────────────────────────── Experience layer ────────────────────────────┐
│ Customer Concierge │ Deal Room │ Supplier Hub │ Finance │ Control Tower │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │  (chat + UI components)
┌──────────────────────── Agent orchestration layer ──────────────────────┐
│ Planner/Router · Durable workflows · Policy engine · Human-approval     │
│ queue · Memory & context · Evaluation & monitoring · Audit log         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │  tools via MCP / APIs
┌──────────────────────────── Tools & data ───────────────────────────────┐
│ Catalog & search index · Offer engine · Payments (Stripe Connect) ·      │
│ Shipping APIs · Tax engine · CRM · E-sign · YouTube/CMS · Ad server ·   │
│ Licensed data (Trends, social, review APIs) · UCP / ACP endpoints       │
└─────────────────────────────────────────────────────────────────────────┘
```

**Model strategy:** high-reasoning models (e.g. Claude Opus 5) for planning, negotiation and legal/finance reasoning; fast, cheap models (e.g. Claude Haiku 4.5) for high-volume classification, catalog clean-up and customer-service triage. Deterministic code (not LLMs) for money movement, tax calculation and pricing limits.

### 10.2 Agent catalog

| Domain | Agent | What it does | Human checkpoint |
|---|---|---|---|
| **Demand intelligence** | **Problem Radar** ("Item Search") | Watches licensed social, forum, review and search-trend data for trending problems and complaints about current products | Weekly category review |
| | **Review Miner** | Summarises product reviews: sentiment, recurring defects, fake-review signals | – |
| | **Product Research** | Links problems to products; tracks trending and commonly searched items | Category manager approves new clusters |
| **Content** | **Top10 Lists** | Writes Top10 guide pages with methodology, sources and disclosures | Editor approval before publishing |
| | **Video Studio** | Writes the script, storyboard, voiceover and edit for 60–90 second videos | **Required human approval**; AI-content label |
| | **Publisher** | Uploads to YouTube and the blog, adds links, tracks performance | – |
| **Supply** | **Supplier Scout & Outreach** | Finds vendors, qualifies them, runs personalised outreach, books calls | Human closes contract |
| | **Contract Agent** | Drafts vendor agreements from templates and flags deviations | Legal approval over set thresholds |
| | **Catalog QA / Onboarding** | Normalises SKUs, images, attributes, compliance fields (e.g. Prop 65, CPSC) | Exceptions queue |
| **Commerce** | **Shopping Concierge** | Customer chat: problem diagnosis, plans, shortlists | – |
| | **Negotiation Broker** | Runs Deal Room sessions, applies guardrails, prevents collusion patterns | Anomaly alerts |
| | **Vendor Auto-bid** (vendor-side) | Replies to offers within vendor-set rules | Vendor sets rules |
| | **Search-to-Order** | Cart, checkout, address and payment orchestration | – |
| **Fulfilment** | **Track Shipping** | Proactive delivery ETAs, exception handling | – |
| | **Returns & Refunds** | Return eligibility, labels, refunds within policy | Refunds > $200 |
| | **Customer Service** | Tier-1 support across chat and email | Escalation to humans |
| **Money** | **Order-to-Cash** | Capture, commission split, vendor payouts, reconciliation | Payout batch approval |
| | **Financial (FP&A)** | Daily P&L, forecasting, prize-pool governance | CFO review |
| | **Tax** | Marketplace-facilitator sales tax, 1099-K reporting | Accountant sign-off |
| **Risk** | **Fraud & Trust** | Payment fraud, promo abuse, fake reviews, seller verification | High-risk cases |
| | **Legal** | Policies, terms, takedown handling, contract review | General counsel |
| | **Regulatory Watch** | Tracks FTC, state AG, EU DFA/DSA, sweepstakes, AI-disclosure rules; opens compliance tickets | Compliance lead |
| **Growth** | **Game Economy** | Balances prize pool vs. ad revenue; detects bots | Weekly |
| | **Ad Ops** | Ad inventory, brand-sponsored levels, labelling | – |
| | **Vendor Success** | Coaches vendors on offers, catalog, performance | – |

### 10.3 AI governance
- **Autonomy levels** per agent: L0 suggest → L1 act with approval → L2 act, then notify → L3 fully autonomous within limits.
- **Hard limits in code:** money movement, refunds, price floors, publishing.
- **Evaluations:** every agent has a test set, regression checks before each release, and live quality sampling.
- **Audit log:** every agent action is recorded with inputs, tools used and outputs.
- **Data sourcing:** licensed APIs and data partners, robots.txt and terms-of-service compliance. **No scraping behind logins.** (Recent legal fights over AI agents on marketplace sites show the risk.)

---

## 11. Operations plan

| Process | Owner | Agent support | SLA |
|---|---|---|---|
| Vendor onboarding | Vendor Success | Scout, Contract, Catalog QA | < 48 h |
| Catalog updates | Supplier | Catalog QA | Real time |
| Deal Room sessions | Vendor Manager | Negotiation Broker, Auto-bid | Reply < 5 min |
| Fulfilment | Vendor ships (drop-ship). eBuzz Fulfilment partner optional (Year 2) | Track Shipping | Vendor ships in ≤ 2 business days |
| Customer support | CX Lead | Customer Service | First reply < 1 min (AI), < 4 h (human) |
| Returns | CX + Vendor | Returns & Refunds | Refund ≤ 3 days after return scan |
| Payouts | Finance | Order-to-Cash | Weekly, T+7 after delivery |
| Content | Editor | Top10, Video, Publisher | 20 videos/week at launch |
| Compliance | Compliance Lead | Regulatory Watch, Legal | Monthly review |

**Fulfilment model:** marketplace with vendors shipping directly (no inventory risk). eBuzz sets the shipping and returns rules and scores vendors (on-time rate, defect rate, response time).

---

## 12. Technology plan

> The full **[System Architecture](../architecture.html)** page has the logical architecture, 40 tool categories with alternatives and pros/cons, and the security & compliance program.

| Layer | Choice (initial) |
|---|---|
| Frontend | Next.js/React web app + PWA; native apps in Year 2 |
| Chat UI | Streaming chat with structured "UI component" messages (cards, tables, forms) |
| Backend | TypeScript/Node services + Python for ML; Postgres; Redis; vector search |
| Real-time | WebSockets for Deal Room; event bus (Kafka or managed equivalent) |
| Workflows | Durable workflow engine (e.g. Temporal) for agents and orders |
| AI | Claude models via API; MCP servers as tools; evaluation harness |
| Payments | Stripe Connect (marketplace payouts, KYC), wallet credits in an internal ledger |
| Commerce protocols | UCP and ACP endpoints (Year 2) |
| Games | HTML5 canvas games, server-side score checks, anti-bot |
| Ads | Google Ad Manager / rewarded video mediation within the Play zone only |
| Security | SOC 2 Type I (Year 1) → Type II (Year 2); PCI handled by the payment provider |
| On-device data | **SQLite on every device** (web: SQLite-WASM persisted to OPFS/IndexedDB; iOS/Android: native SQLite) |
| Sync | Local-first replication (outbox → central; change feed → devices), end-to-end encrypted vault for PII (see 12.1) |

### 12.1 Local-first data architecture & privacy

**Principle:** personal and financial details stay on the user's own devices as much as possible. The central database stores only the attributes the business *must* have. Everything else syncs **end-to-end encrypted**: the central database stores only ciphertext and can't read it.

```
 Device A (SQLite)            eBuzz central               Device B (SQLite)
 ┌──────────────────┐   push   ┌────────────────────┐  pull   ┌──────────────────┐
 │ plaintext rows   │ ───────► │ required columns   │ ──────► │ plaintext rows   │
 │ + outbox         │          │ (plaintext)        │         │ (decrypted with  │
 │ memory (local)   │  AES-GCM │ + vault ciphertext │         │  the account key)│
 └──────────────────┘ ───────► └────────────────────┘ ──────► └──────────────────┘
```

| Data | Where it lives | Central copy | Why central needs it |
|---|---|---|---|
| Concierge memory, conversations | Device only | None | Not needed |
| Name, email, phone, street address, ZIP | Device + E2EE vault | Ciphertext only | Only synced between the user's devices. Auth uses a passkey plus a salted email hash held by the identity provider |
| State / region | Device + central | Plaintext | Sales-tax calculation, territory routing |
| Preferences | Device + E2EE vault | Consent flags only | Legal record of consent for live offers |
| Orders | Device + central | Order ID, pseudonymous user ID, SKU, vendor, qty, prices, tax, credits, status | Settlement, commission, tax, returns, fraud |
| Shipping address for an order | Device + E2EE vault | Not stored | Released to the fulfilling vendor through a one-time, expiring fulfilment token |
| Card / bank details | Payment processor vault | Token reference only | PCI scope stays with the processor |
| Wallet credit ledger | Device + central | Amount, type, date | Liability accounting, win-limit enforcement, abuse prevention |
| Cart | Device + central | SKU, qty, price, offer flag | Continue on another device |
| Staff (supplier & eBuzz) | Device + org vault | Role, scope, status | Server-side access control |

**Sync protocol.** Each write goes to local SQLite first (so it works offline). Changes go into an outbox. On sync, each row is split into central columns (plaintext) and private columns (sealed with AES-256-GCM using a per-account key derived on the device). Central keeps a per-record version. Devices pull newer versions and decrypt the vault locally. Conflicts are resolved last-writer-wins per record (per field for profile data), with a server-assigned version and an audit trail.

**Key management.** The account key is created on the first device and shared with new devices through a device-to-device approval (QR code or passkey-protected key wrap). A recovery key is offered to the user. eBuzz never holds the unwrapped key. Losing every device *and* the recovery key means the vault can't be recovered (orders and credits remain, since they are central).

**What admins see.** The Admin Console works from central data, where customers are pseudonymous IDs. Support staff ask the customer to share details inside a case (a time-boxed, audited share) instead of browsing PII.

**Benefits:** a smaller breach impact, easier compliance with GDPR/CCPA data minimisation, faster offline-capable apps, and trust as a marketing point. **Trade-offs:** harder server-side analytics on PII (we use aggregated, pseudonymous data instead), more complex key recovery, and support flows that need the customer's consent to view details.

The prototype implements this model: each portal opens a real SQLite database in the browser, syncs to a simulated central store, and encrypts PII with WebCrypto AES-GCM. Open any portal with `?device=phone` to watch a second device sync.

---

## 13. Legal, regulatory & compliance

| Area | Requirement | Plan |
|---|---|---|
| **Entity** | Delaware C-corp | Founders' equity with 4-year vesting; IP assignment |
| **Marketplace law** | INFORM Consumers Act (high-volume third-party seller verification and disclosure) | Seller KYC during onboarding |
| **Sales tax** | Marketplace-facilitator laws in US states | Tax engine collects and remits |
| **Consumer protection** | FTC Act §5 (unfair/deceptive practices), FTC rules on fake reviews and endorsements, "click-to-cancel" style subscription rules | Labelled sponsorship, review integrity, easy cancellation |
| **Personalised pricing** | State algorithmic-pricing disclosure laws (e.g. New York) | Label: "This offer was set for you in a live session." |
| **Antitrust** | Sherman Act §1 (no facilitating collusion) | Session-scoped, anonymised "price to beat"; no aggregated competitor feeds; counsel review |
| **Games / promotions** | State sweepstakes/lottery laws; "no purchase necessary"; skill vs. chance | Skill-based, free alternative entry, official rules, published odds, 18+, excluded states where needed |
| **Privacy** | CCPA/CPRA and state privacy laws; GDPR (international) | Local-first storage with an E2EE vault for PII (section 12.1), consent management, data minimisation, deletion rights |
| **AI** | AI-content disclosure (YouTube synthetic-media labels), EU AI Act transparency (international), chatbot disclosure laws | "You're chatting with an AI" label; AI video labels |
| **Email/SMS outreach** | CAN-SPAM, TCPA | Opt-outs, no cold SMS |
| **Product safety** | CPSC recalls, Prop 65 | Catalog QA checks, recall monitoring |
| **EU (future)** | DSA, upcoming **Digital Fairness Act** (dark patterns, addictive design, gamification) | Design to the stricter standard from day 1 |

**Key policies to publish:** Terms of Service, Seller Agreement, Privacy Policy, Deal Room Rules, Game Official Rules, Returns Policy, Prohibited Items, AI Transparency Statement.

---

## 14. Team & organisation

### 14.1 Founding team (to hire / confirm)
- **CEO:** marketplace and commerce operator
- **CTO:** AI/agent systems and real-time platforms
- **Head of Marketplace:** vendor acquisition and category management
- **Head of Growth & Content:** SEO, short-form video, community

### 14.2 Headcount plan

| Function | Y1 | Y2 | Y3 | Y5 |
|---|---|---|---|---|
| Engineering & AI | 7 | 14 | 26 | 70 |
| Product & design | 2 | 4 | 7 | 18 |
| Marketplace / vendor success | 2 | 5 | 10 | 28 |
| Growth & content | 1 | 3 | 7 | 20 |
| CX, trust & safety | 1 | 2 | 5 | 16 |
| Finance, legal, people | 1 | 2 | 5 | 18 |
| **Total** | **14** | **30** | **60** | **170** |

Agent-first operations keep CX, finance and content teams about **60–70% smaller** than a traditional marketplace at the same GMV.

### 14.3 Advisors to recruit
Marketplace economist (auction design), antitrust counsel, promotions/sweepstakes counsel, former retail-media leader.

---

## 15. Financial plan (5-year projections, estimates)

### 15.1 Key drivers

| Driver | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---|---|---|---|---|
| MAU (end of year) | 150k | 700k | 2.5M | 6.0M | 12.0M |
| Orders | 60k | 450k | 2.0M | 5.5M | 12.0M |
| AOV | $78 | $80 | $82 | $84 | $85 |
| **GMV** | **$4.7M** | **$36.0M** | **$164M** | **$462M** | **$1,020M** |
| Blended commission | 10.0% | 11.0% | 11.5% | 12.0% | 12.0% |
| Active vendors | 300 | 1,500 | 5,000 | 12,000 | 25,000 |

### 15.2 Income statement ($M)

| | Y1 | Y2 | Y3 | Y4 | Y5 |
|---|---|---|---|---|---|
| Commission revenue | 0.47 | 3.96 | 18.86 | 55.44 | 122.40 |
| Retail media (Deal Boost, sponsored) | 0.05 | 0.72 | 4.92 | 16.17 | 40.80 |
| Play-zone ad revenue | 0.11 | 1.06 | 4.80 | 14.90 | 36.00 |
| Vendor SaaS | 0.08 | 0.80 | 3.13 | 8.58 | 17.88 |
| Affiliate | 0.15 | 0.60 | 1.50 | 2.50 | 3.50 |
| **Total revenue** | **0.86** | **7.14** | **33.21** | **97.59** | **220.58** |
| Game prizes (credits redeemed) | (0.04) | (0.42) | (1.92) | (5.96) | (14.40) |
| Payment processing | (0.11) | (0.86) | (3.94) | (11.09) | (24.48) |
| AI inference & cloud | (0.60) | (1.80) | (4.50) | (9.00) | (15.00) |
| CX, returns, fraud losses | (0.02) | (0.18) | (0.82) | (2.31) | (5.10) |
| **Gross profit** | **0.08** | **3.88** | **22.03** | **69.23** | **161.60** |
| *Gross margin* | *9%* | *54%* | *66%* | *71%* | *73%* |
| Marketing & acquisition | (2.00) | (6.00) | (14.00) | (28.00) | (60.00) |
| People | (2.40) | (5.40) | (11.40) | (21.50) | (34.00) |
| G&A, legal, insurance, compliance | (0.80) | (1.50) | (3.00) | (5.00) | (7.50) |
| **EBITDA** | **(5.12)** | **(9.02)** | **(6.37)** | **14.73** | **60.10** |
| *EBITDA margin* | – | – | – | *15%* | *27%* |

*Take rate on GMV (all revenue ÷ GMV): Y1 18%, Y2 20%, Y3 20%, Y4 21%, Y5 22%.*

### 15.3 Funding plan

| Round | Timing | Amount | Use |
|---|---|---|---|
| Pre-seed (founders/angels) | Now | $0.5–1.0M | MVP, 30 design partners |
| **Seed** | Month 0–3 | **$4.0M** | Wedge launch, prove H1–H6 |
| Series A | Month 15–18 | $15M | Adjacent verticals, protocol distribution |
| Series B | Year 3 | $35–40M | Scale growth, international |

Cumulative operating burn before break-even (≈ month 40): ~$20.5M.

### 15.4 Use of seed funds ($4.0M)
- Product & AI engineering: 45%
- Growth & content: 25%
- Vendor acquisition: 12%
- Legal, compliance, security: 8%
- Working capital & reserve: 10%

---

## 16. KPIs & dashboard

| Area | KPI | Y1 target |
|---|---|---|
| Demand | Problem-led sessions share | ≥ 50% |
| Conversion | Session → order | ≥ 4.5% (Deal Room on) |
| Deal Room | Vendor response rate / median time | ≥ 70% / ≤ 90 s |
| Deal Room | Conversion lift vs. control | ≥ 25% |
| Deal Room | Avg discount given | ≤ 8% of item price |
| Engagement | D30 retention (buyers) | ≥ 25% |
| Games | Prize pool / Play ad revenue | ≤ 40% |
| Supply | Active vendors / fill rate for top problems | 300 / ≥ 85% |
| Quality | On-time delivery / return rate | ≥ 95% / ≤ 8% |
| Unit economics | LTV/CAC / CAC payback | ≥ 3x / ≤ 9 months |
| Trust | CSAT / NPS | ≥ 4.6 / ≥ 50 |
| Agents | Autonomous resolution rate (CS) | ≥ 70% |

---

## 17. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cold start (not enough vendors per problem) | High | High | Single vertical; 0% launch commission; affiliate backfill for gaps |
| Antitrust / price-signalling claims | Medium | High | Session-scoped, anonymised bids; counsel sign-off; audit logs |
| Race to the bottom hurts vendor retention | Medium | High | Floors, value-based offers, max rounds, analytics showing ROI |
| Giants copy the Deal Room | Medium | Medium | Speed, vendor tool lock-in, protocol distribution |
| Sweepstakes / gambling classification of games | Medium | High | Skill-based, no purchase needed, published rules, state exclusions |
| Ad revenue below prize liability | Medium | Medium | Automatic prize-pool governor; brand-sponsored levels |
| AI errors (wrong product advice, bad refunds) | Medium | Medium | Evaluations, hard limits, human checkpoints, insurance |
| Content penalties (search, YouTube) | Medium | Medium | Human approval, real testing, volume caps, disclosures |
| Data sourcing / scraping lawsuits | Medium | High | Licensed data only; respect ToS; no login scraping |
| Fraud & promo abuse (multi-accounting for credits) | High | Medium | Device fingerprinting, KYC for payouts, credit caps |
| Payment / chargeback losses | Low | Medium | Stripe Radar, vendor reserves |
| Key-person risk | Medium | Medium | Documentation; agents encode processes |

---

## 18. Milestones (first 18 months)

> How the platform gets built: the **[Build Roadmap](../roadmap.html)** covers 29 AI build agents over 26 weeks, with tasks, dependencies, human gates, and token, time and cost estimates.

| Month | Milestone |
|---|---|
| 1 | Entity, seed close, counsel review of Deal Room & games |
| 2 | 30 design-partner vendors signed; clickable prototype tested with 50 shoppers |
| 4 | Private beta: Concierge + Deal Room (auto-bid) + Buzz Crush |
| 6 | Public launch in wedge vertical; 50 Top10 guides + 100 videos |
| 9 | 150 vendors; Deal Room Pro paid plan live |
| 12 | 150k MAU, $4.7M GMV (Y1), SOC 2 Type I |
| 15 | UCP endpoint live; second vertical (Pet) |
| 18 | Series A: $3M+ monthly GMV, LTV/CAC ≥ 3x |

---

## 19. Exit & long-term vision

- **Vision:** the default *"negotiation layer"* for AI commerce, where any AI agent (ours or someone else's) can get live, competitive offers for a shopper.
- **Strategic acquirers:** marketplaces and retailers (Walmart, eBay, Etsy), commerce platforms (Shopify), payments (Stripe, PayPal, Klarna), ad-tech/retail media networks.
- **IPO path:** at $3B+ GMV with 20%+ take rate and positive free cash flow.

---

## Appendix A — Sources & notes

- Amazon Rufus / Alexa for Shopping usage and incremental sales (2025): public reporting via PPC Land, Genrise.
- OpenAI Instant Checkout launch (Sept 2025) and retirement (March 2026); Google/Shopify Universal Commerce Protocol (Jan 2026): OpenAI, Hypotenuse AI, Exploding Topics, Ask Phill.
- McKinsey agentic-commerce projection ($3–5T by 2030): via Paz.ai summary.
- Consumer comfort with AI completing purchases (~17%) and AI shopping assistant market (~$12.8B, Grand View Research): via aitrove.ai summary.
- Rewarded video eCPM benchmarks (US ~$16–20): Business of Apps, RevenueLab, Playio.
- Temu Farmland/Fishland mechanics: public guides and reporting.
- Priceline Name Your Own Price history: Wikipedia, Brookings.
- Affiliate commission benchmarks (5–20%): Track360.
- Sweepstakes "no purchase necessary" rules: ViralSweep, Snipp, ANA.
- EU Digital Fairness Act scope and timing: Freshfields, Taylor Wessing.

*All projections are planning estimates for discussion and are not a forecast or offer of securities. Check third-party figures again before external use.*
