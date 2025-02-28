import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { AvatarModule } from 'primeng/avatar';

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
    CardModule, ConfirmDialog,ToastModule,DialogModule,AppointmentFormComponent,AvatarModule
  ],
  templateUrl: './appointment-view.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrls: []
})
export class AppointmentViewComponent {
  appointments: any[] = [];
  selectedAppointment: any = null;
  isDialogVisible: boolean = false;
  totalRecords: number = 0; 
  currentPage: number = 1; 
  rowsPerPage: number = 5; 
  searchTerm: string = ''; 

  selectedStatus: string | null = null;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Pending', value: 'pending' },
  ];
  @ViewChild('dt') dt!: Table;
  constructor(
    private confirmationService: ConfirmationService,
    private appointmentService: AppointmentService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router:Router
  ) {}

  loadAppointments() {
    this.appointmentService.getAppointmentsPag(
      this.currentPage,
      this.rowsPerPage,
      this.searchTerm
    ).subscribe({
      next: (response) => {
        this.appointments = response.appointments;
        this.totalRecords = response.pagination.totalRecords;
      //  this.cdr.detectChanges();
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
  onPageChange(event: any) {
    console.log('onPageChange called:', event);
    this.currentPage = event.first / event.rows + 1;
    this.rowsPerPage = event.rows;
    this.loadAppointments();
  }

  onGlobalSearch(event: Event, dt: Table): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value.trim().toLowerCase();
    // dt.filterGlobal(this.searchTerm, 'contains'); this triggers client sidde/front end side filtering
    this.currentPage = 1; // Reset to page 1 on search
    this.loadAppointments();
  }
  
  onStatusFilterChange(event: any, table: Table): void {
    if (!this.selectedStatus) {
      table.filter('', 'status', 'equals');
    } else {
      table.filter(this.selectedStatus.toLowerCase(), 'status', 'equals');
    }
    this.loadAppointments(); // Refresh list after status filter
  }

  openEditDialog(appointment: any): void {
    this.selectedAppointment = { ...appointment };
    this.isDialogVisible = true;
  }
 
  closeDialog(): void {
    this.isDialogVisible = false;
    this.selectedAppointment = null;

  }
  saveAppointment(): void {
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