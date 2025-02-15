

import { Component, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [MenuModule,AvatarModule,CommonModule,DrawerModule,ButtonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
   constructor(private router:Router ){}
  items = [
    {
      label: 'Options',
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh',
          command: () => window.location.reload() // Refresh functionality
        },
        {
          label: 'Sign-Out',
          icon: 'pi pi-sign-out',
          command: () => this.router.navigate(['/login'])
        }
      ]
    }
  ];
   @ViewChild('drawerRef') drawerRef!: Drawer;
 
      closeCallback(e:Event): void {
          this.drawerRef.close(e);
      }
      visible: boolean = false;
     
}
 
