import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { AppointmentService } from '../../services/appointment/appointment.service';

@Component({
  selector: 'app-appointment-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    DropdownModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    CardModule, ConfirmDialog,ToastModule,DialogModule,AppointmentFormComponent
  ],
  templateUrl: './appointment-view.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrls: []
})
export class AppointmentViewComponent implements OnInit {
  appointments: any[] = [];
  selectedAppointment: any = null;
  isDialogVisible: boolean = false;

  selectedStatus: string | null = null;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Pending', value: 'pending' },
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private appointmentService: AppointmentService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }
  loadAppointments(page: number = 1, search: string = '') {
    this.appointmentService.getAppointmentsPag(page, search).subscribe({
      next: (response) => {
        this.appointments = response.appointments;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load appointments',
        });
      },
    });
  }


  onGlobalSearch(event: Event, dt: Table): void {
   const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value.trim().toLowerCase();
    dt.filterGlobal(filterValue, 'contains');
    this.loadAppointments(1, filterValue);
  }
  

  onStatusFilterChange(event: any, table: Table): void {
    if (!this.selectedStatus) {
      table.filter('', 'status', 'equals');
    } else {
      table.filter(this.selectedStatus.toLowerCase(), 'status', 'equals');
    }
  }

  openEditDialog(appointment: any): void {
    this.selectedAppointment = { ...appointment };
    this.isDialogVisible = true;
  }
 
  closeDialog(): void {
    this.isDialogVisible = false;
    this.selectedAppointment = null;
  }
  saveAppointment(updatedAppointment: any): void {
    const index = this.appointments.findIndex((a) => a._id === updatedAppointment._id);
    if (index !== -1) {
      this.appointments[index] = updatedAppointment;
      this.cdr.detectChanges();
    }
    this.closeDialog();
    this.loadAppointments(); // Refresh list after update
  }

  confirm2(event: Event, appointment: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete Appointment?`,
      header: 'Alert',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.appointmentService.deleteAppointment(appointment._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: `Appointment deleted successfully`,
            });
            this.loadAppointments();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to delete appointment',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Deletion Cancelled',
        });
      },
    });
  
  }

  
}