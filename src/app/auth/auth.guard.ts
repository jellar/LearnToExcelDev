import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';
@Injectable()

export class AuthGuard implements CanActivate {
    constructor( private router: Router
                , private authService: AuthService) {}

    canActivate() {
    if (this.authService.isUserAuthenticated()) {
      return true;
    } else {
      this.router.navigateByUrl('/pages/login');
      return false;
    }
  }
}
