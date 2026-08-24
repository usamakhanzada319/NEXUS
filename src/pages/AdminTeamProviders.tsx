import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTeam } from "../context/TeamContext";
import { apiClient } from "../api/client";
import { Team, Provider, TeamProvider } from "../types";
import { TeamProviderCard } from "../components/admin/TeamProviderCard";
import { Users, Server, Search, X } from "lucide-react";

export const AdminTeamProviders: React.FC = () => {
  const { isAdmin } = useAuth();
  const { teams, currentTeam, switchTeam } = useTeam();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [teamProviders, setTeamProviders] = useState<TeamProvider[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(
    currentTeam?.id || "",
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [providersData, teamsData] = await Promise.all([
          apiClient.getProviders(),
          apiClient.getTeams(),
        ]);
        setProviders(providersData);

        // Get team-providers for selected team
        if (selectedTeamId) {
          const tp = await apiClient.getTeamProviders(selectedTeamId);
          setTeamProviders(tp);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTeamId]);

  const handleToggle = async (providerId: string) => {
    try {
      const updated = await apiClient.toggleTeamProvider(
        selectedTeamId,
        providerId,
      );
      if (updated) {
        setTeamProviders((prev) =>
          prev.map((tp) => (tp.providerId === providerId ? updated : tp)),
        );
      }
    } catch (error) {
      console.error("Failed to toggle provider:", error);
    }
  };

  const handleUpdate = async (
    providerId: string,
    data: { spendLimit: number; modelsAssigned: string[] },
  ) => {
    try {
      const updated = await apiClient.updateTeamProvider(
        selectedTeamId,
        providerId,
        data,
      );
      if (updated) {
        setTeamProviders((prev) =>
          prev.map((tp) => (tp.providerId === providerId ? updated : tp)),
        );
      }
    } catch (error) {
      console.error("Failed to update provider:", error);
    }
  };

  const handleRemove = async (providerId: string) => {
    if (!confirm("Remove this provider from the team?")) return;
    try {
      await apiClient.removeProviderFromTeam(selectedTeamId, providerId);
      setTeamProviders((prev) =>
        prev.filter((tp) => tp.providerId !== providerId),
      );
    } catch (error) {
      console.error("Failed to remove provider:", error);
    }
  };

  const handleAssignAll = async () => {
    if (!selectedTeamId) return;

    const unassignedProviders = providers.filter(
      (p) => !teamProviders.some((tp) => tp.providerId === p.id),
    );

    for (const provider of unassignedProviders) {
      try {
        const assigned = await apiClient.assignProviderToTeam(
          selectedTeamId,
          provider.id,
          {
            enabled: true,
            spendLimit: 1000,
            modelsAssigned: provider.models.slice(0, 2),
          },
        );
        setTeamProviders((prev) => [...prev, assigned]);
      } catch (error) {
        console.error("Failed to assign provider:", error);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          Loading...
        </div>
      </div>
    );
  }

  // Get assigned provider IDs
  const assignedProviderIds = teamProviders.map((tp) => tp.providerId);
  const assignedProviders = teamProviders
    .map((tp): (Provider & TeamProvider) | null => {
      const provider = providers.find((p) => p.id === tp.providerId);
      if (!provider) return null;
      return {
        ...provider,
        ...tp,
      };
    })
    .filter((item): item is Provider & TeamProvider => item !== null);

  const unassignedProviders = providers.filter(
    (p) => !assignedProviderIds.includes(p.id),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Provider Assignment</h1>
          <p className="text-muted-foreground">
            Assign AI providers to teams and configure their settings
          </p>
        </div>
      </div>

      {/* Team Selector */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium">Select Team:</label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">
            {assignedProviders.length} providers assigned
          </span>
        </div>
      </div>

      {/* Assigned Providers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Server className="h-5 w-5 text-primary-500" />
            Assigned Providers
            <span className="text-sm font-normal text-muted-foreground">
              ({assignedProviders.length})
            </span>
          </h2>
        </div>

        {assignedProviders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-12 text-center">
            <Server className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No providers assigned</h3>
            <p className="text-sm text-muted-foreground">
              Assign providers to this team or click "Assign All" below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedProviders.map((provider) => (
              <TeamProviderCard
                key={provider.id}
                provider={provider}
                teamId={selectedTeamId}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Unassigned Providers */}
      {unassignedProviders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Available Providers
              <span className="text-sm font-normal text-muted-foreground">
                ({unassignedProviders.length})
              </span>
            </h2>
            <button
              onClick={handleAssignAll}
              className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Assign All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unassignedProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4 flex items-center justify-between card-hover"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{provider.icon || "🤖"}</span>
                  <div>
                    <h4 className="font-semibold">{provider.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {provider.models.length} models
                    </p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const assigned = await apiClient.assignProviderToTeam(
                        selectedTeamId,
                        provider.id,
                        {
                          enabled: true,
                          spendLimit: 1000,
                          modelsAssigned: provider.models.slice(0, 2),
                        },
                      );
                      setTeamProviders((prev) => [...prev, assigned]);
                    } catch (error) {
                      console.error("Failed to assign provider:", error);
                    }
                  }}
                  className="px-3 py-1.5 text-sm text-primary-500 border border-primary-500 rounded-lg hover:bg-primary-50 transition-colors dark:hover:bg-primary-900/20"
                >
                  Assign
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
