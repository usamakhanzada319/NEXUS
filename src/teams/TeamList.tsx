import { useAuth } from "../context/AuthContext";
import { Team } from "../types";
import { Edit, Trash2, Users } from "lucide-react";

interface TeamListProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const TeamList: React.FC<TeamListProps> = ({
  teams,
  onDelete,
  onEdit,
  isLoading = false,
}) => {
  const { isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 animate-pulse"
          >
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No teams yet</h3>
        <p className="text-sm text-muted-foreground">
          Create your first team to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6 card-hover"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{team.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {team.description || "No description"}
              </p>
            </div>

            <span
              className={`px-2 py-1 text-xs rounded-full ${team.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}`}
            >
              {team.status}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>0 members</span>
            </div>
            <span>{new Date(team.createdAt).toLocaleDateString()}</span>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <button
                onClick={() => onEdit(team)}
                className="p-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(team.id)}
                className="p-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
