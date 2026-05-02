# FuseIQ Core Vision & Theme Lock

**Last Updated:** 2026-05-02
**Status:** ACTIVE — All future updates must align with this document

---

## Our Core Vision

> **FuseIQ is the AI Agent Orchestration Platform that lets anyone build, deploy, and monetize intelligent agent teams — no coding required.**

We are not a chatbot wrapper. We are not a generic AI tool. We are the **operating system for agent swarms**.

### What We Do (One Sentence)
FuseIQ enables creators and businesses to assemble AI agent teams (Swarms), assign them to specialized hubs (Offices), and deploy them to solve real-world tasks — all through an intuitive, visual interface.

### What We Don't Do
- ❌ Generic AI chat interface
- ❌ Simple prompt-to-text tool
- ❌ Compete with ChatGPT/Claude directly
- ❌ Build features that don't serve the "agent team" narrative

---

## Core Theme: Cyber-Luxury Agent Command

### Visual Identity (LOCKED)
- **Palette:** Void `#06070A`, Primary `#00D4FF`, Aurora `#B829DD`, Signal `#00E5A0`, Ember `#FF6B35`
- **Effects:** Multi-layer glassmorphism, neon glows, holographic cards, shimmer animations, status pulses
- **Mood:** High-end command center. You're not "using an app" — you're **operating a fleet**.

### Language & Tone (LOCKED)
- Offices (not "workspaces")
- Staff (not "agents" in UI — "AI Staff" or "Team Members")
- Swarms (not "groups" or "collections")
- Install / Uninstall (not "add/remove" — software metaphor)
- Deploy / Recall (not "activate/deactivate")
- Director (not "admin" or "owner")

### UX Patterns (LOCKED)
- Cards with glassmorphism + hover lift
- Status dots with pulse animation
- Cyber dividers (gradient lines)
- Holographic button effects
- Consistent iconography (Lucide)
- No generic Bootstrap/Material UI look

---

## Feature North Star

Every new feature must answer **YES** to at least one:

1. **Does it help users build better agent teams?**
2. **Does it help users deploy agents to real tasks?**
3. **Does it help users monetize or scale their agent operations?**
4. **Does it strengthen the "command center" experience?**

If a feature is "nice to have" but doesn't serve the core vision, **it gets cut**.

---

## Current Architecture (Post-Phase 3)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 + TypeScript + Tailwind | UI / Command Interface |
| Animation | Framer Motion | Motion design, transitions |
| Backend | Supabase (PostgreSQL + Auth + Realtime) | Data, auth, real-time sync |
| AI | DeepSeek API (FuseIQ-branded) | LLM reasoning |
| Deploy | Vercel | Edge hosting |

---

## What We've Built (Phase 3 Complete)

✅ **Offices** — Create/manage agent hubs  
✅ **Staff** — Install/uninstall AI agents per office  
✅ **Swarms** — Group agents into teams  
✅ **Marketplace** — Browse, install, preview agents  
✅ **My Agents** — Filter installed agents  
✅ **Real-time Chat** — Talk to any agent  
✅ **Glassmorphism v2.1** — Visual system locked  
✅ **Branding** — FuseIQ throughout, no DeepSeek visible  

---

## What's Next (Phase 4 Planning)

**Must align with core vision:**

- **Agent Memory** — Persistent context across sessions (builds better teams)
- **Workflow Builder** — Visual drag-and-drop agent pipelines (deploy to real tasks)
- **Agent Marketplace v2** — Ratings, reviews, pricing, creator payouts (monetize)
- **Team Collaboration** — Multi-user offices with roles (scale operations)
- **Analytics Dashboard** — Usage, performance, ROI metrics (command center insight)
- **API & Webhooks** — External integrations (deploy anywhere)

**Explicitly NOT on roadmap:**
- Generic document editor
- Social feed / timeline
- Video conferencing
- Unrelated SaaS features (CRM, project management, etc.)

---

## Decision Framework

When evaluating any new feature, design change, or pivot:

```
1. Does it serve the agent orchestration vision?
2. Does it fit the cyber-luxury theme?
3. Does it leverage our existing architecture?
4. Is it a "must-have" for our target user?
5. Can we build it in <2 weeks?
```

**Score < 3/5 = Reject.** Score 3-4/5 = Discuss. Score 5/5 = Build immediately.

---

## Brand Guardrails

| Element | Correct | Incorrect |
|---------|---------|-----------|
| Product name | FuseIQ | Fuse-iq, fuseiq, FUSEIQ |
| User role | Director | Admin, Owner, User |
| Agent container | Office | Workspace, Project, Room |
| Agent instance | Staff / AI Staff | Agent, Bot, Assistant |
| Agent team | Swarm | Group, Collection, Team |
| Action | Install / Deploy | Add, Activate, Enable |
| Action | Uninstall / Recall | Remove, Delete, Disable |

---

## Commit Message

This document is binding. Future updates that deviate from this vision require explicit CEO approval and a written rationale.

**Signed:** Rook vCEO | 2026-05-02  
**Authority:** Phase 2 Execution Architect, FuseIQ v3.0

---

*"We don't build features. We build the future of work."*
