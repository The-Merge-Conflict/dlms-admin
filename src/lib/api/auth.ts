// src/lib/api/auth.ts
import apiClient from './axios-client';
import { AuthResponseDto, LoginCommand, RegisterCommand } from '@/types/auth';

export const authApi = {
  login: async (command: LoginCommand): Promise<AuthResponseDto> => {
    const { data } = await apiClient.post<AuthResponseDto>('/auth/login', command);
    return data;
  },
  register: async (command: RegisterCommand): Promise<AuthResponseDto> => {
    const { data } = await apiClient.post<AuthResponseDto>('/auth/register', command);
    return data;
  },
};
