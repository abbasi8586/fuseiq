# FuseIQ v3.0 — AI Agent Command Center

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Directory Structure](#directory-structure)
4. [Features & Functions](#features--functions)
5. [Current Phase (Phase 1) Status](#current-phase-phase-1-status)
6. [Next Phase Roadmap](#next-phase-roadmap)
7. [Design System](#design-system)
8. [Database Schema](#database-schema)
9. [API & Integrations](#api--integrations)
10. [Deployment](#deployment)
11. [User Guide](#user-guide)
12. [Launch Strategy](#launch-strategy)

---

## Project Overview

**FuseIQ v3.0** is a next-generation AI Agent Orchestration Platform — a command center where humans and AI agents collaborate seamlessly. It provides real-time monitoring, workflow orchestration, cost tracking, and team management for AI-powered operations.

- **Owner:** Awais Abbasi (Abbasi Global LTD)
- **Live URL:** https://fuseiq.vercel.app
- **GitHub:** https://github.com/abbasi8586/fuseiq
- **Version:** 3.0.0-alpha
- **License:** Proprietary

### Vision
Build the operating system for AI-native teams — where AI agents are first-class team members with roles, responsibilities, and measurable output.

---

## Architecture & Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Custom Glass Components |
| Animation | Framer Motion |
| State | Zustand |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |

### Key Dependencies
```json
{
  "next": "16.2.4",
  "react": "19.2.4",
  "tailwindcss": "^4",
  "framer-motion": "^12.38.0",
  "supabase-js": "^2.104.1",
  "zustand": "^5.0.12",
  "recharts": "^3.8.1"
}
```

---

## Directory Structure

```
fuseiq/
├── .env.local              # Environment variables (gitignored)
├── .env.local.example      # Template for env vars
├── next.config.ts          # Next.js config
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── components.json         # shadcn/ui config
├── seed-agents.js          # Database seed script
├── test-supabase.js        # Supabase connection test
│
├── public/                 # Static assets
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── app/
│   │   ├── (dashboard)/            # Dashboard routes (grouped)
│   │   │   ├── page.tsx            # Command Center (Dashboard Home)
│   │   │   ├── layout.tsx          # Dashboard shell (Sidebar + Header)
│   │   │   ├── staff/
│   │   │   │   ├── page.tsx        # Server: Fetch from Supabase
│   │   │   │   └── client.tsx      # Client: Interactive staff directory
│   │   │   ├── agents/             # Agent Forge (AI management)
│   │   │   ├── operations/         # Operations Center (Kanban)
│   │   │   ├── approvals/          # Approval workflow
│   │   │   ├── analytics/          # Analytics & Reporting
│   │   │   ├── comms/              # Communications hub
│   │   │   ├── swarm/              # Swarm Canvas (multi-agent)
│   │   │   ├── simulator/          # Agent Simulator
│   │   │   ├── copilot/            # AI Co-Pilot
│   │   │   ├── marketplace/        # Agent Marketplace
│   │   │   ├── team/               # Team Management
│   │   │   ├── billing/            # Stripe Billing
│   │   │   ├── audit/              # Audit Log
│   │   │   └── settings/           # Settings
│   │   ├── page.tsx                # Landing/Marketing page
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles + Glassmorphism
│   │
│   ├── components/
│   │   ├── glass/                  # Glassmorphism components
│   │   │   ├── glass-card.tsx      # Base glass card
│   │   │   ├── kpi-card.tsx        # KPI metric card
│   │   │   ├── cost-ticker.tsx     # Live cost tracker
│   │   │   ├── progress-bar.tsx    # Animated progress
│   │   │   └── status-badge.tsx    # Status indicator
│   │   ├── data-display/
│   │   │   └── activity-feed.tsx   # Activity stream
│   │   ├── layout/
│   │   │   ├── sidebar.tsx         # Collapsible nav sidebar
│   │   │   └── header.tsx          # Top bar with search/notifications
│   │   └── ui/                     # shadcn/ui primitives
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       └── [30+ more]
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── client.ts           # Supabase client factory
│   │   ├── stores/
│   │   │   └── workspace-store.ts  # Zustand state store
│   │   └── utils.ts                # Utility functions (cn, etc.)
│   │
│   └── types/
│       └── index.ts                # All TypeScript interfaces
│
└── supabase/
    ├── migrations/                   # SQL migrations
    └── config.toml                 # Supabase CLI config
```

---

## Features & Functions

### 1. Command Center (Dashboard)
- **Real-time KPI Cards:** Active Agents, Executions Today, Success Rate, Avg Cost/Run
- **Active Agents List:** Live status, efficiency scores, execution counts
- **Execution Trends:** Time-series bar chart with period selection (1H, 24H, 7D, 30D)
- **Pending Approvals:** High/medium/low risk workflow approval cards with Approve/Reject
- **Activity Feed:** Real-time stream of agent events (start, complete, fail, approvals)
- **Cost Ticker:** Live cost breakdown by provider (OpenAI, Kimi, Anthropic, Google)

### 2. Staff Directory
- **Server-side data fetching** from Supabase `agents` table
- Grid/table view of all AI and Human team members
- Filters by department, status, type (AI/Human)
- Efficiency scores and workload metrics
- Role-based organization (Engineering, Product, Marketing, Support)

### 3. Agent Forge (Planned)
- Create and configure AI agents
- Framework selection (Kimi, CrewAI, LangGraph, AutoGen, OpenAI, Anthropic, Google)
- Provider API key management
- Agent role and department assignment
- Custom system prompts and configurations

### 4. Operations Center (Planned)
- Kanban board for task management
- Task creation, assignment, and tracking
- Priority levels (low, medium, high, urgent)
- Progress tracking with visual indicators
- Tag-based organization

### 5. Approval Workflow (Planned)
- Risk-based approval routing (low → critical)
- Estimated cost preview before approval
- One-click approve/reject with audit trail
- Auto-approval rules for low-risk actions
- Multi-signature for high-risk operations

### 6. Analytics (Planned)
- Execution volume charts
- Cost analysis by provider and framework
- Agent efficiency heatmaps
- Success/failure rate trends
- Custom report builder

### 7. Communications Hub (Planned)
- Team chat channels (AI + Human)
- Agent-to-agent messaging
- Department-specific channels
- Thread-based conversations
- Reaction support

### 8. Swarm Canvas (Phase 2)
- Visual workflow builder (drag-and-drop)
- Multi-agent orchestration
- Conditional branching and routing
- Real-time execution visualization
- Workflow versioning

### 9. AI Co-Pilot (Planned)
- Command palette (⌘K) for quick actions
- Natural language command execution
- Context-aware suggestions
- Agent deployment shortcuts
- System status queries

### 10. Marketplace (Planned)
- Pre-built agent templates
- Community-contributed workflows
- One-click deployment from marketplace
- Rating and review system
- Categories by use case

### 11. Billing & Usage (Planned)
- Stripe subscription management
- Usage-based billing (per execution)
- Cost caps and alerts
- Invoice generation
- Team plan management

### 12. Audit Log (Planned)
- Immutable activity history
- Compliance-ready export (CSV, PDF)
- Filter by actor, action, date range
- Tamper-evident logging

---

## Current Phase (Phase 1) Status

### ✅ Completed (April 27, 2026)

| Feature | Status | Notes |
|---------|--------|-------|
| Project scaffold | ✅ | Next.js 16 + Tailwind v4 + shadcn/ui |
| Glassmorphism design system | ✅ | Custom CSS utilities, glass-card, neon-button |
| Sidebar navigation | ✅ | 15 pages, collapsible, mode toggle (AI/Human/Hybrid) |
| Header with search | ✅ | Command palette trigger, notifications, user dropdown |
| Command Center dashboard | ✅ | KPIs, agent list, charts, approvals, activity feed |
| Supabase integration | ✅ | Real env vars, working client |
| Database schema | ✅ | 18 tables created |
| Agent seeding | ✅ | 8 AI agents pre-populated |
| Staff Directory | ✅ | Server + Client, live Supabase data |
| Vercel deployment | ✅ | Live at https://fuseiq.vercel.app |

### 🚧 In Progress / Partial

| Feature | Status | Notes |
|---------|--------|-------|
| Remaining page UIs | 🚧 | Placeholder pages exist, need content |
| Real-time data | 🚧 | Static demo data on dashboard |
| Authentication | ⬜ | Not yet implemented |

### ⬜ Not Started (Phase 2+)

| Feature | Phase |
|---------|-------|
| Supabase Auth | Phase 2 |
| Swarm Canvas (Visual Builder) | Phase 2 |
| Co-Pilot Command Palette | Phase 2 |
| Stripe Billing | Phase 2 |
| Real-time WebSocket updates | Phase 2 |
| Agent deployment API | Phase 2 |
| Workflow engine | Phase 3 |
| Marketplace | Phase 3 |
| Mobile responsive | Phase 3 |
| White-label/enterprise | Phase 4 |

---

## Next Phase Roadmap

### Phase 2 — Intelligence Layer (May 2026)

**Week 1-2: Authentication & Security**
- [ ] Supabase Auth integration (email/password, OAuth)
- [ ] Role-based access control (Director, Manager, Member, Viewer)
- [ ] Workspace/tenant isolation
- [ ] API key encryption at rest
- [ ] Row Level Security (RLS) policies

**Week 3-4: Real-time Data**
- [ ] Supabase Realtime subscriptions
- [ ] Live agent status updates
- [ ] Activity feed streaming
- [ ] Cost ticker with live updates
- [ ] Notification system (in-app + email)

**Week 5-6: Co-Pilot & Command Palette**
- [ ] ⌘K command palette component
- [ ] Natural language parser
- [ ] Quick actions (deploy agent, create task, view analytics)
- [ ] Context-aware suggestions based on current page
- [ ] Voice command support (Web Speech API)

**Week 7-8: Swarm Canvas MVP**
- [ ] React Flow or custom canvas component
- [ ] Drag-and-drop node builder
- [ ] Agent node, Task node, Condition node, Trigger node
- [ ] Simple sequential workflows
- [ ] Workflow execution engine (edge function)

**Week 9-10: Agent Forge Completion**
- [ ] Agent creation wizard (5-step form)
- [ ] Framework-specific configuration
- [ ] API key management (encrypted)
- [ ] Testing console (live agent test)
- [ ] Agent versioning

### Phase 3 — Scale & Marketplace (June 2026)

- [ ] Agent Marketplace (browse, install, rate)
- [ ] Pre-built workflow templates
- [ ] Team collaboration features
- [ ] Advanced analytics (custom reports, export)
- [ ] Mobile-responsive layout
- [ ] Dark/light mode toggle
- [ ] Public API with rate limiting
- [ ] Webhook integrations (Zapier, Make)

### Phase 4 — Enterprise (July 2026)

- [ ] SAML/SSO integration
- [ ] Audit log compliance (SOC 2)
- [ ] White-label customization
- [ ] On-premise deployment option
- [ ] Advanced security (IP allowlisting, MFA)
- [ ] Custom integrations SDK

---

## Design System

### Color Palette (Cyber-Luxury Glassmorphism)

| Token | Hex | Usage |
|-------|-----|-------|
| **Void** | `#06070A` | Primary background |
| **Abyss** | `#0A0B10` | Sidebar, panels |
| **Depth** | `#0F111A` | Cards, elevated surfaces |
| **Surface** | `#161925` | Glass card background (60% opacity) |
| **Ridge** | `#1E2233` | Borders, dividers |
| **Shard** | `#252A3D` | Hover states |
| **Primary Cyan** | `#00D4FF` | CTAs, active states, AI indicators |
| **Aurora** | `#B829DD` | Secondary accent, gradients |
| **Ember** | `#FF6B35` | Human mode, warnings |
| **Signal** | `#00E5A0` | Success, online status |
| **Warn** | `#FFC857` | Medium risk, pending |
| **Danger** | `#FF4757` | Errors, rejections, offline |
| **Text Hero** | `#FFFFFF` | Headlines |
| **Text Body** | `#B8BED8` | Body text |
| **Text Muted** | `#6B7290` | Secondary text |
| **Text Faint** | `#4A5068` | Borders, disabled |

### Glassmorphism Levels

```css
/* Level 1: Cards */
.glass-card {
  background: rgba(22, 25, 37, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

/* Level 2: Panels (header, sidebar) */
.glass-panel {
  background: rgba(10, 11, 16, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Level 3: Inputs */
.glass-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #1E2233;
  border-radius: 10px;
}
```

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Page Title | Inter | 700 (Bold) | 24px |
| Section Header | Inter | 600 (Semi) | 18px |
| Card Title | Inter | 500 (Medium) | 16px |
| Body | Inter | 400 (Regular) | 14px |
| Caption | Inter | 400 | 12px |
| Micro | Inter | 500 | 10px |

### Spacing System

- Base unit: 4px
- Card padding: 20px (5 units)
- Section gap: 24px (6 units)
- Grid gap: 16px (4 units)

### Animations

| Animation | Duration | Easing |
|-----------|----------|--------|
| Card hover | 300ms | ease-out |
| Page transition | 300ms | ease-out |
| Stagger children | 50ms each | ease-out |
| Chart bars | 500ms | ease-out |
| Glow pulse | 2s infinite | ease-in-out |

---

## Database Schema (Supabase)

### Core Tables

| Table | Purpose | Rows (Est.) |
|-------|---------|-------------|
| `agents` | AI agent definitions | 50+ |
| `staff` | Human team members | 20+ |
| `tasks` | Operations tasks | 500+ |
| `approvals` | Approval workflow items | 100+ |
| `providers` | AI provider configs | 10 |
| `workflows` | Swarm workflow definitions | 25 |
| `executions` | Agent run history | 10K+ |
| `activity_logs` | Audit trail | 50K+ |
| `messages` | Communications | 5K+ |
| `channels` | Chat channels | 20 |
| `billing_usage` | Metered usage | 100K+ |
| `subscriptions` | Stripe subscriptions | 50 |
| `workspaces` | Multi-tenant workspaces | 10 |

### Key Relationships

```
workspaces (1) → agents (N)
workspaces (1) → staff (N)
workspaces (1) → tasks (N)
agents (1) → executions (N)
agents (1) → approvals (N)
staff (1) → tasks (N) [as assignee]
workflows (1) → executions (N)
```

---

## API & Integrations

### Supabase APIs Used

| Feature | API | Status |
|---------|-----|--------|
| Agent CRUD | REST/PostgREST | ✅ |
| Staff Directory | REST + Server Components | ✅ |
| Real-time updates | Supabase Realtime | ⬜ |
| Auth | Supabase Auth | ⬜ |
| Storage | Supabase Storage | ⬜ |
| Edge Functions | Deno/Edge Runtime | ⬜ |

### External Integrations (Planned)

| Service | Purpose |
|---------|---------|
| Stripe | Billing & subscriptions |
| OpenAI | GPT-4, GPT-3.5 agents |
| Kimi API | Claude agent backend |
| GitHub | Code review agents, PR automation |
| Slack | Notifications, bot integration |
| Airtable | Data sync agents |
| Zapier | Workflow automation |
| SendGrid | Email notifications |

---

## Deployment

### Vercel (Production)

```bash
# Deploy latest
vercel --prod

# Environment variables required:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# STRIPE_PUBLISHABLE_KEY (Phase 2)
# STRIPE_SECRET_KEY (Phase 2)
```

### Local Development

```bash
cd /Users/hyp3r/.openclaw/workspace/fuseiq
npm install
npm run dev
# Open http://localhost:3000
```

### Database Management

```bash
# Push schema changes
supabase db push

# Seed data
node seed-agents.js

# Generate types
supabase gen types typescript --project-id kowwqfadifawowfrdiyz --schema public > src/types/supabase.ts
```

---

## User Guide

### Getting Started

1. **Login** — Navigate to https://fuseiq.vercel.app
2. **Dashboard** — The Command Center shows your AI workforce at a glance
3. **Switch Modes** — Use the sidebar toggle: AI mode (cyan), Human mode (orange), Hybrid mode (purple)

### Command Center

- **KPI Cards** — Click any card for detailed breakdowns
- **Active Agents** — View status, efficiency, and recent executions
- **Execution Trends** — Switch between 1H, 24H, 7D, 30D views
- **Pending Approvals** — Review and approve/reject agent actions
- **Activity Feed** — Scroll through real-time system events

### Staff Directory

- View all AI agents and human team members
- Filter by department or status
- Click any member for detailed profile and performance metrics

### Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘K | Open Co-Pilot command palette |
| ⌘B | Toggle sidebar collapse |
| Esc | Close modals/panels |

### Workspace Modes

| Mode | Description |
|------|-------------|
| **AI** | Optimized for AI agent management and deployment |
| **Human** | Focus on human team collaboration and tasks |
| **Hybrid** | Balanced view showing both AI and human activity |

---

## Launch Strategy

### Pre-Launch (Week of May 1)

- [ ] Complete Phase 2 features (Auth, Realtime, Co-Pilot)
- [ ] Security audit (RLS policies, API key encryption)
- [ ] Performance optimization (bundle size, LCP)
- [ ] Beta user recruitment (10-20 teams)
- [ ] Documentation completion

### Soft Launch (May 15)

- [ ] Invite-only beta
- [ ] Feedback collection via in-app widget
- [ ] Usage analytics dashboard
- [ ] Bug triage and hotfix cycle

### Public Launch (June 1)

- [ ] Remove invite gate
- [ ] Product Hunt launch
- [ ] Twitter/X announcement thread
- [ ] LinkedIn post from Awais
- [ ] Email to beta users

### Pricing Strategy

| Plan | Price | Features |
|------|-------|----------|
| **Starter** | $29/mo | 5 agents, 1K execs/mo, basic analytics |
| **Professional** | $99/mo | 25 agents, 10K execs/mo, advanced workflows |
| **Enterprise** | Custom | Unlimited, SSO, SLA, dedicated support |

### Marketing Channels

1. **Product Hunt** — Launch day with demo video
2. **Twitter/X** — Build in public, share metrics
3. **LinkedIn** — Professional AI/automation angle
4. **Indie Hackers** — Revenue transparency posts
5. **YouTube** — Tutorial videos and use cases
6. **Newsletter** — Weekly AI ops tips

### Success Metrics (90 Days)

| Metric | Target |
|--------|--------|
| Signups | 500 |
| Active workspaces | 100 |
| Agents deployed | 1,000 |
| Monthly revenue | $5,000 |
| NPS score | > 50 |

---

*Document generated: April 27, 2026*
*Last updated: April 27, 2026*
*Maintained by: Awais Abbasi & FuseIQ Team*
