import { Component, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-header',
  imports: [RouterModule,MenuModule, AvatarModule, CommonModule, DrawerModule, ButtonModule,  ConfirmDialog, ToastModule,OverlayBadgeModule, PanelMenu],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [ConfirmationService, MessageService] // Add services
})
export class HeaderComponent {
  constructor(
    private router: Router, 
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {}

  visible: boolean = false;

  items = [
    {
      label: 'Select',
      items: [
        {
          label: 'Refresh',
          icon: 'pi pi-refresh',
          command: () => window.location.reload()
        },
        {
          label: 'Sign-Out',
          icon: 'pi pi-sign-out',
          command: () => this.confirmSignOut() // Call confirmation dialog
        }
      ]
    }
  ];

  confirmSignOut() {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      icon: 'pi pi-exclamation-circle',
      acceptButtonProps: {
        label: 'Confirm',
        severity: 'success'
      },
      rejectButtonProps: {
        label: 'cancel',
        severity: 'contrast',

       
        outlined: true
      },
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Signing Out', detail: 'Redirecting to login...', life: 2000 });
        localStorage.removeItem('authToken');
        setTimeout(() => {
          this.router.navigate(['/login']); // Navigate after confirmation
        }, 2000);
      },
      reject: () => {
        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'Sign-out cancelled', life: 2000 });
      }
    });
  }


   bars: MenuItem[] = [];
  
    ngOnInit() {
      this.bars = [
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: ['/welcome']
        },
        {
          label: 'Users',
          icon: 'pi pi-user',
          items: [
            {
              label: 'User Creation',
              icon: 'pi pi-user-plus',
              routerLink: ['/welcome/user-creation']
            },
            {
              label: 'View Users',
              icon: 'pi pi-eye',
              routerLink: ['/welcome/user-view']
            }
          ]
        },
        {
          label: 'Patients',
          icon: 'pi pi-users',
          items: [
            {
              label: 'Patient Creation',
              icon: 'pi pi-user-plus',
              routerLink: ['/welcome/patient-creation']
            },
            {
              label: 'Patient View',
              icon: 'pi pi-eye',
              routerLink: ['/welcome/patient-view']
            }
          ]
        },
        {
          label: 'Appointments',
          icon: 'pi pi-calendar',
          items: [
            {
              label: 'Appointment Creation',
              icon: 'pi pi-plus',
              routerLink: ['/welcome/appointment-creation']
            },
            {
              label: 'Appointment View',
              icon: 'pi pi-eye',
              routerLink: ['/welcome/appointment-view']
            }
          ]
        }
      ];
    }
  
  
 


}