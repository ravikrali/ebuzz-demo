# eBuzz.ai — Investment Thesis

> **Tell us what's wrong. Brands compete live to fix it. Play a little, and save a little more.**

*Version 1.0 · September 2026 · Confidential draft for discussion*

---

## 1. The one-sentence thesis

Online shopping is moving from **searching catalogs** to **describing problems to an AI**, and the moment an AI narrows a shopper's choice to three products is the most valuable moment in commerce. eBuzz.ai turns that moment into a **live, transparent marketplace** where the shortlisted brands can compete for the sale in real time, while the shopper is funded by ads (through short games) to come back often.

## 2. Why now

| Shift | Evidence | What it means for eBuzz |
|---|---|---|
| Shoppers already use AI to decide | Amazon reported its AI assistant (Rufus, now folded into *Alexa for Shopping*) was used by 300M+ customers in 2025 and drove ~$12B in incremental annualised sales. | Conversational shopping is proven behaviour, not a bet on new habits. |
| Agentic commerce infrastructure is being standardised | Google and Shopify launched the **Universal Commerce Protocol (UCP)** in January 2026; OpenAI/Stripe's **Agentic Commerce Protocol (ACP)** is open. OpenAI retired ChatGPT Instant Checkout in March 2026 and went back to discovery only. | The *pipes* are becoming commodities. Money goes to whoever has the **supply-side relationship and the pricing leverage**, not whoever has the chat box. |
| Shoppers will research with AI, but hesitate to hand it the purchase | Industry surveys show only ~17% of consumers are comfortable letting an AI complete a purchase. | eBuzz keeps the human deciding and uses the AI to **negotiate for them**, which people trust more than an AI that just buys. |
| Gamified commerce works at scale | Temu (Farmland, Fishland) and Pinduoduo built big engagement loops with games that pay out credits. | The mechanic works. The open question is doing it without dark patterns. eBuzz funds prizes transparently from ad revenue. |
| AI cost collapse | Frontier-model inference and video generation costs have fallen enough to run research, content, and back-office agents per SKU and per order. | An agent-run company can do the work of a large ops team with ~15 people in year 1. |
| Market size | McKinsey estimates agentic commerce could drive **$3–5T** in annual revenue by 2030. | Even a thin slice is a large business. |

## 3. The insight: the shortlist is the new shelf

On Amazon or Temu, brands pay to be *seen* (sponsored listings, often 20–40% of what is shown). In a conversational interface there is no "page 1". There is a **shortlist of about 3**. Once a shopper is down to 3 options:

- The shopper has already done the hard work (need, budget, constraints). Intent is at its highest.
- Every brand on the shortlist has a 1-in-3 chance of winning. The marginal value of a small discount is huge.
- Today, nobody lets those brands **respond**. Prices are static and the brand never finds out it lost.

**eBuzz lets them respond.** Our Deal Room turns the shortlist into a short, bounded, real-time offer window (think *eBay "Send offer to interested buyers"* crossed with a *reverse auction*, but limited to 3–5 vendors, one shopper and a few minutes).

## 4. Why the model works (the flywheel)

```
 Problem-first chat  ──►  High-intent shortlists  ──►  Vendors compete live (Deal Room)
        ▲                                                         │
        │                                                         ▼
 Games + credits bring  ◄──  Ad revenue funds prizes  ◄──  Better prices → higher conversion
 shoppers back daily                                         → more vendors join → more supply
        ▲                                                         │
        └──────  AI content engine (Top10 pages, 60–90s videos) ◄─┘ feeds free traffic
```

1. **Demand side:** Problem-solving content (Top10 lists, short videos) plus a chat concierge pull in shoppers with specific problems, which means high intent.
2. **Supply side:** Vendors join because eBuzz gives them something no other channel gives: a **last-mile chance to win a customer who is about to buy a competitor's product**, and they pay only when they win (commission).
3. **Engagement:** Games paid for by ads give shoppers a reason to come back when they aren't shopping. Credits won nudge them into the next purchase. The **Buzz Feed** adds real reviews and stories that shoppers share to TikTok, Instagram, Facebook and X, which brings in new shoppers at almost no cost and creates labelled Sponsored and banner ad inventory.
4. **Data moat:** Every Deal Room session creates a data point about price elasticity: *what discount, for which problem, beats which competitor*. No catalog marketplace has this data. It powers vendor auto-bidding and becomes a paid insight product.

## 5. Why eBuzz can win against giants

| Competitor | What they have | Why they won't do this |
|---|---|---|
| Amazon (Alexa for Shopping) | Traffic, logistics, AI assistant | A live bidding war would cannibalise its $50B+ sponsored-ads business and train shoppers to haggle on its own 1P goods. |
| Google AI Mode / UCP | Intent, protocol | Google is a neutral router with an ad model. It won't referee price negotiations between merchants. |
| ChatGPT / Perplexity | Chat habit | They pulled back from checkout and have no merchant-side tooling for live offers. |
| Temu / Shein | Gamification, low prices | Mostly first-party/cross-border supply and heavy, content-dense UX. Weak trust in the West. |
| Honey / Capital One Shopping / Rakuten | Coupons, cashback | Passive discounts, no negotiation, and trust damage from commission-attribution controversies. |

**Our defensibility grows over time:**
1. **Two-sided network** in a focused vertical (problems → vendors that solve them).
2. **Proprietary negotiation data** (price elasticity by problem × competitor).
3. **Vendor workflow lock-in** (auto-bid rules, contracts, inventory, payouts all live in eBuzz).
4. **Agent-native operations**: a structurally lower cost base than incumbents.
5. **Protocol distribution**: eBuzz exposes its live deals as a UCP/ACP endpoint, so *other* AI agents can shop eBuzz offers. We win even when the shopper starts in Gemini or ChatGPT.

## 6. What must be true (key hypotheses to validate)

| # | Hypothesis | Kill / pivot signal | How we test it (first 6 months) |
|---|---|---|---|
| H1 | Shoppers will describe problems rather than search keywords | < 40% of sessions start with a problem statement | Landing tests + concierge MVP in 1 vertical |
| H2 | Vendors will answer live offer requests within 5 minutes | < 50% response rate or median > 5 min | 30 design-partner vendors; auto-bid rules |
| H3 | Live offers lift conversion enough to justify the margin given up | Conversion lift < 25% vs. static-price control | A/B: Deal Room on vs. off |
| H4 | Ad-funded games raise 30-day retention without destroying margin | Prize liability > 45% of game ad revenue, or D30 lift < 5 pts | Prize-pool governor; cohort analysis |
| H5 | AI content drives CAC-efficient traffic | Blended CAC > $25 in year 1 | Top10 + video engine on 50 problem clusters |
| H6 | Shoppers won't abuse "ask for discount" | > 60% of orders go through the discount-request flow | Rate limits + intent gating |
| H7 | Shoppers post and share on the Buzz Feed, and shares bring new buyers | < 5% share rate, or < 3% of new visitors come from shares | Share tracking; verified-review coverage per problem cluster |

## 7. The critical risks and how we handle them

1. **Antitrust / price signalling.** Showing vendors each other's live bids could be seen as helping them coordinate prices. → Bids are **scoped to a single shopper session**, show only the *price to beat* and anonymised rank, expire in minutes, and are never aggregated into a competitor price feed. Counsel review before launch.
2. **Race to the bottom.** → Vendor-set floors, auto-bid guardrails, and value levers other than price (bundles, free shipping, extended warranty).
3. **Gamification law and ethics.** → Skill-based games; free to play with no purchase needed; prizes are store credits with published odds and caps; 18+; no loot boxes; designed with the upcoming EU **Digital Fairness Act** in mind.
4. **Giants copy the feature.** → Move fast in one vertical, own the vendor tooling, and distribute through the protocols rather than fight them.
5. **AI content penalties** (search scaled-content policies, YouTube inauthentic-content rules). → Human approval, real product testing ("eBuzz Lab"), and a cap on publishing volume.

## 8. The ask

**Seed round: $4.0M** to reach Series A milestones in 18 months:

- Launch in **one wedge vertical: "Home, Sleep & Work-from-Home Wellness"** (back pain, poor sleep, allergies, small-space clutter, pet problems).
- 300 contracted vendors, 150k MAU, $4.7M GMV run-rate by month 12.
- Prove H1–H6 and show **LTV/CAC ≥ 3x** on the monthly cohort 6.

See the full [Business Plan](BUSINESS_PLAN.md) for details, financials and operating model.

---
*Figures marked as estimates are planning assumptions, not audited data. Third-party figures come from public reporting as of September 2026 and should be checked again before external distribution.*
