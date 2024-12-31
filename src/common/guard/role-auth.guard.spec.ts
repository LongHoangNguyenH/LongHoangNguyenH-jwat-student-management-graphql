import { AuthRoleGuard } from './role-auth.guard';

describe('AuthRoleGuard', () => {
  it('should be defined', () => {
    expect(new AuthRoleGuard()).toBeDefined();
  });
});
