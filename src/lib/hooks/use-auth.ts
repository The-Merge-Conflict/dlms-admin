// src/lib/hooks/use-auth.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { LoginCommand, RegisterCommand } from '@/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (command: LoginCommand) => authApi.login(command),
  });
}

// Admin creating another user account.
export function useRegister() {
  return useMutation({
    mutationFn: (command: RegisterCommand) => authApi.register(command),
  });
}
