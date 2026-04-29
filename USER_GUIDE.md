# FuseIQ v3.0 — User Guide

## Welcome to FuseIQ

FuseIQ is your AI Agent Command Center. This guide will walk you through every feature and help you get the most out of your AI workforce.

---

## Quick Start

### 1. Access Your Dashboard
Navigate to **https://fuseiq.vercel.app** and sign in.

### 2. Explore the Command Center
The home screen gives you a real-time overview of everything happening in your workspace.

### 3. Switch Workspace Modes
Toggle between **AI**, **Human**, or **Hybrid** mode using the control at the bottom of the sidebar.

---

## Navigation Guide

### Sidebar Menu

| Page | What You'll Find |
|------|-----------------|
| **Command Center** | Dashboard home with KPIs, live agents, approvals, activity |
| **Staff Directory** | All AI agents and human team members |
| **Communications** | Team chat channels and agent messaging |
| **Agent Forge** | Create, configure, and manage AI agents |
| **Operations** | Kanban task board for your team |
| **Approvals** | Review and approve high-risk agent actions |
| **Analytics** | Charts, reports, and performance metrics |
| **Swarm Canvas** | Visual workflow builder for multi-agent orchestration |
| **Simulator** | Test agents before deployment |
| **Co-Pilot** | AI assistant for quick actions and commands |
| **Marketplace** | Browse and install pre-built agents |
| **Team** | Human team management and roles |
| **Billing** | Usage, invoices, and subscription management |
| **Audit Log** | Complete activity history for compliance |
| **Settings** | Workspace preferences and integrations |

---

## Command Center Deep Dive

### KPI Cards (Top Row)

Four live cards showing:
- **Active Agents** — How many agents are online right now
- **Executions Today** — Total agent runs since midnight UTC
- **Success Rate** — Percentage of successful executions
- **Avg Cost / Run** — Average spend per execution

💡 **Tip:** Click any card to see historical trends and breakdowns.

### Active Agents Panel

Shows all currently active agents with:
- **Avatar** — Initial letter with gradient background
- **Status Dot** — Green (online), Orange (busy), Red (offline)
- **Name & Type** — AI agents show framework badge (Kimi, OpenAI, etc.)
- **Efficiency Score** — Performance rating (0-100%)
- **Executions** — Total runs today

### Execution Trends Chart

Visual bar chart showing execution volume over time.
- **1H** — Last hour, minute-by-minute
- **24H** — Last 24 hours, hourly
- **7D** — Last week, daily
- **30D** — Last month, daily

### Pending Approvals

When an agent wants to perform a high-risk action, it appears here:

| Risk Level | Color | Typical Action |
|------------|-------|---------------|
| **Low** | Green | Bulk close tickets, send routine emails |
| **Medium** | Yellow | Merge PRs, publish content |
| **High** | Red | Deploy campaigns, delete data, send to 50K+ users |

**To approve:** Click the green **Approve** button
**To reject:** Click the red **Reject** button

### Activity Feed

Real-time stream of everything happening:
- 🟢 **Success** — Agent completed a task
- 🔵 **Info** — Agent started working
- 🟡 **Warning** — Approval requested
- 🔴 **Error** — Agent failed, manual intervention needed

---

## Staff Directory

### Viewing Team Members

1. Click **Staff Directory** in the sidebar
2. Browse the grid of all AI agents and humans
3. Use filters to narrow by:
   - Department (Engineering, Product, Marketing, Support)
   - Status (Online, Away, Busy, Offline)
   - Type (AI or Human)

### Agent Profiles

Click any agent to see:
- Full role and department
- Provider/framework (Kimi, OpenAI, etc.)
- Efficiency history
- Recent executions
- Cost breakdown
- Assigned tasks

### Human Profiles

Click any human to see:
- Role and department
- Timezone
- Current workload
- Assigned tasks
- Collaboration history

---

## Workspace Modes

### AI Mode (Cyan)
- Optimized for managing AI agents
- Quick deploy buttons visible
- Agent performance front and center
- Cost tracking prominent

### Human Mode (Orange)
- Focus on human team collaboration
- Task assignments highlighted
- Communication tools prominent
- Meeting schedules visible

### Hybrid Mode (Purple)
- Balanced view of both AI and human activity
- Collaboration metrics
- Human-AI handoff tracking
- Combined productivity scores

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘ + K` | Open Co-Pilot command palette |
| `⌘ + B` | Toggle sidebar collapse/expand |
| `Esc` | Close any modal or dropdown |
| `⌘ + /` | Show keyboard shortcut help |
| `Shift + ?` | Open quick help panel |

---

## Co-Pilot Commands

When you press `⌘ + K`, Co-Pilot opens. Try these commands:

| Command | What It Does |
|---------|-------------|
| "Deploy agent" | Start agent creation wizard |
| "View analytics" | Jump to analytics page |
| "Create task" | Open new task form |
| "Approve all" | Bulk approve pending items |
| "Show costs" | Display cost breakdown |
| "Switch to AI mode" | Change workspace mode |
| "Find [name]" | Search for agent or person |
| "Run workflow [name]" | Execute a saved workflow |

---

## Account & Billing

### Viewing Your Plan

1. Click your avatar (top right)
2. Select **Billing**
3. See current plan, usage, and next billing date

### Upgrading Your Plan

1. Go to **Billing** page
2. Click **Change Plan**
3. Select Professional or Enterprise
4. Enter payment details via Stripe

### Usage Limits

| Plan | Agents | Executions/Month | Users |
|------|--------|-------------------|-------|
| Starter | 5 | 1,000 | 3 |
| Professional | 25 | 10,000 | 10 |
| Enterprise | Unlimited | Unlimited | Unlimited |

---

## Settings

### Workspace Settings

- **Name** — Your workspace display name
- **Timezone** — Default timezone for scheduling
- **Theme** — Auto, Dark, or Light
- **Notifications** — Email, in-app, or both

### Integrations

Connect external services:
- **OpenAI** — GPT-4, GPT-3.5
- **Kimi** — Claude models
- **GitHub** — Code review automation
- **Slack** — Team notifications
- **Airtable** — Data sync

### API Keys

- View and regenerate your workspace API key
- Set up provider keys (encrypted at rest)
- Configure webhooks for external systems

---

## Troubleshooting

### Agent Shows "Offline"

1. Check provider API key in Settings > Integrations
2. Verify the agent's framework configuration
3. Review the agent logs in Agent Forge
4. Contact support if persistent

### High Costs

1. Check Analytics > Cost Breakdown
2. Identify expensive agents
3. Adjust model selection (GPT-4 → GPT-3.5 for simple tasks)
4. Set cost alerts in Billing

### Approval Not Working

1. Ensure you have Manager or Director role
2. Check the approval risk level matches your permissions
3. Verify you're in the correct workspace

---

## Getting Help

### In-App Support

1. Click **?** icon in header
2. Search help articles
3. Or click **Contact Support** to send a message

### Email

support@fuseiq.ai — Response within 24 hours

### Community

- **Discord:** https://discord.gg/fuseiq
- **Twitter/X:** @fuseiq
- **GitHub Discussions:** github.com/abbasi8586/fuseiq/discussions

---

*Version: 3.0.0-alpha*
*Last Updated: April 27, 2026*
*All prices in USD. Billed in US Dollars.*

*Last Updated: April 29, 2026*
*Version: 3.0.0-alpha | Florida, USA*
