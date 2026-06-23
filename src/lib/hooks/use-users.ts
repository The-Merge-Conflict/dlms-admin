// src/lib/hooks/use-users.ts
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';

export const userKeys = {
  all: ['users'] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => usersApi.getAll(),
  });
}
