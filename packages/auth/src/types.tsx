export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: string;
  avatarUrl: string | null;
}
