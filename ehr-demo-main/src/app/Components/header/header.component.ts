import { Component, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-header',
  imports: [MenuModule, AvatarModule, CommonModule, DrawerModule, ButtonModule, RouterLink, ConfirmDialog, ToastModule,OverlayBadgeModule],
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
      label: 'Options',
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
        severity: 'contrast'
      },
      rejectButtonProps: {
        label: 'cancel',
       
        outlined: true
      },
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Signing Out', detail: 'Redirecting to login...', life: 2000 });
        setTimeout(() => {
          this.router.navigate(['/login']); // Navigate after confirmation
        }, 2000);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Sign-out cancelled', life: 2000 });
      }
    });
  }

  

}
