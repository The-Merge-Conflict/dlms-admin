export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  isActive: boolean;
  createdAt: string;
}