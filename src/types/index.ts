// USER TYPES
export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "team_lead" | "viewer";
  teamId?: string;
  createdAt: string;
}

// TEAM TYPES

export interface Team {
  id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
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
  status: "success" | "failed" | "pending";
  createdAt: string;
}

// API RESPONSE TYPES
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  isMock: boolean;
}
