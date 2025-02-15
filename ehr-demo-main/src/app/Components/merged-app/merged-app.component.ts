import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Drawer } from 'primeng/drawer';
import { HeaderComponent } from '../header/header.component';

import { LoginComponent } from '../login/login.component';
import { UserCreationComponent } from '../user-creation/user-creation.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegistrationComponent } from '../registration/registration.component';
@Component({
  selector: 'app-merged-app',
  imports: [
    SidebarComponent,
    RegistrationComponent,
    HeaderComponent,
    LoginComponent,
    PaginationComponent,
    RouterModule,
    RouterOutlet
  ],
  templateUrl: './merged-app.component.html',
  styleUrl: './merged-app.component.scss'
})
export class MergedAppComponent {

}