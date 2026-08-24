import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Team } from "../types";
import { apiClient } from "../api/client";

interface TeamContextType {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  teams: Team[];
  isLoading: boolean;
  refreshTeams: () => Promise<void>;
  switchTeam: (teamId: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTeams = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.getTeams();
      setTeams(data);

      if (!currentTeam && data.length > 0) {
        setCurrentTeam(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentTeam]);

  const switchTeam = useCallback(
    (teamId: string) => {
      const team = teams.find((t) => t.id === teamId);
      if (team) {
        setCurrentTeam(team);
        localStorage.setItem("nexus_current_team", teamId);
        console.log("Team switched to:", team.name);
      }
    },
    [teams],
  );

  useEffect(() => {
    const savedTeamId = localStorage.getItem("nexus_current_team");
    if (savedTeamId && teams.length > 0) {
      const team = teams.find((t) => t.id === savedTeamId);
      if (team) {
        setCurrentTeam(team);
      }
    }
  }, [teams]);

  useEffect(() => {
    refreshTeams();
  }, []);

  return (
    <TeamContext.Provider
      value={{
        currentTeam,
        setCurrentTeam,
        teams,
        isLoading,
        refreshTeams,
        switchTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};
