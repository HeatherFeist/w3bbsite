# Founder Launch Platform

The Founder Launch Platform is a set of routes inside the existing W3BB Worldwide Vite app. A visitor can arrive with an idea and leave with scores, a model match, a saved blueprint, and a coach. The business itself is still created in the Business Builder. Trust-Approved Certification is still the business-level capstone.

This release does not deploy the site.

## Architecture

The site stays a Vite + React single-page app. New screens live under `src/founder` and render inside the existing `PageShell`, so the navbar, footer, dark theme, and type stay the same.

Two persistence modes:

- **Demo mode** is the default. `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` is missing, so progress is stored in `localStorage` under `w3bb.founder.v1`. The banner on every Launch page says so.
- **Account mode** uses a separate Supabase client (`src/founder/supabaseClient.ts`) from the lead-capture client in `src/lib/db.ts`. Signing in pulls `founders.snapshot` and, on each change, writes that snapshot back and mirrors it into the normalized tables. If the cloud write fails, the browser copy remains and the banner says so.

AI calls never read a key in the browser. The client posts to `/api/founder-ai` (Cloudflare Pages Function) and, if that is not deployed, to the Supabase Edge Function `founder-ai`. Either function returns `{ error: "unconfigured" }` when no server key is set. The UI then keeps the rules-based result.

Lead capture, wallet minting, franchise bundles, and the existing program applications are untouched.

## Navigation

- Desktop: **Launch** sits beside the existing “Start Creating” action. **Command Center** appears from the `xl` breakpoint. The Ecosystem menu also lists “Start Your Business” and “Command Center”.
- Mobile: a Launch group in the menu links to the same two places.
- Homepage: a gold **Start Your Business** button under the existing hero actions, plus a band directly under the hero.
- Footer Platform column, Resources, and Choose Your Path each link in without removing the current destinations.
- Inside Launch, a horizontal section nav covers overview, assessment, results, matches, blueprint, command center, coach, funding, pathways, and profile.

`/launchpad` remains the Entrepreneur Launchpad. `/launch` is this platform. They are different programs.

## Page map

| Route | What it is |
| --- | --- |
| `/launch` | Overview and the four-step journey |
| `/launch/assess` | Multi-step assessment with a progress bar. Answers and the current step save as you go. |
| `/launch/results` | Three scores, the archetype, and the weight breakdown |
| `/launch/matches` | Ranked business models. Rules are always visible. An optional advisor can explain the top three. |
| `/launch/blueprint` | Saved blueprint, including the handoff into the 8 existing Business Builder steps |
| `/launch/dashboard` | Command center |
| `/launch/coach` | Persistent coach thread |
| `/launch/funding` | Sample funding matches and funding-readiness |
| `/launch/certifications` | Seven new learning pathways and the Trust Certification capstone link |
| `/launch/profile` | Photo, intro video, story, skills, ventures, milestones, achievements, progress |
| `/launch/account` | Email/password when Supabase is configured. Otherwise an explanation of demo mode |

Existing routes that the journey links to, and does not replace:

- `/build` and `/#builder` — Business Builder
- `/launchpad` — Entrepreneur Launchpad
- `/zero-dollar-startup` — Zero-Dollar Startup Path, emphasized when capital is none or under about $1,000
- `/certification` — Trust-Approved Certification application
- `/ecosystem` — CDI, the W3BB digital hub, and sponsored businesses
- `/community` — the live community. The dashboard’s community card is a placeholder that links here

## How this sits in the ecosystem

CDI is the nonprofit backbone. W3BB is the digital hub. Sponsored businesses are the network. Launch is the front door for a person who only has an idea.

The blueprint’s “Hand this to the Business Builder” list is generated from `BUILDER.steps` in `src/data/site.ts`, so the eight step titles stay the site’s own copy: naming and branding, product development, asset generation, business logic, customer journey design, operational structure, multimedia creation, and launch preparation.

There is no individual course catalog on the site today. The seven pathways are new self-checked tracks:

1. Business Foundations
2. AI Entrepreneurship
3. Sales & Marketing
4. Operations
5. Financial Literacy
6. Business Technology
7. Startup Launch Readiness

Checking every module in a pathway raises the credibility score, which is `round(completed pathways / 7 × 100)`. That score is not the Trust-Approved badge. The badge remains a business-level review backed by the Webb Family Dynasty Trust, applied for on `/certification`.

## Schema

Migration: `supabase/migrations/20261116000000_founder_platform.sql`.

An optional follow-up, `20261116000001_founder_pgvector_optional.sql`, adds `coach_memory.embedding vector(1536)` only when pgvector can be created. The app does not read that column in this release.

| Table | Owner | Notes |
| --- | --- | --- |
| `profiles` | `id = auth.uid()` | Name and email |
| `founders` | `user_id` | Profile fields, XP, level, credibility, and `snapshot` |
| `assessments` | one row per user | Status and step |
| `assessment_answers` | `user_id` | One JSON value per question |
| `scores` | one row per user | Three scores plus the factor breakdown |
| `archetypes` | one row per user | Computed archetype, not a shared catalog |
| `business_matches` | `user_id` | Ranked models |
| `blueprints` | one row per user | Full blueprint JSON |
| `coach_conversations` | one thread per user | |
| `coach_messages` | `user_id` | Thread history |
| `coach_memory` | one row per user | Short text memory. Vector column is optional |
| `tasks` | `user_id` | Launch tasks |
| `goals` | `user_id` | Weekly goals |
| `milestones` | `user_id` | Milestones recorded on the profile |
| `certifications` | public read | The seven new pathways |
| `certification_progress` | `user_id` | Module checks |
| `funding_opportunities` | public read of `is_sample = true` | Sample rows only |
| `funding_applications` | `user_id` | “Saved for practice”, not a submission to a funder |
| `xp_events` | `user_id` | |
| `badges` | public read | Four badges |
| `founder_badges` | `user_id` | |

Row Level Security is enabled on every table above. Founder-owned rows require `auth.uid()` to match. Catalog tables allow read of the seeded rows and do not allow browser writes. The anon role used by the existing lead forms is revoked from the founder-owned tables.

`founders.snapshot` is what the app restores, so a chat transcript cannot be lost if one child write fails. The normalized rows are rewritten on each successful save for querying.

## AI agent architecture

The coach, the match explanation, and the blueprint narrative share one server proxy:

1. The browser builds the prompt from the assessment, scores, selected model, blueprint, open task, pathway progress, level, and the short memory string. It does not send the profile photo.
2. `src/founder/ai.ts` POSTs `{ messages }` to `/api/founder-ai`, then to `supabase.functions.invoke('founder-ai')`.
3. The function prepends a fixed policy: no invented grant amounts, deadlines, or revenue forecasts; no claim that a business is Trust-Approved; pathways are new tracks; point people at the Business Builder and the Launchpad.
4. The function calls an OpenAI-compatible chat-completions endpoint with `AI_API_KEY` or `OPENAI_API_KEY`, optional `AI_BASE_URL` (default `https://api.openai.com/v1`) and `AI_MODEL` (default `gpt-4o-mini`).
5. If the call is missing, fails, or returns nothing, the client keeps the deterministic rules text.

Rules live in:

- `src/founder/scoring.ts` — scores and archetype
- `src/founder/matching.ts` — model ranking
- `src/founder/blueprint.ts` — blueprint, including the builder handoff
- `src/founder/coach.ts` — on-device coach
- `src/founder/funding.ts` — sample opportunity matching

Match scores stay rules-based even when the advisor adds a paragraph, so the ranking does not depend on a model.

The Pages function is unauthenticated in this MVP so demo mode can use it once a key exists. Protect the route with Cloudflare rate limits before pointing it at a paid model. The Supabase function uses the platform JWT check when deployed with verify-jwt left on.

## User journey

1. Homepage or `/launch` → take the assessment.
2. Eleven required steps, then a review. Leaving and returning resumes the saved step.
3. Results show Founder Readiness, Business Launch, and Funding Readiness, plus one archetype.
4. Matches rank nine models. The founder picks one.
5. The blueprint is generated and saved. Low-capital answers add the Launchpad and the Zero-Dollar Startup Path to the plan.
6. The command center shows scores, blueprint status, pathway credibility, two sample funding matches, the latest coach note, tasks, weekly goals, badges, and level. Revenue and community are labeled placeholders.
7. The founder continues in `/build`. Certification pathways can be checked off at any time. Trust Certification is a separate application.

## Assessment and scoring

Steps, in order: skills, interests, experience, startup capital, time, revenue goal, personality, work style, industries, tech comfort, online or local.

Each score is `round(sum(signal% × weight / 100))`, clamped to 0–100. The same answers always produce the same numbers. The results page lists every factor with its weight, signal, and points.

Founder Readiness weights: experience 20, skills 15, time 15, tech comfort 10, work style 10, personality 10, capital 10, focus 10.

Business Launch weights: time 20, skills 15, revenue-goal fit 20, online/local clarity 10, experience 15, tech comfort 10, industry 10. Goal fit is lower when the revenue goal is larger than the time and capital can support. Naming a place (online, local, or hybrid) scores the clarity factor; none of the three is treated as better.

Funding Readiness weights: experience 25, capital 15, revenue-goal clarity 15, finance/sales/operations/legal skills 15, time 10, industry 10, operating structure 10.

Archetypes, chosen by the highest point total: Visionary Builder, Technical Founder, Service Entrepreneur, Creative Innovator, Community Builder, Educator, Business Operator. Ties break in the order listed in `ARCHETYPE_TIE_BREAK`, except an all-zero result stays Visionary Builder so an empty form does not pretend to be an operator. The results page shows the reasons that produced the winner.

Capital brackets in the assessment are self-reported planning buckets. They are not a fundraising target.

### Levels and badges

XP comes from events: assessment 150, blueprint 200, complete profile 120, first pathway 180, each further pathway 80, a launch task 25, setting a weekly goal 15, and the first coach exchange of a day 20. Events are stored by id, so repeating an action does not double the award.

| Level | XP |
| --- | --- |
| Explorer | 0 |
| Builder | 100 |
| Founder | 250 |
| Launcher | 500 |
| Operator | 800 |
| Visionary | 1,200 |
| Certified Leader | 1,800 |

Badges: assessment complete, blueprint created, profile complete, certification pathway earned. The last one is the learning track, not Trust-Approved Certification. “Certified Leader” is a platform level name, not that badge either.

### Funding samples

`src/founder/catalog.ts` is the list the UI matches against. The same rows are seeded into `funding_opportunities` with `is_sample = true`. Every card says sample, and the amount and deadline fields say they are not real. Matching uses industry, online/local preference, selected model, a stage derived from experience, revenue goal, and organization type.

## Setup

1. Demo mode needs nothing. `npm install`, `npm run dev`, open `/launch/assess`.
2. For accounts, create or reuse a Supabase project and run both SQL files in `supabase/migrations` (the SQL editor or `supabase db push`). Do not point the founder keys at a project that has not run the migration.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the Vite build. Leave them unset in any environment that should stay in demo mode.
4. Confirm email auth (email + password) is enabled. If confirmations are required, the account page tells the founder to confirm before signing in. The browser copy is kept either way.
5. For the hosted coach, set `AI_API_KEY` (or `OPENAI_API_KEY`) as a secret on Cloudflare Pages and/or as a Supabase function secret. Deploy `functions/api/founder-ai.ts` with the Pages project, or `supabase functions deploy founder-ai`. Never prefix the key with `VITE_`.
6. Optional: `AI_BASE_URL` and `AI_MODEL` if you are not using the OpenAI default.
7. Optional: enable pgvector and run the second migration. The MVP does not query embeddings.
8. Build with `npm run build`. The existing Cloudflare static hosting keeps working. New routes are client-side, same as `/certification` and `/ecosystem`. This PR does not deploy.

`npm test` runs the scoring, matching, blueprint, funding, and progression tests. `npm run lint` covers the app.

## Roadmap

### MVP (this PR)

Assessment with save and resume, deterministic scores and archetype, rules-based matching with an optional advisor explanation, saved blueprint, founder profile, coach with history, command center, XP and badges, seven pathways linked to the existing Trust Certification page, sample funding hub, demo mode, and Supabase auth plus RLS for when keys are set.

### Phase 2

Deeper grant matching against programs an editor maintains, alerts when a real opportunity is added, pitch-deck generation from the blueprint, mentor and community connections, and revenue tracking that reads a real payments source instead of the placeholder card. Use `coach_memory.embedding` for retrieval if pgvector is enabled.

### Phase 3

A marketplace of offers, an investor network, cohorts, a partner ecosystem on top of the current sponsored businesses, and a mobile app. Trust-Approved Certification stays the business-level review it is today.

## Assumptions

- The live site at w3bbworldwide.com is this repo: the document title, theme color `#07080C`, canonical URL, and homepage copy match `index.html` and `src/data/site.ts`. `/certification` and `/ecosystem` match the existing pages.
- Founder accounts should not reuse the hardcoded lead-capture key unless someone deliberately sets that project’s URL and anon key in the new env vars and runs the migration there. The lead-capture client is left as it was.
- Pathway completion is a self-check. It does not create a certificate and it does not submit the Trust Certification form.
- “Certified Leader” and the pathway badge are platform progress, not the Webb Family Dynasty Trust seal.
- Revenue and community widgets are placeholders with no sample numbers.
- The hosted advisor is optional. The flow from the homepage through assessment, results, matches, blueprint, dashboard, and coach is complete with no keys.
