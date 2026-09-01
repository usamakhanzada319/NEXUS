import { Team, User, Provider, TeamProvider, Spend, AuditLog, APICallLog, TeamBudget, BudgetAlert, ProviderFallbackConfig, ProviderHealth } from "../types";
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

export const mockProviders: Provider[] = [
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

export const mockTeamProviders: TeamProvider[] = [
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


export const mockAuditLogs: AuditLog[] = [
  {
    id: "a1",
    userId: "u1",
    userName: 'Super Admin',
    userEmail: 'admin@nexus.com',
    action: "login",
    details: { ip: '192.168.1.1', device: 'Chrome on Windows' },
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },

  {
    id: "a2",
    userId: "u1",
    userName: 'Super Admin',
    userEmail: 'admin@nexus.com',
    action: "assign_provider",
    details: { team: 'Alpha Squad', provider: 'OpenAI', enabled: true },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },


  {
    id: "a3",
    userId: "u3",
    userName: 'Team Lead Alpha',
    userEmail: 'lead@alpha.com',
    action: "api_call",
    details: { model: 'gpt-4', tokens: 1200, provider: 'OpenAI' },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },


  {
    id: "a4",
    userId: "u1",
    userName: 'Super Admin',
    userEmail: 'admin@nexus.com',
    action: "create_team",
    details: { team: 'Gamma Group' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a5',
    userId: 'u3',
    userName: 'Team Lead Alpha',
    userEmail: 'lead@alpha.com',
    action: 'spend_alert',
    details: { team: 'Alpha Squad', provider: 'OpenAI', spend: 4800, limit: 5000 },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },

  {
    id: 'a6',
    userId: 'u2',
    userName: 'Admin Alpha',
    userEmail: 'admin@alpha.com',
    action: 'toggle_provider',
    details: { team: 'Alpha Squad', provider: 'Anthropic', enabled: false },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },

  {
    id: 'a7',
    userId: 'u5',
    userName: 'Admin Beta',
    userEmail: 'admin@beta.com',
    action: 'update_provider_config',
    details: { team: 'Beta Team', provider: 'OpenAI', spendLimit: 5000 },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },

]


export const mockAPICallLogs: APICallLog[] = [
  {
    id: 'c1',
    teamId: 't1',
    teamName: 'Alpha Squad',
    providerId: 'p1',
    providerName: 'OpenAI',
    model: 'gpt-4',
    inputTokens: 450,
    outputTokens: 120,
    totalTokens: 570,
    cost: 0.045,
    responseTime: 890,
    status: 'success',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
  },

  {
    id: 'c2',
    teamId: 't1',
    teamName: 'Alpha Squad',
    providerId: 'p1',
    providerName: 'OpenAI',
    model: 'gpt-3.5-turbo',
    inputTokens: 300,
    outputTokens: 80,
    totalTokens: 380,
    cost: 0.012,
    responseTime: 450,
    status: 'success',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
  },

  {
    id: 'c3',
    teamId: 't2',
    teamName: 'Beta Team',
    providerId: 'p1',
    providerName: 'OpenAI',
    model: 'gpt-4',
    inputTokens: 1200,
    outputTokens: 350,
    totalTokens: 1550,
    cost: 0.120,
    responseTime: 1200,
    status: 'success',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: 'c4',
    teamId: 't1',
    teamName: 'Alpha Squad',
    providerId: 'p2',
    providerName: 'Anthropic',
    model: 'claude-3-opus',
    inputTokens: 800,
    outputTokens: 200,
    totalTokens: 1000,
    cost: 0.150,
    responseTime: 1500,
    status: 'failed',
    error: 'Rate limit exceeded',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'c5',
    teamId: 't2',
    teamName: 'Beta Team',
    providerId: 'p3',
    providerName: 'Google Gemini',
    model: 'gemini-pro',
    inputTokens: 200,
    outputTokens: 50,
    totalTokens: 250,
    cost: 0.008,
    responseTime: 600,
    status: 'success',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    id: 'c6',
    teamId: 't3',
    teamName: 'Gamma Group',
    providerId: 'p1',
    providerName: 'OpenAI',
    model: 'gpt-4o',
    inputTokens: 2000,
    outputTokens: 500,
    totalTokens: 2500,
    cost: 0.250,
    responseTime: 1800,
    status: 'success',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: 'c7',
    teamId: 't1',
    teamName: 'Alpha Squad',
    providerId: 'p1',
    providerName: 'OpenAI',
    model: 'gpt-4',
    inputTokens: 150,
    outputTokens: 40,
    totalTokens: 190,
    cost: 0.015,
    responseTime: 350,
    status: 'success',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
]


export const mockBudgets: TeamBudget[] = [
  {
    teamId: "t1",
    teamName: "Alpha Squad",
    monthlyLimit: 5000,
    dailyLimit: 500,
    currentMonthSpend: 4800,
    currentDaySpend: 420,
    softLimitPercent: 80,
    hardLimitPercent: 100,
    isSoftLimitReached: true,
    isHardLimitReached: false,
    lastUpdated: new Date().toISOString()
  },
  {
    teamId: 't2',
    teamName: 'Beta Team',
    monthlyLimit: 3000,
    dailyLimit: 300,
    currentMonthSpend: 2100,
    currentDaySpend: 180,
    softLimitPercent: 80,
    hardLimitPercent: 100,
    isSoftLimitReached: false,
    isHardLimitReached: false,
    lastUpdated: new Date().toISOString(),
  },
  {
    teamId: 't3',
    teamName: 'Gamma Group',
    monthlyLimit: 2000,
    dailyLimit: 200,
    currentMonthSpend: 1200,
    currentDaySpend: 150,
    softLimitPercent: 80,
    hardLimitPercent: 100,
    isSoftLimitReached: false,
    isHardLimitReached: false,
    lastUpdated: new Date().toISOString(),
  },
]

// Mock Budget Alerts


export const mockBudgetAlerts: BudgetAlert[] = [
  {
    id: "b1",
    teamId: "t1",
    teamName: "Alpha Squad",
    type: "soft",
    message: 'Alpha Squad has reached 96% of monthly budget ($4,800 / $5,000)',
    triggeredAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isResolved: false
  }
]

// Provider Health Data

export const mockProviderHealth: ProviderHealth[] = [
  {
    providerId: 'p1',
    providerName: 'OpenAI',
    status: 'healthy',
    lastCheck: new Date().toISOString(),
    responseTime: 450,
    successRate: 99.5,
    errorRate: 0.5,
    uptime: 99.99,
    isCircuitOpen: false,
    failoverCount: 0,
  },
  {
    providerId: 'p2',
    providerName: 'Anthropic',
    status: 'degraded',
    lastCheck: new Date().toISOString(),
    responseTime: 1200,
    successRate: 92.0,
    errorRate: 8.0,
    uptime: 97.50,
    isCircuitOpen: false,
    failoverCount: 0,
  },

  {
    providerId: 'p3',
    providerName: 'Google Gemini',
    status: 'unhealthy',
    lastCheck: new Date().toISOString(),
    responseTime: 2100,
    successRate: 75.0,
    errorRate: 25.0,
    uptime: 89.00,
    isCircuitOpen: true,
    failoverCount: 12,
  },
  {
    providerId: 'p4',
    providerName: 'Mistral AI',
    status: 'healthy',
    lastCheck: new Date().toISOString(),
    responseTime: 600,
    successRate: 98.5,
    errorRate: 1.5,
    uptime: 99.50,
    isCircuitOpen: false,
    failoverCount: 0,
  },
]

// Mock Fallback Configurations

export const mockFallbackConfigs: ProviderFallbackConfig[] = [
  {
    providerId: 'p1',
    fallbackProviderId: 'p4',
    enabled: true,
    triggerConditions: {
      maxResponseTime: 2000,
      minSuccessRate: 95,
      consecutiveFailures: 3,
    },
  },
  {
    providerId: 'p2',
    fallbackProviderId: 'p1',
    enabled: true,
    triggerConditions: {
      maxResponseTime: 3000,
      minSuccessRate: 90,
      consecutiveFailures: 3,
    },
  },
  {
    providerId: 'p3',
    fallbackProviderId: 'p2',
    enabled: false,
    triggerConditions: {
      maxResponseTime: 4000,
      minSuccessRate: 85,
      consecutiveFailures: 3,
    },
  },
]