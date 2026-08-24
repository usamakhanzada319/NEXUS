import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { apiClient } from "../api/client";
import { Team } from "../types";
import { useAuth } from "../context/AuthContext";

export const Teams: React.FC = () => {
  const { isAdmin, user } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getTeams();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      await apiClient.deleteTeam(id);
      await fetchTeams();
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and their AI providers
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Team
          </button>
        )}
      </div>
      {/* Team List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 card-hover"
          >
            <div className="flex items-start justify-between ">
              <div>
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {team.description || "No Description"}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  team.status === "active"
                    ? `bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {team.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>0 Member</span>
              </div>
              <span>{new Date(team.createdAt).toLocaleDateString()}</span>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    setEditingTeam(team);
                    setShowForm(true);
                  }}
                  className="p-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="p-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  {" "}
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingTeam ? "Edit Team" : "Add New Team"}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const data = {
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  status: "active" as const,
                  createdBy: user?.id || "unknown",
                };
                try {
                  if (editingTeam) {
                    await apiClient.updateTeam(editingTeam.id, data);
                  } else {
                    await apiClient.addTeam(data);
                  }
                  await fetchTeams();
                  setShowForm(false);
                  setEditingTeam(null);
                } catch (error) {
                  console.error("Failed to save team:", error);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingTeam?.name || ""}
                  placeholder="Enter team name"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                {" "}
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingTeam?.description || ""}
                  placeholder="Enter team description"
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingTeam ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTeam(null);
                  }}
                  className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
