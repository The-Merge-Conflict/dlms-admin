// src/types/auth.ts
// Matches DLMS backend AuthResponseDto + Auth endpoints.
// The AuthController binds the MediatR commands directly as the request body,
// so we mirror the backend names: RegisterCommand / LoginCommand.
export interface AuthResponseDto {
  succeeded: boolean;
  userId: string;
  userName: string;
  email: string;
  token: string;
  roles: string[];
  errors: string[];
}

// POST /api/auth/login  -> binds LoginCommand
export interface LoginCommand {
  email: string;
  password: string;
}

// The backend supports these roles in [Authorize(Roles=...)] checks.
// Adjust if your RegisterCommandValidator allows a different set.
export type UserRole = 'Admin' | 'Editor' | 'Viewer';

// POST /api/auth/register  -> binds RegisterCommand
export interface RegisterCommand {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}
