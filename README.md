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

## Project Structure

| Folder/File                    | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `src/`                         | Root source folder                       |
| `src/api/`                     | API layer (Mock/Real switch)             |
| `src/components/`              | Reusable UI components                   |
| `src/components/admin/`        | Admin panel components                   |
| `src/components/billing/`      | Billing components                       |
| `src/components/budget/`       | Budget components                        |
| `src/components/charts/`       | Chart components                         |
| `src/components/common/`       | Common components (Layout, Header, etc.) |
| `src/components/dashboard/`    | Dashboard components                     |
| `src/components/integrations/` | Integration components                   |
| `src/components/provider/`     | Provider components                      |
| `src/components/security/`     | Security components                      |
| `src/components/teams/`        | Team components                          |
| `src/context/`                 | Global state management                  |
| `src/hooks/`                   | Custom React hooks                       |
| `src/pages/`                   | Page components                          |
| `src/services/`                | Business logic services                  |
| `src/types/`                   | TypeScript type definitions              |
| `src/utils/`                   | Utility functions                        |
| `src/App.tsx`                  | Root component                           |
| `src/main.tsx`                 | Entry point                              |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

`````bash
# 1. Clone the repository
git clone https://github.com/usamakhanzada319/NEXUS

# 2. Navigate to project directory
cd nexus-platform

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

Open http://localhost:3000 in your browser.

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





## Available Routes

| Path | Page | Access |
|------|------|--------|
| `/login` | Login | Public |
| `/` | Dashboard | Admin + Super Admin |
| `/super-admin` | Super Admin Dashboard | Super Admin Only |
| `/teams` | Teams Management | Admin + Super Admin |
| `/providers` | Providers Management | Admin + Super Admin |
| `/admin/providers` | Provider Assignment | Admin + Super Admin |
| `/analytics` | Analytics | Admin + Super Admin |
| `/budget` | Budget Management | Admin + Super Admin |
| `/provider-health` | Provider Health | Admin + Super Admin |
| `/security` | Security Settings | Admin + Super Admin |
| `/billing` | Billing & Invoicing | Admin + Super Admin |
| `/settings` | Integration Settings | Admin + Super Admin |
| `*` | 404 Not Found | Public |

````bash
# 1. Clone the repository
git clone https://github.com/usamakhanzada319/NEXUS

# 2. Navigate to project directory
cd nexus-platform

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev



Usama Jameel

GitHub: @usamakhanzada319

LinkedIn: https://nexus-pink-iota-44.vercel.app/
---


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

- Phase Final : Backend + Database (Node.js + PostgreSQL + Prisma)
- Real API integration
- User authentication with JWT
- Database persistence

---

**Made with ❤️ by Usama Jameel**
`````
