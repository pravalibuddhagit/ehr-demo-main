import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [SidebarComponent,HeaderComponent,RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  constructor(private router: Router) {}
  isWelcomePage(): boolean {
    return this.router.url === '/welcome';
  }
}

