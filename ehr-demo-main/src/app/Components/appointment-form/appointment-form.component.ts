import { Component } from '@angular/core';
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
    RouterModule         // Required for buttons
  ]
})
export class AppointmentFormComponent {
  appointmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    // Initialize form with controls & validators
    this.appointmentForm = this.fb.group({
      doctor_name: ['', Validators.required],
      patient_name: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(3)]],
      appointment_datetime: [null, Validators.required] // Ensure correct handling of date-time input
    });
  }

  // Confirm before submitting the form
  confirmSubmit() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to submit this appointment?',
      header: 'Confirm Submission',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onSubmit();
      }
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.appointmentForm.valid) {
      console.log('Form Submitted', this.appointmentForm.value);

      // Success message
      this.messageService.add({
        severity: 'success',
        summary: 'Appointment Created',
        detail: 'Your appointment has been successfully scheduled!'
      });

      // Reset form after submission
      this.appointmentForm.reset();
    } else {
      // Error message
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields.'
      });
    }
  }
}
