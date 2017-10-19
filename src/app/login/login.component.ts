import { Component } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';
@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  model: any = {};
  constructor(private auth: AuthService, private router: Router) { }
  login(): void {
      this.auth.login(this.model.email, this.model.password).subscribe(
                data => {
                      console.log('logged in');
                      this.router.navigate(['dashboard']);
                },
                error => {
                   console.log(error);
                });
  }
}
