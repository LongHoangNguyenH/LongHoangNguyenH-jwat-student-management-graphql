import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { role } from 'src/common/guard/role';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<typeof role>('roles', context.getHandler());
    if (!roles) {
      return false;
    }
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const authHeader = request.headers['authorization'];
    const token = authHeader.split(' ')[1];
    for (let i = 0; i < roles.length; i++) {
      if (token == roles[i]) {
        return true;
      }
    }
    return false;
  }
}
