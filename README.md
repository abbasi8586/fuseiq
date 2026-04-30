# FuseIQ v3.0 — AI Agent Orchestration Platform

> **Ship AI agents. Monitor them live. Scale without fear.**

FuseIQ is the command center for AI agent teams — connect any framework (CrewAI, LangChain, AutoGen, or custom), deploy with one click, and monitor everything in real-time.

## 🚀 What's Different

- **Real-time Command Center** — Watch your agents work live. See status, costs, and outputs streaming in real-time.
- **Multi-Framework Support** — CrewAI, LangChain, AutoGen, OpenAI, Anthropic, Google, or custom — all in one dashboard.
- **Enterprise Security** — Workspace-scoped RLS, immutable audit logs, SOC 2 ready.
- **External Agent Connection** — Run agents on your laptop, AWS, or anywhere. They appear live in FuseIQ via 3 lines of code.

## 📦 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/abbasi8586/fuseiq.git
cd fuseiq
npm install
```

### 2. Environment Setup

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Database Setup

```bash
# Apply schema
psql $DATABASE_URL -f supabase/migrations/00001_complete_schema.sql

# Seed demo data
node scripts/seed.js
```

### 4. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🐍 Connect External Agents

### Python SDK

```bash
pip install fuseiq
```

```python
from fuseiq import FuseIQClient

client = FuseIQClient("fk_live_your_key_here")

client.heartbeat(
    agent_name="MyCrewAgent",
    status="online",
    task="Processing emails"
)
```

### CrewAI Example

```python
from crewai import Agent, Task, Crew
from fuseiq import FuseIQClient, AgentDecorator

fuseiq = FuseIQClient("fk_live_your_key_here")

@AgentDecorator(fuseiq, "Researcher")
def do_research():
    agent = Agent(role="Analyst", goal="Research market trends")
    task = Task(description="Find top AI platforms", agent=agent)
    crew = Crew(agents=[agent], tasks=[task])
    return crew.kickoff()

do_research()  # Appears live in FuseIQ
```

See [`fuseiq-python/examples/`](fuseiq-python/examples/) for more.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              Next.js 16 (App Router)         │
│  ┌─────────┐ ┌─────────┐ ┌───────────────┐ │
│  │ Dashboard│ │  Chat   │ │ Command Center│ │
│  └─────────┘ └─────────┘ └───────────────┘ │
└──────────────────┬────────────────────────────┘
                   │ Supabase Realtime (WebSocket)
┌──────────────────▼────────────────────────────┐
│              Supabase Platform                   │
│  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ PostgreSQL 17 │  │ Realtime Subscriptions   │  │
│  │ 18 Tables    │  │ Agents · Tasks · Messages│  │
│  │ RLS + Audit  │  │                          │  │
│  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────┘
         ▲                              ▲
         │                              │
┌────────┴────────┐          ┌────────┴────────┐
│  External Agents  │          │   Web App Users  │
│  (CrewAI, etc.)   │          │   (Dashboard)    │
└───────────────────┘          └──────────────────┘
```

## 📊 Database Schema

| Table | Purpose |
|-------|---------|
| `workspaces` | Multi-tenant root |
| `workspace_members` | RBAC (Director/Manager/Member/Viewer) |
| `agents` | AI + Human registry |
| `staff` | Human team members |
| `tasks` | Operations center (Kanban) |
| `executions` | Agent run history |
| `approvals` | Human-in-the-loop |
| `channels` | Chat channels |
| `messages` | Chat messages |
| `workflows` | Swarm orchestration |
| `simulations` | Predictive runs |
| `activity_logs` | Audit trail |
| `audit_log` | Immutable with hash |
| `providers` | BYOK (OpenAI, Anthropic, etc.) |
| `marketplace_items` | Agent templates |
| `billing_usage` | Usage tracking |
| `notifications` | User notifications |
| `api_keys` | External agent auth |

## 🔒 Security

- **Row Level Security** on all tables
- **Workspace-scoped policies** — users only see their workspace data
- **Immutable audit logs** with SHA-256 hashes
- **API keys** with scope-based permissions
- **No secrets in Git** — all credentials via environment variables

## 🛣️ Roadmap

- [x] Core dashboard with glassmorphism UI
- [x] Real-time command center
- [x] Agent registry with 8 frameworks
- [x] Task management (Kanban)
- [x] Approval workflow
- [x] Chat with threads
- [x] Workflow orchestration
- [x] External agent connection (Python SDK)
- [ ] Stripe billing integration
- [ ] SOC 2 compliance framework
- [ ] Enterprise SSO (SAML/OIDC)
- [ ] Mobile app (React Native)
- [ ] Marketplace with ratings

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © [Abbasi Global LLC](https://abbasiglobal.com)

---

**Built with:** Next.js 16 · TypeScript · Tailwind CSS · Supabase · Framer Motion

**Live Demo:** [https://fuseiq.vercel.app](https://fuseiq.vercel.app)
