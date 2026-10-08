import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export class AuthGuard {
  static canActivate(): CanActivateFn {
    return () => {
      const authService = inject(AuthService);
      const router = inject(Router);

      if (authService.isLoggedIn()) {
        return true;
      }

      router.navigate(['/'], { 
        queryParams: { reason: 'unauthorized' } 
      });
      return false;
    };
  }
}