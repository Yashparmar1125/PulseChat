// Communities API endpoints

import { api } from "@/services/api.client";

export interface Community {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  memberCount: number;
  createdAt: string;
}

export interface CommunityDetail extends Community {
  members: Array<{
    id: string;
    username: string;
    profilePicUrl?: string;
  }>;
  channels: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export interface CreateCommunityRequest {
  name: string;
  description?: string;
  avatar?: string;
}

export const communitiesApi = {
  // Get all communities
  getCommunities: async (): Promise<{ communities: Community[] }> => {
    return api.get<{ communities: Community[] }>("/communities");
  },

  // Get a single community
  getCommunity: async (communityId: string): Promise<CommunityDetail> => {
    return api.get<CommunityDetail>(`/communities/${communityId}`);
  },

  // Create community
  createCommunity: async (data: CreateCommunityRequest): Promise<{ id: string; message: string }> => {
    return api.post<{ id: string; message: string }>("/communities", data);
  },

  // Join community
  joinCommunity: async (communityId: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/communities/${communityId}/join`);
  },

  // Leave community
  leaveCommunity: async (communityId: string): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/communities/${communityId}/leave`);
  },
};






