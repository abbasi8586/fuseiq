# FuseIQ v3.0 — Platform Documentation

**Generated:** May 1, 2026  
**Status:** Production Live  
**URL:** https://fuseiq.vercel.app  
**Owner:** Awais Abbasi (Abbasi Global LLC)  
**Lead Architect:** Rook AI v3.0

---

## Executive Summary

FuseIQ is a **cyber-luxury AI Agent Orchestration Platform** that enables businesses to build, deploy, and manage autonomous AI agent teams. Think of it as the " mission control" for AI workforce management — combining visual workflow builders, real-time monitoring, human-in-the-loop approvals, and cost optimization into a single cohesive platform.

---

## Architecture & Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.4 (Turbopack) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 3.5 + custom glassmorphism v2.1 |
| **Animation** | Framer Motion 12.38 |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime WebSocket) |
| **Payments** | Stripe (Checkout + Webhook) |
| **AI Backend** | DeepSeek Free Tier (default) + BYOK (Kimi, GPT-4o, Claude) |
| **State** | Zustand 5 + React Context |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts 3.8 |
| **Workflow** | React Flow (XYFlow) 12.10 |

### Design System: Glassmorphism v2.1
- **Void:** `#06070A` — primary background
- **Primary:** `#00D4FF` — neon cyan (actions, highlights)
- **Aurora:** `#B829DD` — purple (gradients, premium)
- **Signal:** `#00E5A0` — green (success, online)
- **Ember:** `#FF6B35` — orange (warnings, errors)
- **Gold:** `#D4AF37` / `#FFC857` — accent (Co-Pilot, premium features)

Effects: Multi-layer blur + saturate, neon glows, holographic cards, shimmer, status pulses, cyber dividers.

---

## Pages & Features — Complete Inventory

### 🏠 Public Pages
| Page | Status | Description |
|------|--------|-------------|
| **Landing** | ✅ Live | Cyber-luxury hero, feature grid, CTAs, footer |
| **Login** | ✅ Live | Supabase Auth with OTP, email, magic link |
| **Privacy Policy** | ✅ Live | Standard compliance page |
| **Terms** | ✅ Live | Standard compliance page |
| **Update Password** | ✅ Live | Password reset flow |

### 📊 Dashboard (Protected — `/dashboard/*`)

#### 1. Command Center (`/`) — LIVE
- Analytics overview with real-time charts (revenue, agent uptime, task completion)
- Cost breakdown cards (BYOK vs Platform spend)
- Active tasks table with live status
- Quick action buttons for common workflows
- **Data:** Live Supabase queries with real-time WebSocket subscriptions

#### 2. Agent Forge (`/agents`) — LIVE
- Create/edit AI agents with role, skills, framework selection
- Agent cards with status indicators, efficiency scores
- Framework badges (Kimi, GPT-4o, Claude, Grok)
- Search and filter by role/department

#### 3. Swarm Canvas (`/swarm`) — LIVE
- **Visual workflow builder** using React Flow
- Drag-and-drop nodes for agent tasks
- Animated connections with glowing edges
- Portal dropdown for adding new nodes
- Holographic canvas with glassmorphism styling

#### 4. Staff Directory (`/staff`) — LIVE
- Grid/list view toggle
- Filter by type: AI Agents / Human / Hybrid (All)
- Department filters (Engineering, Product, Marketing, etc.)
- Cards show: avatar, role, department, local time, timezone, efficiency, skills
- Real-time WebSocket updates when new agents join
- Search by name, role, department

#### 5. Co-Pilot (`/copilot`) — LIVE
- Full-page AI assistant with conversation history
- **Powered by DeepSeek Free Tier** (hidden as "FuseIQ AI")
- Platform guardrails — only answers FuseIQ-related questions
- BYOK override available in Settings
- Quick Actions sidebar (Deploy, Run Workflow, View Analytics, Request Approval)
- Copy-to-clipboard on assistant messages
- Rate limit detection with "Add BYOK key" CTA

#### 6. Agent Simulator (`/simulator`) — LIVE
- Test agents before production deployment
- **Default backend:** FuseIQ AI (DeepSeek Free Tier behind the scenes)
- BYOK model selector: Kimi K2.5, GPT-4o, Claude 3.5
- Prompt input with quick prompts
- Real-time cost estimation ($0.000 for default)
- Results panel: latency, tokens, cost, framework
- Error handling with API key configuration CTA

#### 7. Operations Hub (`/operations`) — LIVE
- Task management table
- Real-time status updates via WebSocket
- Priority indicators, assignee avatars
- Filter by status, priority, type

#### 8. Approvals (`/approvals`) — LIVE
- Human-in-the-loop approval workflow
- Risk scoring (low/medium/high)
- Approve/Reject actions with audit trail
- Real-time updates

#### 9. Communications (`/comms`) — LIVE
- Unified messaging across agent channels
- Channel list with unread indicators
- Message input with send
- Real-time message delivery

#### 10. Analytics (`/analytics`) — LIVE
- Revenue and usage charts
- Agent performance metrics
- Cost breakdown by provider
- Time-series data visualization

#### 11. Billing (`/billing`) — LIVE
- Stripe integration (Checkout + Webhook)
- Usage-based pricing display
- Subscription tier management
- Invoice history

#### 12. Team (`/team`) — LIVE
- Team member management
- Role assignment (Director, Manager, Member, Agent)
- Invite system with email
- Department assignment

#### 13. Marketplace (`/marketplace`) — LIVE
- Pre-built agent templates
- Category browsing
- Install/preview actions

#### 14. Audit Log (`/audit`) — LIVE
- Complete activity history
- Filter by user, action, date
- Export capability

#### 15. Settings (`/settings`) — LIVE
- Profile management
- API key configuration (BYOK)
- Integration settings (Kimi, OpenAI, Anthropic keys)
- Theme toggle (light/dark)
- Notification preferences
- Security settings

### 🤖 Floating Widgets (Global)

| Widget | Position | Status |
|--------|----------|--------|
| **Co-Pilot Floating** | Bottom-right | ✅ Live — Quick AI chat anywhere |
| **Help & Feedback** | Bottom-right | ✅ Live — Contact, Feedback, Quick Help, Simulator link |

---

## Backend & API Infrastructure

### Database (Supabase PostgreSQL)
**Tables:**
- `agents` — AI agent definitions
- `users` — Platform users (auth via Supabase Auth)
- `workflows` — Swarm Canvas saved workflows
- `tasks` — Operations tasks
- `approvals` — Approval workflow records
- `messages` — Communications messages
- `api_keys` — BYOK keys (hashed, with permissions)
- `audit_logs` — Activity audit trail
- `billing_events` — Stripe billing records
- `executions` — Workflow execution history

### API Routes (`/api/*`)
| Route | Purpose |
|-------|---------|
| `/api/agents` | CRUD for agents |
| `/api/agents/[id]` | Single agent operations |
| `/api/workflows` | Workflow CRUD |
| `/api/tasks` | Task management |
| `/api/tasks/[id]` | Single task ops |
| `/api/executions` | Workflow execution history |
| `/api/approvals` | Approval workflow API |
| `/api/messages` | Communications messaging |
| `/api/channels` | Message channels |
| `/api/billing/checkout` | Stripe Checkout session |
| `/api/billing/webhook` | Stripe Webhook handler |
| `/api/settings/api-keys` | BYOK API key management |
| `/api/audit-log` | Audit log queries |
| `/api/activity-logs` | Activity tracking |
| `/api/external/heartbeat` | External agent heartbeat |
| `/api/contact` | Contact form submission |
| `/api/feedback` | Feedback form submission |
| `/api/help` | Quick Help AI backend |
| `/api/copilot` | Co-Pilot AI backend |
| `/api/simulator/run` | Simulator AI backend |

### Authentication
- **Supabase Auth** with SSR (Server-Side Rendering)
- Email + Password + OTP
- Magic link login
- Password reset flow
- Middleware protection for dashboard routes
- Public access for landing, login, privacy, terms

### Real-Time Features
- **WebSocket subscriptions** via Supabase Realtime
- Live agent status updates (online/offline/busy)
- Live task status changes
- Live approval notifications
- Live staff directory updates

---

## AI Architecture

### DeepSeek Integration (Default Backend)
- **Model:** `deepseek-chat` (Free Tier)
- **Platform guardrails:** System prompt restricts responses to FuseIQ domain only
- **Timeout:** 15s with AbortController (Node-compatible)
- **Rate limit handling:** HTTP 429 detection with retry-after
- **Quota exhaustion:** Graceful fallback with BYOK suggestion
- **API key:** Platform default key configured in Vercel env

### BYOK (Bring Your Own Key) — Override
| Provider | Model | Key Env Var |
|----------|-------|-------------|
| Kimi | `kimi-k2.5` | `KIMI_API_KEY` |
| OpenAI | `gpt-4o` | `OPENAI_API_KEY` |
| Anthropic | `claude-3-5-sonnet-20241022` | `ANTHROPIC_API_KEY` |

Users configure BYOK in Settings → Integrations.

### AI Guardrails (Do's & Don'ts)
**✅ DO Answer:**
- Agent management, deployment, configuration
- Workflow orchestration (Swarm Canvas)
- Cost tracking, budgets, BYOK setup
- Simulator testing
- Approvals, risk thresholds
- Communications, channel management
- Staff Directory, roles, performance
- Billing, subscriptions, invoices
- Security, API keys, audit logs
- Troubleshooting platform issues

**❌ DON'T Answer:**
- General knowledge (history, science, weather)
- Personal advice (career, health, legal)
- External code projects
- Homework or math problems
- News or current events
- Creative writing off-platform
- Real-time web search

**Off-topic response:** *"I'm specialized for FuseIQ platform operations. For that question, try a general AI assistant."*

---

## What's Been Achieved ✅

### Phase 1 — Foundation (Complete)
- [x] Next.js 16 + TypeScript project scaffold
- [x] Supabase integration (auth, database, realtime)
- [x] Glassmorphism v2.1 design system
- [x] Responsive layout with sidebar + header
- [x] Authentication flow (login, signup, password reset)
- [x] Landing page with cyber-luxury aesthetic
- [x] Dashboard shell with navigation

### Phase 2 — Core Features (Complete)
- [x] Command Center with analytics charts
- [x] Agent Forge (agent CRUD)
- [x] Swarm Canvas (visual workflow builder)
- [x] Staff Directory with real-time updates
- [x] Operations Hub (task management)
- [x] Approvals workflow (human-in-the-loop)
- [x] Communications Hub (unified messaging)
- [x] Team management
- [x] Audit logging

### Phase 3 — AI & Polish (Complete)
- [x] Co-Pilot AI assistant (page + floating widget)
- [x] Agent Simulator with live AI backend
- [x] Quick Help AI in Help & Feedback modal
- [x] DeepSeek Free Tier integration as default
- [x] BYOK override system (Kimi, GPT-4o, Claude)
- [x] AI guardrails (platform-only responses)
- [x] Rate limit handling with friendly messages
- [x] Demo page with Tesla narrative
- [x] Billing with Stripe integration
- [x] Marketplace for agent templates

### Phase 4 — UX Hardening (Complete)
- [x] Comprehensive bug sweep
- [x] Responsive fixes across all breakpoints
- [x] Card grid alignment (fixed columns, full stretch)
- [x] Tab bar consistency (equal width, matching height)
- [x] Staff Directory Hybrid → All naming fix
- [x] Branding: DeepSeek hidden, FuseIQ shown
- [x] Floating widget positioning (bottom-right)
- [x] Typography consistency
- [x] Loading states and empty states
- [x] Error boundaries and fallbacks

---

## What's Remaining / Next Phase 🚀

### High Priority — Pre-Launch
- [ ] **SOC 2 compliance framework** documentation
- [ ] **Enterprise SSO** (SAML/OIDC) for enterprise customers
- [ ] **Advanced analytics** (Mixpanel/Amplitude integration)
- [ ] **Mobile app** (React Native or Flutter)
- [ ] **Email notifications** system (SendGrid/Resend)
- [ ] **Slack/Discord integration** for agent alerts
- [ ] **Webhook system** for external integrations
- [ ] **Agent API** (REST + WebSocket for external agents)

### Medium Priority — Growth
- [ ] **Content marketing hub** (blog, docs, changelog)
- [ ] **SEO optimization** (meta tags, sitemap, structured data)
- [ ] **Affiliate/referral system**
- [ ] **White-label customization** (colors, logo, domain)
- [ ] **Multi-workspace support** (team isolation)
- [ ] **Role-based access control** (RBAC v2)
- [ ] **Advanced cost alerts** (budget thresholds, forecasts)

### Low Priority — Scale
- [ ] **On-premise deployment** option
- [ ] **AI model fine-tuning** interface
- [ ] **Custom workflow triggers** (webhook, schedule, event)
- [ ] **Agent marketplace monetization** (revenue share)
- [ ] **Federated learning** for agent improvement
- [ ] **Voice/SMS integration** for agents
- [ ] **iOS/Android native apps**

---

## Deployment & Infrastructure

| Service | Status | Details |
|---------|--------|---------|
| **Vercel** | ✅ Production | Auto-deploy on push to main |
| **Supabase** | ✅ Production | Project: `Fuse-iq` |
| **Stripe** | ✅ Test Mode | Ready for live keys |
| **DeepSeek** | ✅ Configured | Platform default key active |
| **Domain** | 🔄 Pending | Custom domain setup |

### Environment Variables (Production)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DEEPSEEK_API_KEY` (platform default)
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `KIMI_API_KEY` (optional BYOK)
- `OPENAI_API_KEY` (optional BYOK)
- `ANTHROPIC_API_KEY` (optional BYOK)

---

## Commit History (Recent)

```
cc20f67 — branding: hide DeepSeek, show FuseIQ + platform default API key
45340d1 — backup: pre-API-key-config
8c6a2c8 — fix: full-width grid cards + smaller arrowheads
5a4713c — feat: holographic Swarm Canvas with portal dropdown
703b178 — fix: equal-height grid columns — chart + cost breakdown
082f423 — fix: landing page CTAs to Next.js Link
71df4e4 — fix: three critical UX issues from screenshots
004b06d — fix: comprehensive pre-launch bug sweep
f20f017 — feat: swap platform logo to hexagonal lightning bolt
dd45918 — fix: three visual issues from screenshots
1455524 — fix: pre-launch polish — dead clicks, Co-Pilot position, copy, cost, v3.0→v1.0
055f4e4 — feat: Tesla-showroom demo page
9981f7f — feat: functional Simulator + Swarm Canvas backend
491f975 — feat: B product polish — Staff Directory, Sidebar, Billing, Co-Pilot
9422fb4 — fix: complete UX audit — login, demo, navigation, 404, auth flow
d85c405 — feat: real-time WebSocket for Operations, Approvals, Staff
5b9f496 — fix: demo page crashes + header buttons + analytics charts
```

---

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **Build Time** | <60s | ~39s |
| **Bundle Size** | <500KB | Analyzing |
| **Lighthouse** | >90 | Pending audit |
| **TTFB** | <200ms | Vercel Edge |
| **Auth Load** | <100ms | Supabase SSR |

---

## Security Checklist

| Item | Status |
|------|--------|
| Environment variables secure | ✅ No secrets in Git |
| API keys hashed in DB | ✅ Server-side only |
| Auth middleware active | ✅ Protected routes |
| Rate limiting | ✅ Via DeepSeek + Vercel |
| Input validation | ✅ Zod schemas |
| SQL injection prevention | ✅ Supabase parameterized |
| XSS protection | ✅ React sanitization |
| CSRF protection | ✅ Next.js built-in |

---

## Contact & Ownership

| Role | Entity |
|------|--------|
| **Founder/CEO** | Awais Abbasi |
| **Company** | Abbasi Global LLC |
| **Lead Architect** | Rook AI v3.0 |
| **GitHub** | github.com/abbasi8586/fuseiq |
| **Live URL** | https://fuseiq.vercel.app |

---

*Document generated by Rook AI — FuseIQ Phase 2 Execution Architect*  
*Last Updated: May 1, 2026 — 23:15 EDT*
