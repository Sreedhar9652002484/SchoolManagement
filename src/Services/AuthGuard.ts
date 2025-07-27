import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './AuthService';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isTokenExpired()) {
    authService.logout();
    router.navigate(['/auth/signin']);
    return false;
  }

  const role = authService.getRole();
  const allowedRoles = route.data['roles'] as string[];

  if (role && allowedRoles.includes(role)) {
    return true;
  }

  router.navigate(['/auth/signin']);
  return false;
};
