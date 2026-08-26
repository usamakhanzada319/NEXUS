import {
  Team,
  Provider,
  TeamProvider,
  Spend,
  User,
  AuditLog, AuditAction, Notification
} from "../types";

import {
  mockUsers,
  mockTeams,
  mockProviders,
  mockTeamProviders,
  mockSpend,
  mockAuditLogs
} from "./mockData";

import { encryptApiKey, decryptApiKey } from '../utils/encryption';


// LOCAL STORAGE HELPERS

const loadFromStorage = <T>(key: string, defaultData: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
  }
  return defaultData;
};

const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
};

// INITIALIZE MOCK DATA

const initMockData = () => {
  if (!localStorage.getItem("nexus_users")) {
    saveToStorage("nexus_users", mockUsers);
  }
  if (!localStorage.getItem("nexus_teams")) {
    saveToStorage("nexus_teams", mockTeams);
  }
  if (!localStorage.getItem("nexus_providers")) {
    saveToStorage("nexus_providers", mockProviders);
  }
  if (!localStorage.getItem("nexus_teamProviders")) {
    saveToStorage("nexus_teamProviders", mockTeamProviders);
  }
  if (!localStorage.getItem("nexus_spend")) {
    saveToStorage("nexus_spend", mockSpend);
  }
};

initMockData();


// GENERATE ID


const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 6);


// MOCK API


export const mockApi = {

  // USERS


  getUsers: (): User[] => {
    try {
      return loadFromStorage("nexus_users", mockUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      return mockUsers;
    }
  },

  getUser: (id: string): User | undefined => {
    try {
      const users = mockApi.getUsers();
      return users.find((u) => u.id === id);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return undefined;
    }
  },

  getUserByEmail: (email: string): User | undefined => {
    try {
      const users = mockApi.getUsers();
      return users.find((u) => u.email === email);
    } catch (error) {
      console.error(`Error fetching user by email ${email}:`, error);
      return undefined;
    }
  },

  addUser: (user: Omit<User, "id" | "createdAt">): User => {
    try {
      const users = mockApi.getUsers();
      const newUser = {
        ...user,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      saveToStorage("nexus_users", users);
      return newUser;
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error("Failed to add user");
    }
  },

  updateUser: (id: string, updates: Partial<User>): User | undefined => {
    try {
      const users = mockApi.getUsers();
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) return undefined;
      users[index] = { ...users[index], ...updates };
      saveToStorage("nexus_users", users);
      return users[index];
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      return undefined;
    }
  },

  deleteUser: (id: string): boolean => {
    try {
      let users = mockApi.getUsers();
      users = users.filter((u) => u.id !== id);
      saveToStorage("nexus_users", users);
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      return false;
    }
  },


  // TEAMS


  getTeams: (): Team[] => {
    try {
      return loadFromStorage("nexus_teams", mockTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      return mockTeams;
    }
  },

  getTeam: (id: string): Team | undefined => {
    try {
      const teams = mockApi.getTeams();
      return teams.find((t) => t.id === id);
    } catch (error) {
      console.error(`Error fetching team ${id}:`, error);
      return undefined;
    }
  },

  addTeam: (team: Omit<Team, "id" | "createdAt">): Team => {
    try {
      const teams = mockApi.getTeams();
      const newTeam = {
        ...team,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      teams.push(newTeam);
      saveToStorage("nexus_teams", teams);
      return newTeam;
    } catch (error) {
      console.error("Error adding team:", error);
      throw new Error("Failed to add team");
    }
  },

  updateTeam: (id: string, updates: Partial<Team>): Team | undefined => {
    try {
      const teams = mockApi.getTeams();
      const index = teams.findIndex((t) => t.id === id);
      if (index === -1) return undefined;
      teams[index] = { ...teams[index], ...updates };
      saveToStorage("nexus_teams", teams);
      return teams[index];
    } catch (error) {
      console.error(`Error updating team ${id}:`, error);
      return undefined;
    }
  },

  deleteTeam: (id: string): boolean => {
    try {
      let teams = mockApi.getTeams();
      teams = teams.filter((t) => t.id !== id);
      saveToStorage("nexus_teams", teams);
      return true;
    } catch (error) {
      console.error(`Error deleting team ${id}:`, error);
      return false;
    }
  },

  // PROVIDERS

  getProviders: (): Provider[] => {
    try {
      return loadFromStorage("nexus_providers", mockProviders);
    } catch (error) {
      console.error("Error fetching providers:", error);
      return mockProviders;
    }
  },

  getProvider: (id: string): Provider | undefined => {
    try {
      const providers = mockApi.getProviders();
      return providers.find((p) => p.id === id);
    } catch (error) {
      console.error(`Error fetching provider ${id}:`, error);
      return undefined;
    }
  },

  addProvider: (provider: Omit<Provider, "id" | "createdAt">): Provider => {
    try {
      const providers = mockApi.getProviders();
      const newProvider = {
        ...provider,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      providers.push(newProvider);
      saveToStorage("nexus_providers", providers);
      return newProvider;
    } catch (error) {
      console.error("Error adding provider:", error);
      throw new Error("Failed to add provider");
    }
  },

  updateProvider: (
    id: string,
    updates: Partial<Provider>,
  ): Provider | undefined => {
    try {
      const providers = mockApi.getProviders();
      const index = providers.findIndex((p) => p.id === id);
      if (index === -1) return undefined;
      providers[index] = { ...providers[index], ...updates };
      saveToStorage("nexus_providers", providers);
      return providers[index];
    } catch (error) {
      console.error(`Error updating provider ${id}:`, error);
      return undefined;
    }
  },

  deleteProvider: (id: string): boolean => {
    try {
      let providers = mockApi.getProviders();
      providers = providers.filter((p) => p.id !== id);
      saveToStorage("nexus_providers", providers);
      return true;
    } catch (error) {
      console.error(`Error deleting provider ${id}:`, error);
      return false;
    }
  },

  toggleProviderStatus: (id: string): Provider | undefined => {
    try {
      const providers = mockApi.getProviders();
      const index = providers.findIndex((p) => p.id === id);
      if (index === -1) return undefined;
      providers[index].isActive = !providers[index].isActive;
      saveToStorage("nexus_providers", providers);
      return providers[index];
    } catch (error) {
      console.error(`Error toggling provider status ${id}:`, error);
      return undefined;
    }
  },

  // TEAM-PROVIDERS


  getTeamProviders: (teamId: string): TeamProvider[] => {
    try {
      const all = loadFromStorage<TeamProvider[]>("nexus_teamProviders", mockTeamProviders);
      const teamProviders = all.filter((tp: TeamProvider) => tp.teamId === teamId);

      //Decrypt API keys before returning
      return teamProviders.map((tp) => {
        if (tp.apiKeyEncrypted) {
          try {
            const decrypted = decryptApiKey(tp.apiKeyEncrypted);
            return { ...tp, apiKeyEncrypted: decrypted };
          } catch {
            return tp;
          }
        }
        return tp;
      });
    } catch (error) {
      console.error(`Error fetching team providers for ${teamId}:`, error);
      return [];
    }
  },

  getProviderTeams: (providerId: string): TeamProvider[] => {
    try {
      const all = loadFromStorage<TeamProvider[]>("nexus_teamProviders", mockTeamProviders);
      return all.filter((tp: TeamProvider) => tp.providerId === providerId);
    } catch (error) {
      console.error(`Error fetching provider teams for ${providerId}:`, error);
      return [];
    }
  },

  //  Assign provider to team with encrypted API key
  assignProviderToTeam: (
    teamId: string,
    providerId: string,
    config: Partial<TeamProvider>,
  ): TeamProvider => {
    try {
      const all = loadFromStorage<TeamProvider[]>("nexus_teamProviders", mockTeamProviders);
      const existing = all.find(
        (tp: TeamProvider) => tp.teamId === teamId && tp.providerId === providerId,
      );

      // Encrypt API key if provided
      let encryptedConfig = { ...config };
      if (config.apiKeyEncrypted) {
        encryptedConfig.apiKeyEncrypted = encryptApiKey(config.apiKeyEncrypted);
      }

      if (existing) {
        Object.assign(existing, encryptedConfig);
        saveToStorage("nexus_teamProviders", all);
        //  Return with decrypted key for display
        const decrypted = { ...existing };
        if (decrypted.apiKeyEncrypted) {
          decrypted.apiKeyEncrypted = decryptApiKey(decrypted.apiKeyEncrypted);
        }
        return decrypted;
      }

      const newAssignment: TeamProvider = {
        teamId,
        providerId,
        enabled: config.enabled ?? true,
        spendLimit: config.spendLimit ?? 0,
        modelsAssigned: config.modelsAssigned ?? [],
        apiKeyEncrypted: config.apiKeyEncrypted ? encryptApiKey(config.apiKeyEncrypted) : undefined,
        assignedAt: new Date().toISOString(),
      };
      all.push(newAssignment);
      saveToStorage("nexus_teamProviders", all);

      //  Return with decrypted key for display
      const decrypted = { ...newAssignment };
      if (decrypted.apiKeyEncrypted) {
        decrypted.apiKeyEncrypted = decryptApiKey(decrypted.apiKeyEncrypted);
      }
      return decrypted;
    } catch (error) {
      console.error("Error assigning provider to team:", error);
      throw new Error("Failed to assign provider");
    }
  },

  removeProviderFromTeam: (teamId: string, providerId: string): boolean => {
    try {
      let all = loadFromStorage<TeamProvider[]>("nexus_teamProviders", mockTeamProviders);
      all = all.filter(
        (tp: TeamProvider) => !(tp.teamId === teamId && tp.providerId === providerId),
      );
      saveToStorage("nexus_teamProviders", all);
      return true;
    } catch (error) {
      console.error("Error removing provider from team:", error);
      return false;
    }
  },

  toggleTeamProvider: (
    teamId: string,
    providerId: string,
  ): TeamProvider | undefined => {
    try {
      const all = loadFromStorage<TeamProvider[]>("nexus_teamProviders", mockTeamProviders);
      const index = all.findIndex(
        (tp: TeamProvider) => tp.teamId === teamId && tp.providerId === providerId,
      );
      if (index === -1) return undefined;
      all[index].enabled = !all[index].enabled;
      saveToStorage("nexus_teamProviders", all);
      return all[index];
    } catch (error) {
      console.error("Error toggling team provider:", error);
      return undefined;
    }
  },

  //  Update team provider with encrypted API key
  updateTeamProvider: (
    teamId: string,
    providerId: string,
    config: Partial<TeamProvider>,
  ): TeamProvider | undefined => {
    try {
      const all = loadFromStorage<TeamProvider[]>("nexus_teamProviders", mockTeamProviders);
      const index = all.findIndex(
        (tp: TeamProvider) => tp.teamId === teamId && tp.providerId === providerId,
      );
      if (index === -1) return undefined;

      //  Encrypt API key if provided
      let encryptedConfig = { ...config };
      if (config.apiKeyEncrypted) {
        encryptedConfig.apiKeyEncrypted = encryptApiKey(config.apiKeyEncrypted);
      }

      all[index] = { ...all[index], ...encryptedConfig };
      saveToStorage("nexus_teamProviders", all);

      //  Return with decrypted key for display
      const decrypted = { ...all[index] };
      if (decrypted.apiKeyEncrypted) {
        decrypted.apiKeyEncrypted = decryptApiKey(decrypted.apiKeyEncrypted);
      }
      return decrypted;
    } catch (error) {
      console.error(`Error updating team provider:`, error);
      return undefined;
    }
  },


  // SPEND

  getSpend: (teamId?: string): Spend[] => {
    try {
      const all = loadFromStorage("nexus_spend", mockSpend);
      if (teamId) {
        return all.filter((s) => s.teamId === teamId);
      }
      return all;
    } catch (error) {
      console.error("Error fetching spend:", error);
      return [];
    }
  },

  getTeamSpendSummary: (teamId: string) => {
    try {
      const all = mockApi.getSpend(teamId);
      const total = all.reduce((sum, s) => sum + s.amount, 0);
      const byProvider = all.reduce(
        (acc, s) => {
          acc[s.providerId] = (acc[s.providerId] || 0) + s.amount;
          return acc;
        },
        {} as Record<string, number>,
      );
      const dailySpend = all.reduce(
        (acc, s) => {
          const date = s.createdAt.split("T")[0];
          acc[date] = (acc[date] || 0) + s.amount;
          return acc;
        },
        {} as Record<string, number>,
      );
      return {
        total,
        byProvider,
        dailySpend: Object.entries(dailySpend).map(([date, amount]) => ({
          date,
          amount,
        })),
        count: all.length,
      };
    } catch (error) {
      console.error(`Error fetching spend summary for ${teamId}:`, error);
      return {
        total: 0,
        byProvider: {},
        dailySpend: [],
        count: 0,
      };
    }
  },

  addSpend: (spend: Omit<Spend, "id">): Spend => {
    try {
      const all = mockApi.getSpend();
      const newSpend = {
        ...spend,
        id: generateId(),
      };
      all.push(newSpend);
      saveToStorage("nexus_spend", all);
      return newSpend;
    } catch (error) {
      console.error("Error adding spend:", error);
      throw new Error("Failed to add spend");
    }
  },



  // AUDIT LOG METHODS

  // Get all audit logs

  getAuditLogs: (): AuditLog[] => {
    try {
      return loadFromStorage<AuditLog[]>("nexus_auditLogs", mockAuditLogs)

    } catch (error) {
      console.error("Error fetching audit logs:", error);
      return mockAuditLogs;
    }
  },

  // Get audit logs by user

  getAuditLogsByUsers: (userId: string): AuditLog[] => {
    try {
      const all = mockApi.getAuditLogs();
      return all.filter((log) => log.userId === userId);
    } catch (error) {
      console.error(`Error fetching audit logs for user ${userId}:`, error);
      return [];
    }
  },

  // Get audit logs by action
  getAuditLogsByAction: (action: AuditAction): AuditLog[] => {
    try {
      const all = mockApi.getAuditLogs();
      return all.filter((log) => log.action === action);
    } catch (error) {
      console.error(`Error fetching audit logs for action ${action}:`, error);
      return [];
    }
  },


  // Add audit log
  addAuditLog: (log: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog => {
    try {
      const all = mockApi.getAuditLogs();
      const newLog: AuditLog = {
        ...log,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      all.unshift(newLog);
      saveToStorage("nexus_auditLogs", all);
      return newLog;
    } catch (error) {
      console.error("Error adding audit log:", error);
      throw new Error("Failed to add audit log");
    }
  },


  getRecentAuditLogs: (limit: number = 5): AuditLog[] => {
    try {
      const all = mockApi.getAuditLogs();
      return all.slice(0, limit);
    } catch (error) {
      console.error(`Error fetching recent audit logs:`, error);
      return [];
    }
  }
};




// MOCK AUDIT LOGS — INITIALIZATION


if (!localStorage.getItem("nexus_auditLogs")) {
  saveToStorage("nexus_auditLogs", mockAuditLogs)
}



// API CLIENT (Mock/Real Switch)

const isMockMode = import.meta.env.VITE_MOCK_MODE !== "false";

// Wraps mock API calls in Promise
const mockify = <T>(fn: () => T): Promise<T> => {
  return Promise.resolve(fn());
};

export const apiClient = {
  // USERS

  getUsers: (): Promise<User[]> => {
    return isMockMode ? mockify(mockApi.getUsers) : Promise.resolve([]);
  },

  getUser: (id: string): Promise<User | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.getUser(id))
      : Promise.resolve(undefined);
  },

  getUserByEmail: (email: string): Promise<User | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.getUserByEmail(email))
      : Promise.resolve(undefined);
  },

  addUser: (user: Omit<User, "id" | "createdAt">): Promise<User> => {
    return isMockMode
      ? mockify(() => mockApi.addUser(user))
      : Promise.reject(new Error("API not configured"));
  },

  updateUser: (id: string, updates: Partial<User>): Promise<User | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.updateUser(id, updates))
      : Promise.resolve(undefined);
  },

  deleteUser: (id: string): Promise<boolean> => {
    return isMockMode
      ? mockify(() => mockApi.deleteUser(id))
      : Promise.resolve(true);
  },

  // TEAMS

  getTeams: (): Promise<Team[]> => {
    return isMockMode ? mockify(mockApi.getTeams) : Promise.resolve([]);
  },

  getTeam: (id: string): Promise<Team | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.getTeam(id))
      : Promise.resolve(undefined);
  },

  addTeam: (team: Omit<Team, "id" | "createdAt">): Promise<Team> => {
    return isMockMode
      ? mockify(() => mockApi.addTeam(team))
      : Promise.reject(new Error("API not configured"));
  },

  updateTeam: (id: string, updates: Partial<Team>): Promise<Team | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.updateTeam(id, updates))
      : Promise.resolve(undefined);
  },

  deleteTeam: (id: string): Promise<boolean> => {
    return isMockMode
      ? mockify(() => mockApi.deleteTeam(id))
      : Promise.resolve(true);
  },

  // PROVIDERS

  getProviders: (): Promise<Provider[]> => {
    return isMockMode ? mockify(mockApi.getProviders) : Promise.resolve([]);
  },

  getProvider: (id: string): Promise<Provider | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.getProvider(id))
      : Promise.resolve(undefined);
  },

  addProvider: (provider: Omit<Provider, "id" | "createdAt">): Promise<Provider> => {
    return isMockMode
      ? mockify(() => mockApi.addProvider(provider))
      : Promise.reject(new Error("API not configured"));
  },

  updateProvider: (id: string, updates: Partial<Provider>): Promise<Provider | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.updateProvider(id, updates))
      : Promise.resolve(undefined);
  },

  deleteProvider: (id: string): Promise<boolean> => {
    return isMockMode
      ? mockify(() => mockApi.deleteProvider(id))
      : Promise.resolve(true);
  },

  toggleProviderStatus: (id: string): Promise<Provider | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.toggleProviderStatus(id))
      : Promise.resolve(undefined);
  },

  // TEAM-PROVIDERS

  getTeamProviders: (teamId: string): Promise<TeamProvider[]> => {
    return isMockMode
      ? mockify(() => mockApi.getTeamProviders(teamId))
      : Promise.resolve([]);
  },

  assignProviderToTeam: (
    teamId: string,
    providerId: string,
    config: Partial<TeamProvider>,
  ): Promise<TeamProvider> => {
    return isMockMode
      ? mockify(() => mockApi.assignProviderToTeam(teamId, providerId, config))
      : Promise.reject(new Error("API not configured"));
  },

  removeProviderFromTeam: (teamId: string, providerId: string): Promise<boolean> => {
    return isMockMode
      ? mockify(() => mockApi.removeProviderFromTeam(teamId, providerId))
      : Promise.resolve(true);
  },

  toggleTeamProvider: (teamId: string, providerId: string): Promise<TeamProvider | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.toggleTeamProvider(teamId, providerId))
      : Promise.resolve(undefined);
  },

  updateTeamProvider: (
    teamId: string,
    providerId: string,
    config: Partial<TeamProvider>,
  ): Promise<TeamProvider | undefined> => {
    return isMockMode
      ? mockify(() => mockApi.updateTeamProvider(teamId, providerId, config))
      : Promise.resolve(undefined);
  },

  // SPEND

  getSpend: (teamId?: string): Promise<Spend[]> => {
    return isMockMode
      ? mockify(() => mockApi.getSpend(teamId))
      : Promise.resolve([]);
  },

  getTeamSpendSummary: (teamId: string): Promise<any> => {
    return isMockMode
      ? mockify(() => mockApi.getTeamSpendSummary(teamId))
      : Promise.resolve({ total: 0, byProvider: {}, dailySpend: [], count: 0 });
  },

  addSpend: (spend: Omit<Spend, "id">): Promise<Spend> => {
    return isMockMode
      ? mockify(() => mockApi.addSpend(spend))
      : Promise.reject(new Error("API not configured"));
  },

  isMockMode: (): boolean => isMockMode,




  // AUDIT LOGS
  getAuditLogs: (): Promise<AuditLog[]> => {
    return isMockMode
      ? mockify(() => mockApi.getAuditLogs())
      : Promise.resolve([]);
  },


  getAuditLogByUser: (userId: string): Promise<AuditLog[]> => {
    return isMockMode ? mockify(() => mockApi.getAuditLogsByUsers(userId)) : Promise.resolve([])
  },

  getAuditLogsByAction: (action: AuditAction): Promise<AuditLog[]> => {
    return isMockMode ? mockify(() => mockApi.getAuditLogsByAction(action)) : Promise.resolve([])
  },


  addAuditLog: (log: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> => {
    return isMockMode ? mockify(() => mockApi.addAuditLog(log))
      : Promise.reject(new Error("API not configured"))
  },

  getRecentAuditLog: (limit: number = 5): Promise<AuditLog[]> => {

    return isMockMode ? mockify(() => mockApi.getRecentAuditLogs(limit)) : Promise.resolve([])

  }

};


