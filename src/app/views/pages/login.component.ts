import { Component } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../auth/auth.service';
@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  model: any = {};
  constructor(private auth: AuthService) { }
  login(): void {
      this.auth.login('admin@learntoexcel.co.uk', 'Chang3m3.').subscribe((user) => {
        console.log(user.json());
      }, err => {
        console.log(err);
      });
  }
}
