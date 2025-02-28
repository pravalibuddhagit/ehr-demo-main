import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
// PrimeNG Modules
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { AppointmentService} from  './../../services/appointment/appointment.service'; 

@Component({
  selector: 'app-appointment-form',
  standalone: true,  // This makes it a standalone component
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss'],
  providers: [MessageService, ConfirmationService], // Required for p-toast & p-confirmdialog
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
   // Required for PrimeNG animations
    CalendarModule,          // Required for <p-calendar>
    ConfirmDialogModule,     // Required for <p-confirmdialog>
    ToastModule,             // Required for <p-toast>
    DropdownModule,          // Required for dropdown <select>
    InputTextModule,         // Required for input fields
    ButtonModule ,
    RouterModule ,        // Required for buttons,
    SelectModule
  ]
})export class AppointmentFormComponent implements OnInit{

  @Input() appointment: any;  
  isEditMode: boolean = false;
  selectedAppointment: any;
  
  selectedProvider: any; // or specify correct type
  selectedPatient: any;  // or specify correct type

  appointmentForm!: FormGroup;
  providers: any[] = [];
  patients: any[] = [];
  providerPage = 1;
  patientPage = 1;
  providerTotalRecords = 0;
  patientTotalRecords = 0;
  limit = 4;

  timeSlots = [
    { slot: '9AM - 10AM' },
    { slot: '10AM - 11AM' },
    { slot: '11AM - 12PM' },
    { slot: '12PM - 1PM' },
    { slot: '2PM - 3PM' },
    { slot: '3PM - 4PM' },
    { slot: '4PM - 5PM' },
    { slot: '5PM - 6PM' }
  ];

  statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' }
  ];
 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdRef: ChangeDetectorRef,
    private appointmentService: AppointmentService // Inject PatientService
  ) {}

  minDate: Date = new Date();

  ngOnInit() {
     this.minDate.setDate(this.minDate.getDate() + 1);
    this.appointmentForm = this.fb.group({
      provider_id: [null, Validators.required], // Changed to provider_id
      patient_id: [null, Validators.required], // Changed to patient_id
      reason: ['', [Validators.required, Validators.minLength(3)]],
      appointment_date: [null, Validators.required],
      appointment_time: [null, Validators.required],
      status: ['pending', Validators.required]
    });
    this.loadProviders();
    this.loadPatients();

    if (this.appointment) {
      this.isEditMode = true;
      this.selectedAppointment = this.appointment;
      this.appointmentForm.patchValue({
        provider_id: this.appointment.provider_id,
        patient_id: this.appointment.patient_id,
        reason: this.appointment.reason,
        appointment_date: new Date(this.appointment.appointment_date),
        appointment_time: this.timeSlots.find(slot => slot.slot === this.appointment.appointment_time),
        status: this.appointment.status,
      });
    }

  }
loadProviders(search: string = '') {
    this.appointmentService.getProviders(search, this.providerPage, this.limit).subscribe({
      next: (response) => {
        this.providers = this.providerPage === 1 ? response.providers : [...this.providers, ...response.providers];
        this.providerTotalRecords = response.pagination.totalRecords;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load providers',
        });
      },
    });
  }

  loadPatients(search: string = '') {
    this.appointmentService.getPatients(search, this.patientPage, this.limit).subscribe({
      next: (response) => {
        this.patients = this.patientPage === 1 ? response.patients : [...this.patients, ...response.patients];
        this.patientTotalRecords = response.pagination.totalRecords;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load patients',
        });
      },
    });
  }
  onProviderScroll(event: any) {
    if (this.providers.length < this.providerTotalRecords) {
      this.providerPage++;
      this.loadProviders(event.filter);
    }
  }

  onPatientScroll(event: any) {
    if (this.patients.length < this.patientTotalRecords) {
      this.patientPage++;
      this.loadPatients(event.filter);
    }
  }

  onProviderFilter(event: any) {
    this.providerPage = 1;
    this.loadProviders(event.filter);
  }

  onPatientFilter(event: any) {
    this.patientPage = 1;
    this.loadPatients(event.filter);
  }
  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields.',
      });
      return;
    }

    const formValue = this.appointmentForm.value;
    const appointmentData = {
      provider_id: formValue.provider_id._id,
      patient_id: formValue.patient_id._id,
      reason: formValue.reason,
      appointment_date: formValue.appointment_date instanceof Date
        ? formValue.appointment_date.toISOString().split('T')[0]
        : formValue.appointment_date,
      appointment_time: formValue.appointment_time.slot,
      status: formValue.status,
    };
 
    this.confirmationService.confirm({
      message: 'Please confirm to proceed',
      header: this.isEditMode ? 'Confirm Update' : 'Confirm Registration',
      icon: 'pi pi-exclamation-circle',
      acceptButtonProps: { label: 'Confirm', severity: 'primary' },
      rejectButtonProps: { label: 'Cancel', severity: 'contrast', outlined: true },
      accept: () => {
        console.log(appointmentData);
        const action = this.isEditMode
          ? this.appointmentService.updateAppointment(this.selectedAppointment._id, appointmentData)
          : this.appointmentService.createAppointment(appointmentData);

        action.subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.isEditMode ? 'Appointment updated successfully!' : 'Appointment created successfully!',
              life: 2000,
            });

            if (!this.isEditMode) {
              this.appointmentForm.reset();
            this.isEditMode = false;
            this.selectedAppointment = null;
            }
           
            
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || (this.isEditMode ? 'Failed to update appointment' : 'Failed to create appointment'),
              life: 2000,
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: this.isEditMode ? 'Update cancelled' : 'Appointment Booking cancelled',
          life: 2000,
        });
      },
    });
  }
}


 

