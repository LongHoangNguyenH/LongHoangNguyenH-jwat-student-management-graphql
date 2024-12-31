import { SetMetadata } from '@nestjs/common';
import { role } from 'src/common/guard/role';

export const Roles = (...roles: typeof role) => SetMetadata('roles', roles);
