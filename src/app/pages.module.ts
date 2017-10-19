import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { P404Component } from './shared/404.component';
import { P500Component } from './shared/500.component';
import { LoginComponent } from './login/login.component';

import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PagesRoutingModule ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent
  ]
})
export class PagesModule { }
