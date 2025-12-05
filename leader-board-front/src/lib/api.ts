import type { ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data.data as T;
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ user: import('@/types').User; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    this.setToken(data.token);
    return data;
  }

  async register(email: string, password: string, name: string) {
    const data = await this.request<{ user: import('@/types').User; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    );
    this.setToken(data.token);
    return data;
  }

  async getCurrentUser() {
    return this.request<{ user: import('@/types').User }>('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Teams
  async getTeams() {
    return this.request<{ teams: import('@/types').Team[] }>('/teams');
  }

  async getTeam(id: string) {
    return this.request<{ team: import('@/types').Team }>(`/teams/${id}`);
  }

  async createTeam(data: import('@/types').CreateTeamInput) {
    return this.request<{ team: import('@/types').Team }>('/teams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTeam(id: string, data: import('@/types').UpdateTeamInput) {
    return this.request<{ team: import('@/types').Team }>(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTeam(id: string) {
    return this.request<void>(`/teams/${id}`, {
      method: 'DELETE',
    });
  }

  async updateTeamScore(id: string, data: import('@/types').UpdateScoreInput) {
    return this.request<{ team: import('@/types').Team }>(`/teams/${id}/score`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async joinTeam(id: string) {
    return this.request<{ user: import('@/types').User }>(`/teams/${id}/join`, {
      method: 'POST',
    });
  }

  async leaveTeam() {
    return this.request<{ user: import('@/types').User }>('/teams/leave', {
      method: 'POST',
    });
  }

  // Leaderboard
  async getLeaderboard() {
    return this.request<{ leaderboard: import('@/types').LeaderboardTeam[] }>(
      '/leaderboard'
    );
  }

  // Achievements
  async getAchievements() {
    return this.request<{ achievements: import('@/types').Achievement[] }>(
      '/achievements'
    );
  }

  async awardAchievement(teamId: string, achievementId: string) {
    return this.request<{ teamAchievement: import('@/types').TeamAchievement }>(
      `/teams/${teamId}/achievements`,
      {
        method: 'POST',
        body: JSON.stringify({ achievementId }),
      }
    );
  }
}

export const api = new ApiClient();
