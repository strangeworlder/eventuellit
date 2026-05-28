import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: string;
  avatarUrl?: string | null;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    return ctx.switchToHttp().getRequest().user;
  },
);
