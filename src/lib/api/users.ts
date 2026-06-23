// src/lib/api/users.ts
// Backend: GET /api/users returns all registered users with their roles (Admin only).
import apiClient from './axios-client';
import { UserDto } from '@/types/users';

export const usersApi = {
  getAll: async (): Promise<UserDto[]> => {
    const { data } = await apiClient.get<UserDto[]>('/users');
    return data;
  },
};
