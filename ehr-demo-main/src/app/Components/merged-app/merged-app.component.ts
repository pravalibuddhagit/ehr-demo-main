import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Drawer } from 'primeng/drawer';
import { HeaderComponent } from '../header/header.component';
import { DrawerComponent } from '../drawer/drawer.component';
import { LoginComponent } from '../login/login.component';
import { UserCreationComponent } from '../user-creation/user-creation.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { RouterModule, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-merged-app',
  imports: [
    SidebarComponent,
    DrawerComponent,
    HeaderComponent,
    LoginComponent,
    UserCreationComponent,
    PaginationComponent,
    RouterModule,
    RouterOutlet
  ],
  templateUrl: './merged-app.component.html',
  styleUrl: './merged-app.component.scss'
})
export class MergedAppComponent {

}