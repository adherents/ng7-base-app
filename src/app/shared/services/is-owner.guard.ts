import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { tap, take, map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class IsOwnerGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private uiService: UIService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.currentUser.pipe(
      take(1),
      map((currentUser) => !!currentUser && currentUser.id === route.params.userId),
      tap((isOwner) => {
        if (!isOwner) {
          this.uiService.showSnackbar('This is not your profile!', 'snack-danger');
          this.router.navigate(['/blog'], {queryParams: {returnUrl: state.url}});
        }
      })
    );
  }
}
