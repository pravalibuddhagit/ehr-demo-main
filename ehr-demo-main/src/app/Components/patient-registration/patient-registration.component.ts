import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';  // ✅ Import Router
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { CommonModule, formatDate } from '@angular/common';
import { InputMask } from 'primeng/inputmask';
import {  ConfirmationService, MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { PatientService } from  './../../services/patient/patient.service'; // Import PatientService
@Component({
  selector: 'app-patient-registration',
  standalone: true,
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss',
  imports: [
    FormsModule, 
    ReactiveFormsModule, // ✅ Ensure ReactiveFormsModule is imported
    ButtonModule, 
    InputTextModule, 
    ToastModule, 
    DatePickerModule, 
    RadioButtonModule, 
    SelectButtonModule, 
    DropdownModule,
    RouterModule,
    ConfirmDialog,
    CommonModule,
    InputMask
  ],
  providers: [MessageService,ConfirmationService],
})
export class PatientRegistrationComponent {
  maxDate = new Date();
  patientForm: FormGroup = new FormGroup({  // ✅ Ensure patientForm is declared
    first_name: new FormControl('', [Validators.required, Validators.pattern((/^(?=.*[A-Za-z])[A-Za-z\s]+$/))]),
    last_name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile_phone: new FormControl('', [Validators.required,Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]),
    dob: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    address_line_1: new FormControl('')
  });
 
  constructor(private router: Router,
     private messageService: MessageService,
     private confirmationService: ConfirmationService,
     private patientService: PatientService // Inject PatientService
  ) {} // ✅ Inject Router properly
 
  onSubmit(): void {
    
    if (this.patientForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all fields correctly.',
      });
      return;
    }
       const rawDate = this.patientForm.value.dob; // This is in YYYY-MM-DD format
        const formattedDOB = formatDate(rawDate, 'yyyy-MM-dd', 'en-US'); // Convert to DD-MM-YYYY
        this.patientForm.value.dob=formattedDOB;
      
        this.patientService.createPatient(this.patientForm.value).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Patient Creation successful!',
            });
        
            setTimeout(() => {
              this.router.navigate(['/welcome/patient-view']);
            }, 2000);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          }
        });
      }
}