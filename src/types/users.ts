// src/types/users.ts
// Matches DLMS backend UserDto (GET /api/users).
export interface UserDto {
  id: string;
  userName: string;
  email: string;
  roles: string[];
}
