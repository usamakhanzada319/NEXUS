import { Team, User, Provider, TeamProvider, Spend } from "../types";
// MOCK USER
export const mockUsers: User[] = [
  // SUPER ADMIN
  {
    id: 'u1',
    name: 'Super Admin',
    email: 'admin@nexus.com',
    role: 'super_admin',
    teamId: undefined,
    createdAt: new Date().toISOString(),
  },

  // TEAM ALPHA

  {
    id: 'u2',
    name: 'Admin Alpha',
    email: 'admin@alpha.com',
    role: 'admin',
    teamId: 't1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u3',
    name: 'Team Lead Alpha',
    email: 'lead@alpha.com',
    role: 'team_lead',
    teamId: 't1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u4',
    name: 'Viewer Alpha',
    email: 'viewer@alpha.com',
    role: 'viewer',
    teamId: 't1',
    createdAt: new Date().toISOString(),
  },

// TEAM BETA
  {
    id: 'u5',
    name: 'Admin Beta',
    email: 'admin@beta.com',
    role: 'admin',
    teamId: 't2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u6',
    name: 'Team Lead Beta',
    email: 'lead@beta.com',
    role: 'team_lead',
    teamId: 't2',
    createdAt: new Date().toISOString(),
  },
];


// MOCK TEAMS

export const mockTeams: Team[] = [
  {
    id: "t1",
    name: "Alpha Squad",
    description: "Core AI engineering team",
    status: "active",
    createdAt: new Date().toISOString(),
    createdBy: "u1",
  },
  {
    id: "t2",
    name: "Beta Team",
    description: "Marketing AI ops",
    status: "active",
    createdAt: new Date().toISOString(),
    createdBy: "u1",
  },
  {
    id: "t3",
    name: "Gamma Group",
    description: "Research & Development",
    status: "inactive",
    createdAt: new Date().toISOString(),
    createdBy: "u1",
  },
];

// MOCK PROVIDERS

export const mockProvider: Provider[] = [
  {
    id: "p1",
    name: "OpenAI",
    slug: "openai",
    isActive: true,
    models: ["gpt-4", "gpt-4o", "gpt-3.5-turbo"],
    pricing: { input: 5, output: 15 },
    icon: "🤖",
    color: "#10a37f",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Anthropic",
    slug: "anthropic",
    isActive: true,
    models: ["claude-3-opus", "claude-3-sonnet"],
    pricing: { input: 15, output: 75 },
    icon: "🧠",
    color: "#d97706",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p3",
    name: "Google Gemini",
    slug: "gemini",
    isActive: false,
    models: ["gemini-pro", "gemini-flash"],
    pricing: { input: 1, output: 10 },
    icon: "🔮",
    color: "#4285f4",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p4",
    name: "Mistral AI",
    slug: "mistral",
    isActive: true,
    models: ["mistral-large", "mistral-small"],
    pricing: { input: 2, output: 6 },
    icon: "🌊",
    color: "#f97316",
    createdAt: new Date().toISOString(),
  },
];

// MOCK TEAM-PROVIDER ASSIGNMENTS

export const mockTeamProvider: TeamProvider[] = [
  {
    teamId: "t1",
    providerId: "p1",
    enabled: true,
    spendLimit: 5000,
    modelsAssigned: ["gpt-4", "gpt-3.5-turbo"],
    assignedAt: new Date().toISOString(),
  },
  {
    teamId: "t1",
    providerId: "p2",
    enabled: false,
    spendLimit: 0,
    modelsAssigned: [],
    assignedAt: new Date().toISOString(),
  },
  {
    teamId: "t2",
    providerId: "p1",
    enabled: true,
    spendLimit: 3000,
    modelsAssigned: ["gpt-3.5-turbo"],
    assignedAt: new Date().toISOString(),
  },
  {
    teamId: "t2",
    providerId: "p3",
    enabled: true,
    spendLimit: 2000,
    modelsAssigned: ["gemini-pro"],
    assignedAt: new Date().toISOString(),
  },
];

// MOCK SPEND DATA

export const mockSpend: Spend[] = [
  {
    id: "s1",
    teamId: "t1",
    providerId: "p1",
    amount: 2450,
    tokens: 120000,
    model: "gpt-4",
    status: "success",
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    id: "s2",
    teamId: "t1",
    providerId: "p1",
    amount: 1800,
    tokens: 90000,
    model: "gpt-3.5-turbo",
    status: "success",
    createdAt: "2026-08-14T14:30:00Z",
  },
  {
    id: "s3",
    teamId: "t2",
    providerId: "p1",
    amount: 1200,
    tokens: 60000,
    model: "gpt-3.5-turbo",
    status: "success",
    createdAt: "2026-08-13T09:15:00Z",
  },
  {
    id: "s4",
    teamId: "t2",
    providerId: "p3",
    amount: 800,
    tokens: 40000,
    model: "gemini-pro",
    status: "success",
    createdAt: "2026-08-12T16:45:00Z",
  },
  {
    id: "s5",
    teamId: "t1",
    providerId: "p2",
    amount: 3500,
    tokens: 175000,
    model: "claude-3-opus",
    status: "failed",
    createdAt: "2026-08-11T11:20:00Z",
  },
];
