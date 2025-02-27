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
  

  
  appointments = [
    {
      id: 1,
      doctor: { name: "Dr. Smith", email: "smith@example.com" },
      patient: { name: "Viraj Patel", email: "viraj.patel@example.com" },
      date: "02-26-2023",
      timeSlot: "9:00 AM - 10:00 AM",
      reason: "Consultation",
      status: "completed"
    },
    {
      id: 2,
      doctor: { name: "Dr. Jones", email: "jones@example.com" },
      patient: { name: "Sophia Jones", email: "sophia.jones@example.com" },
      date: "03-15-2023",
      timeSlot: "10:00 AM - 11:00 AM",
      reason: "Treatment",
      status: "pending"
    },
    {
      id: 3,
      doctor: { name: "Dr. Wilson", email: "wilson@example.com" },
      patient: { name: "Parthiv Mehta", email: "parthiv.mehta@example.com" },
      date: "04-08-2023",
      timeSlot: "11:00 AM - 12:00 PM",
      reason: "Diagnosis",
      status: "rejected"
    },
    {
      id: 4,
      doctor: { name: "Dr. Emily Carter", email: "emily.carter@example.com" },
      patient: { name: "Rahul Sharma", email: "rahul.sharma@example.com" },
      date: "05-10-2023",
      timeSlot: "2:00 PM - 3:00 PM",
      reason: "Follow-up",
      status: "completed"
    },
    {
      id: 5,
      doctor: { name: "Dr. Liam Brown", email: "liam.brown@example.com" },
      patient: { name: "Olivia Green", email: "olivia.green@example.com" },
      date: "06-22-2023",
      timeSlot: "4:00 PM - 5:00 PM",
      reason: "Physical Therapy",
      status: "pending"
    },
    {
      id: 6,
      doctor: { name: "Dr. Ava Martinez", email: "ava.martinez@example.com" },
      patient: { name: "Daniel Thomas", email: "daniel.thomas@example.com" },
      date: "07-05-2023",
      timeSlot: "1:00 PM - 2:00 PM",
      reason: "Routine Checkup",
      status: "completed"
    },
    {
      id: 7,
      doctor: { name: "Dr. Noah Johnson", email: "noah.johnson@example.com" },
      patient: { name: "Emma White", email: "emma.white@example.com" },
      date: "08-19-2023",
      timeSlot: "3:00 PM - 4:00 PM",
      reason: "Vaccination",
      status: "rejected"
    },
    {
      id: 8,
      doctor: { name: "Dr. Olivia Davis", email: "olivia.davis@example.com" },
      patient: { name: "Ethan Robinson", email: "ethan.robinson@example.com" },
      date: "09-12-2023",
      timeSlot: "5:00 PM - 6:00 PM",
      reason: "Skin Allergy",
      status: "pending"
    },
    {
      id: 9,
      doctor: { name: "Dr. William Moore", email: "william.moore@example.com" },
      patient: { name: "Sophia Scott", email: "sophia.scott@example.com" },
      date: "10-25-2023",
      timeSlot: "10:00 AM - 11:00 AM",
      reason: "Eye Checkup",
      status: "completed"
    },
    {
      id: 10,
      doctor: { name: "Dr. Benjamin Taylor", email: "benjamin.taylor@example.com" },
      patient: { name: "Michael King", email: "michael.king@example.com" },
      date: "11-30-2023",
      timeSlot: "9:00 AM - 10:00 AM",
      reason: "Orthopedic Consultation",
      status: "pending"
    }
  ];
  
  
  selectedAppointment: any = null; // Removed @Input()
  isDialogVisible: boolean = false;
 
  selectedStatus: string | null = null;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Pending', value: 'pending' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router:Router
  ) {}

  ngOnInit(): void {}

  onGlobalSearch(event: Event, dt: Table): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value.trim().toLowerCase();
  
    dt.filterGlobal(filterValue, 'contains'); // This will now only filter by doctor.name and patient.name
  }
  

  onStatusFilterChange(event: any, table: Table): void {
    if (!this.selectedStatus) {
      table.filter('', 'status', 'equals'); // Reset filter to show all records
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
    const index = this.appointments.findIndex((a) => a.id === updatedAppointment.id);
    if (index !== -1) {
      this.appointments[index] = updatedAppointment;
    }
    this.isDialogVisible = false;
  }


  confirm2(event: Event, customer: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Do you want to delete ${customer.first_name}?`,
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
        this.userService.deleteUser(customer._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: `${customer.first_name} deleted successfully`
            });
            //this.loading=true;
            // this.loadUsers();
          },
          error: (error) => {
            
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Deletion Cancelled'
        });
      },
    });
  }

  
}