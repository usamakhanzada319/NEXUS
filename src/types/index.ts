// Users Role
export type UserRole = 'super_admin' | 'admin' | 'team_lead' | 'viewer';



// USER TYPES
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  createdAt: string;
  lastLogin?: string;
}

// TEAM TYPES

export interface Team {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  createdBy: string;
  members?: User[];
}

// // PROVIDER TYPES

export interface Provider {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  models: string[];
  pricing: {
    input: number;
    output: number;
  };
  icon?: string;
  color?: string;
  createdAt: string;
}

// TEAM-PROVIDER TYPES

export interface TeamProvider {
  teamId: string;
  providerId: string;
  enabled: boolean;
  spendLimit: number;
  modelsAssigned: string[];
  apiKeyEncrypted?: string;
  assignedAt: string;
}

// SPEND
export interface Spend {
  id: string;
  teamId: string;
  providerId: string;
  amount: number;
  tokens: number;
  model: string;
  status: 'success' | 'failed' | 'pending';
  error?: string;
  responseTime?: number;
  createdAt: string;
}

// API RESPONSE TYPES
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  isMock: boolean;
}

// API call Logs

export interface APICallLog {
  id: string;
  teamId: string;
  teamName: string;
  providerId: string;
  providerName: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  responseTime: number; // in ms
  status: 'success' | 'failed' | 'pending';
  error?: string;
  createdAt: string;
}

// Analytics Types

export interface AnalyticsStats {
  totalCalls: number;
  totalTokens: number;
  totalCost: number;
  avgResponseTime: number;
  successRate: number;

}


// Provider Analytics

export interface ProviderAnalytics {
  providerId: string;
  providerName: string;
  calls: number;
  totalTokens: number;
  totalCost: number;
  avgResponseTime: number;
  successRate: number;
}

// Model Analytics

export interface ModelAnalytics {
  model: string;
  calls: number;
  totalTokens: number;
  totalCost: number;
  avgResponseTime: number;
}


// Dashboard Stats


export interface DashboardStats {
  totalSpend: number;
  totalTeams: number;
  totalProviders: number;
  activeProviders: number;
  anomalies: number;
}


export interface TeamWithProviders extends Team {
  providers: (Provider & {
    enabled: boolean;
    spendLimit: number;
    modelsAssigned: string[];
  })[];
}
export type TeamProviderWithProvider = Provider & {
  enabled: boolean;
  spendLimit: number;
  modelsAssigned: string[];
  apiKeyEncrypted?: string;
};


// AUDIT LOG TYPES


export type AuditAction =
  | "login"
  | "logout"
  | 'create_team'
  | 'update_team'
  | 'delete_team'
  | 'create_provider'
  | "update_provider"
  | "delete_provider"
  | 'assign_provider'
  | 'remove_provider'
  | 'toggle_provider'
  | 'update_provider_config'
  | 'api_call'
  | 'spend_alert';


export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  details: {
    [key: string]: any
  }
  ip?: string;
  userAgent?: string;
  createdAt: string;
}


// NOTIFICATION TYPES
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
  createdAt: string;
}


// Budget Types

export interface TeamBudget {
  teamId: string
  teamName: string
  monthlyLimit: number
  dailyLimit: number
  currentMonthSpend: number;
  currentDaySpend: number;
  softLimitPercent: number;
  hardLimitPercent: number;
  isSoftLimitReached: boolean;
  isHardLimitReached: boolean;
  lastUpdated: string;
}


export interface BudgetAlert {
  id: string
  teamId: string
  teamName: string
  type: "soft" | "hard" | "daily"
  message: string;
  triggeredAt: string;
  isResolved: boolean;
  resolvedAt?: string;
}


// Provider status & Health Types

export type ProviderStatus = "healthy" | "degraded" | "unhealthy" | "unknown";

export interface ProviderHealth {
  providerId: string;
  providerName: string;
  status: ProviderStatus;
  lastCheck: string;
  responseTime: number;
  successRate: number;
  errorRate: number;
  uptime: number;
  isCircuitOpen: boolean;
  failoverCount: number;
}


export interface ProviderFallbackConfig {
  providerId: string;
  fallbackProviderId: string;
  enabled: boolean;
  triggerConditions: {
    maxResponseTime: number;
    minSuccessRate: number;
    consecutiveFailures: number;
  };
}

export interface HealthCheckResult {
  providerId: string;
  status: ProviderStatus;
  responseTime: number;
  success: boolean;
  error?: string;
  checkedAt: string;
} 