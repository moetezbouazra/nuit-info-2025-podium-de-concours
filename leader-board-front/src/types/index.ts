export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  teamId: string | null;
  team?: Team | null;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  score: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    members: number;
  };
  members?: User[];
  achievements?: TeamAchievement[];
  activities?: Activity[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  createdAt: string;
}

export interface TeamAchievement {
  id: string;
  teamId: string;
  achievementId: string;
  achievement: Achievement;
  awardedAt: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  points: number;
  teamId: string;
  createdAt: string;
}

export interface LeaderboardTeam extends Team {
  rank: number;
  memberCount: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface UpdateScoreInput {
  points: number;
  description: string;
}

export interface CreateTeamInput {
  name: string;
  description?: string;
  avatarUrl?: string;
}

export interface UpdateTeamInput {
  name?: string;
  description?: string | null;
  avatarUrl?: string | null;
}
