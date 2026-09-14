# NEXUS — AI Ops Platform

A production-grade, multi-tenant AI Operations Dashboard built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**. NEXUS helps organizations monitor, manage, and optimize their AI provider usage, spend, and reliability — all from a single unified platform.

---

## Live Demo

**Live Demo:** [https://nexus-ai-ops.vercel.app](https://nexus-ai-ops.vercel.app)

---

## Features

### Core Features

- **Multi-User Authentication** — Super Admin, Admin, Team Lead, Viewer roles
- **Multi-Team Management** — Create, manage, and switch between teams
- **Provider Management** — Add, edit, enable/disable AI providers
- **Analytics Dashboard** — Track API calls, tokens, costs, latency
- **Budget Management** — Soft/hard limits, alerts, daily caps
- **Billing & Invoicing** — Generate invoices, multiple payment methods
- **Audit Logs** — Track all user actions
- **Security** — MFA, backup codes, password policy, login history
- **Provider Fallback** — Auto-failover, circuit breaker, health checks
- **Integrations** — Slack, Webhooks, CSV/JSON export

### Technical Features

- **Performance Optimized** — React.memo, useMemo, useCallback
- **Code Splitting** — Lazy loading with React.lazy + Suspense
- **Dark Mode** — Persistent theme preference
- **100% Responsive** — Works on all devices
- **Error Boundaries** — Graceful error handling
- **Loading States** — Skeleton loaders
- **Production Ready** — Vercel deployment ready

---

## Tech Stack

| Category       | Technology                 |
| -------------- | -------------------------- |
| **Frontend**   | React 18, TypeScript, Vite |
| **Styling**    | Tailwind CSS v3            |
| **Routing**    | React Router DOM v6        |
| **State**      | Context API                |
| **Icons**      | Lucide React               |
| **Charts**     | Recharts                   |
| **Deployment** | Vercel                     |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

````bash
# 1. Clone the repository
git clone https://github.com/usamakhanzada319/NEXUS

# 2. Navigate to project directory
cd nexus-platform

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

---
Login Credentials (Mock Mode)

| Role                  | Email            | Password |
| --------------------- | ---------------- | -------- |
| **Super Admin**       | admin@nexus.com  | anything |
| **Admin (Alpha)**     | admin@alpha.com  | anything |
| **Team Lead (Alpha)** | lead@alpha.com   | anything |
| **Viewer (Alpha)**    | viewer@alpha.com | anything |
| **Admin (Beta)**      | admin@beta.com   | anything |
| **Team Lead (Beta)**  | lead@beta.com    | anything |


---


```markdown
# 🏗️ NEXUS Architecture

This document explains the architecture, folder structure, and data flow of the NEXUS platform.

---

## Folder Structure

src/
├── api/ # API layer (Mock/Real switch)
├── components/ # Reusable UI components
│ ├── admin/ # Admin panel components
│ ├── billing/ # Billing components
│ ├── budget/ # Budget components
│ ├── charts/ # Chart components
│ ├── common/ # Common components (Layout, Header, etc.)
│ ├── dashboard/ # Dashboard components
│ ├── integrations/ # Integration components
│ ├── provider/ # Provider components
│ ├── security/ # Security components
│ └── teams/ # Team components
├── context/ # Global state management
├── hooks/ # Custom React hooks
├── pages/ # Page components
├── services/ # Business logic services
├── types/ # TypeScript type definitions
├── utils/ # Utility functions
├── App.tsx # Root component
└── main.tsx # Entry point
````

---

## State Management

### Context Providers

| Context                 | Purpose                                 |
| ----------------------- | --------------------------------------- |
| **AuthContext**         | User authentication, roles, permissions |
| **TeamContext**         | Current team, team switching            |
| **NotificationContext** | Toast notifications                     |
| **BudgetContext**       | Budget data, alerts                     |

### Custom Hooks

| Hook                  | Purpose                          |
| --------------------- | -------------------------------- |
| **useProviderHealth** | Provider health data and checks  |
| **useBilling**        | Billing data and payment methods |
| **useSecurity**       | Security settings and MFA        |
| **useWebhook**        | Webhook triggers                 |
| **useLocalStorage**   | localStorage sync                |

---

## Authentication Flow

User Login → AuthContext.login()
↓
Find user in mock data
↓
Save to localStorage
↓
Redirect based on role
↓
Super Admin → /super-admin
Admin → /
Team Lead → /
Viewer → /

## Component Architecture

App.tsx
├── ErrorBoundary
├── BrowserRouter
│ ├── AuthProvider
│ │ ├── TeamProvider
│ │ │ ├── NotificationProvider
│ │ │ │ ├── BudgetProvider
│ │ │ │ │ ├── Routes
│ │ │ │ │ │ ├── /login → Login
│ │ │ │ │ │ ├── Protected Routes
│ │ │ │ │ │ │ ├── / → Dashboard
│ │ │ │ │ │ │ ├── /teams → Teams
│ │ │ │ │ │ │ └── ...
│ │ │ │ │ │ └── \* → NotFound
│ │ │ │ │ └── ToastContainer

### 🔜 Work On

- Phase 11: Backend + Database (Node.js + PostgreSQL + Prisma)
- Real API integration
- User authentication with JWT
- Database persistence

---

**Made with ❤️ by Usama Jameel**
