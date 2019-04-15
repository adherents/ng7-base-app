import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tap, take, map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { UIService } from '../services/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private uiService: UIService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.currentUser.pipe(
      take(1),
      map((currentUser) => !!currentUser),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.uiService.showSnackbar('In order to use this page, please login.', 'snack-danger');
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
