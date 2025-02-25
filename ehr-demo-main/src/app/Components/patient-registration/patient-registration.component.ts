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
import { CommonModule } from '@angular/common';
import { InputMask } from 'primeng/inputmask';
import {  ConfirmationService, MessageService } from 'primeng/api';
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
    CalendarModule, 
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
  patientForm: FormGroup = new FormGroup({  // ✅ Ensure patientForm is declared
    first_name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z\s]*$')]),
    last_name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mobile_phone: new FormControl('', [Validators.required,Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]),
    dob: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    address_line_1: new FormControl('')
  });
 
  constructor(private router: Router, private messageService: MessageService,private confirmationService: ConfirmationService
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

    // Confirmation Dialog
    this.confirmationService.confirm({
      message: 'Are you sure you want to register this patient?',
      header: 'Confirm Registration',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Success toast message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Patient registered successfully!',
        });

        // Reset form after successful submission
        this.patientForm.reset();
      }
    });
  }}