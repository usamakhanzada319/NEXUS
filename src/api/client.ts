import {
  ApiResponse,
  Team,
  Provider,
  TeamProvider,
  Spend,
  User,
} from "../types";

import {
  mockUsers,
  mockProvider,
  mockSpend,
  mockTeamProvider,
  mockTeams,
} from "./mockData";

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
    saveToStorage("nexus_providers", mockProvider);
  }
  if (!localStorage.getItem("nexus_teamProviders")) {
    saveToStorage("nexus_teamProviders", mockTeamProvider);
  }
  if (!localStorage.getItem("nexus_spend")) {
    saveToStorage("nexus_spend", mockSpend);
  }
};

initMockData();

// GENERATE ID

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

// MOCK API CLIENT

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

  //  TEAMS

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
      return loadFromStorage("nexus_providers", mockProvider);
    } catch (error) {
      console.error("Error fetching providers:", error);
      return mockProvider;
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
      const all = loadFromStorage("nexus_teamProviders", mockTeamProvider);
      return all.filter((tp) => tp.teamId === teamId);
    } catch (error) {
      console.error(`Error fetching team providers for ${teamId}:`, error);
      return [];
    }
  },

  getProviderTeam: (providerId: string): TeamProvider[] => {
    try {
      const all = loadFromStorage("nexus_teamProviders", mockTeamProvider);
      return all.filter((tp) => tp.providerId === providerId);
    } catch (error) {
      console.error(`Error fetching provider teams for ${providerId}:`, error);
      return [];
    }
  },

  assignProviderToTeam: (
    teamId: string,
    providerId: string,
    config: Partial<TeamProvider>,
  ): TeamProvider => {
    try {
      const all = loadFromStorage("nexus_teamProviders", mockTeamProvider);
      const existing = all.find(
        (tp) => tp.teamId === teamId && tp.providerId === providerId,
      );
      if (existing) {
        Object.assign(existing, config);
        saveToStorage("nexus_teamProviders", all);
        return existing;
      }
      const newAssignment: TeamProvider = {
        teamId,
        providerId,
        enabled: config.enabled ?? true,
        spendLimit: config.spendLimit ?? 0,
        modelsAssigned: config.modelsAssigned ?? [],
        assignedAt: new Date().toISOString(),
      };
      all.push(newAssignment);
      saveToStorage("nexus_teamProviders", all);
      return newAssignment;
    } catch (error) {
      console.error("Error assigning provider to team:", error);
      throw new Error("Failed to assign provider");
    }
  },

  removeProviderFromTeam: (teamId: string, providerId: string): boolean => {
    try {
      let all = loadFromStorage("nexus_teamProviders", mockTeamProvider);
      all = all.filter(
        (tp) => !(tp.teamId === teamId && tp.providerId === providerId),
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
      const all = loadFromStorage("nexus_teamProviders", mockTeamProvider);
      const index = all.findIndex(
        (tp) => tp.teamId === teamId && tp.providerId === providerId,
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
};
