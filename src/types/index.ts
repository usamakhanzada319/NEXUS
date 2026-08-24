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


// Dashboard Stats


export interface DashboardStats {
  totalSpend: number;
  totalTeams: number;
  totalProviders: number;
  activeProviders: number;
  anomalies: number;
}
