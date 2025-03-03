import { Component, Input, ChangeDetectorRef, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
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
})

export class AppointmentFormComponent implements OnInit{

  @Input() appointment: any; 
  @Output() appointmentSaved = new EventEmitter<any>(); 
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
  providerSearch: string = '';
  patientSearch: string = '';
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
  ) {
    this.minDate.setDate(this.minDate.getDate() + 1);
    this.appointmentForm = this.fb.group({
      provider_id: [null, Validators.required], // Changed to provider_id
      patient_id: [null, Validators.required], // Changed to patient_id
      reason: ['', [Validators.required, Validators.minLength(3)]],
      appointment_date: [null, Validators.required],
      appointment_time: [null, Validators.required],
      status: ['pending', Validators.required]
    });
  }

  minDate: Date = new Date();

  ngOnInit() {
   
    this.loadProviders();
    this.loadPatients();
   
    // if (this.appointment) {
    //   this.isEditMode = true;
    //   this.patchAppointmentData();
    // }
  
}


ngOnChanges(changes: SimpleChanges) {
 
  if (changes['appointment'] && this.appointment) {
  
  //  console.log(this.appointment)
    this.isEditMode = true;
    const providerr =  {    
      email: this.appointment.provider.email,
      name: this.appointment.provider.first_name + ' ' + this.appointment.provider.last_name,
      _id: this.appointment.provider_id
    };
    const patientt ={
      email: this.appointment.patient.email,
      name: this.appointment.patient.first_name + ' ' + this.appointment.patient.last_name,
     
      _id: this.appointment.patient_id
    };
  // Ensure selected provider and patient are in the dropdown options
  if (!this.providers.some(p => p._id === providerr._id)) {
    this.providers.unshift(providerr); // Add if not already present
  }
  if (!this.patients.some(p => p._id === patientt._id)) {
    this.patients.unshift(patientt); // Add if not already present
  }
    this.selectedProvider = providerr;
    this.selectedPatient = patientt;

    this.appointmentForm.patchValue({
      provider_id: providerr,
      patient_id: patientt,
      reason: this.appointment.reason,
      appointment_date: new Date(this.appointment.appointment_date),
      appointment_time: this.timeSlots.find(slot => slot.slot === this.appointment.appointment_time),
      status: this.appointment.status
    });
    this.cdRef.detectChanges();
  }else {
    this.isEditMode = false;
    this.appointmentForm.reset(); // Reset form if editingUser is null or undefined
    this.selectedProvider = null;
      this.selectedPatient = null;
  }
}
  /*patchAppointmentData() {
    // Find the provider and patient objects from the loaded lists
    console.log(this.appointment)
    const providerr =  {    
      email: this.appointment.provider.email,
      name: this.appointment.provider.first_name + ' ' + this.appointment.provider.last_name,
      _id: this.appointment.provider_id
    };
    const patientt ={
      email: this.appointment.patient.email,
      name: this.appointment.patient.first_name + ' ' + this.appointment.patient.last_name,
     
      _id: this.appointment.patient_id
    };

    this.selectedProvider = providerr;
    this.selectedPatient = patientt;

    this.appointmentForm.patchValue({
      provider_id: providerr,
      patient_id: patientt,
      reason: this.appointment.reason,
      appointment_date: new Date(this.appointment.appointment_date),
      appointment_time: this.timeSlots.find(slot => slot.slot === this.appointment.appointment_time),
      status: this.appointment.status
    });
    console.log("here")
    console.log(this.appointmentForm.value)

   
  }*/

loadProviders(search: string = '') {
  this.providerSearch = search;
   this.appointmentService.getProviders(search, this.providerPage, this.limit).subscribe({
      next: (response) => {
        this.providers = this.providerPage === 1 ? response.providers : [...this.providers, ...response.providers];
        this.providerTotalRecords = response.pagination.totalRecords;
        if (this.isEditMode && this.selectedAppointment) {
          const providerr = {
            _id: this.selectedAppointment.provider_id,
            name: `${this.selectedAppointment.provider.first_name} ${this.selectedAppointment.provider.last_name}`,
            email: this.selectedAppointment.provider.email,
          };
          if (!this.providers.some(p => p._id === providerr._id)) {
            this.providers.unshift(providerr);
          }
          this.appointmentForm.patchValue({ provider_id: providerr._id });
        }
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load providers',
        });
      },
    });
   /*  this.appointmentService.getAllProviders(search).subscribe({
      next: (response) => {
        this.providers = this.providerPage === 1 ? response.providers : [...this.providers, ...response.providers];
        this.providerTotalRecords = response.pagination.totalRecords;
      //  if (this.appointment) this.patchAppointmentData(); // Patch after loading providers
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load providers',
        });
      },
    });*/
    
  }

  loadPatients(search: string = '') {
    this.patientSearch = search;
  this.appointmentService.getPatients(search, this.patientPage, this.limit).subscribe({
      next: (response) => {
        this.patients = response.patients
        this.patientTotalRecords = response.pagination.totalRecords;
        if (this.isEditMode && this.selectedAppointment) {
          const patientt = {
            _id: this.selectedAppointment.patient_id,
            name: `${this.selectedAppointment.patient.first_name} ${this.selectedAppointment.patient.last_name}`,
            email: this.selectedAppointment.patient.email,
          };
          if (!this.patients.some(p => p._id === patientt._id)) {
            this.patients.unshift(patientt);
          }
          this.appointmentForm.patchValue({ patient_id: patientt._id });
        }
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load patients',
        });
      },
    });
      /*this.appointmentService.getAllPatients(search).subscribe({
      next: (response) => {
        this.patients = response.patients
       // if (this.appointment) this.patchAppointmentData(); // Patch after loading patients
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load patients',
        });
      },
    });*/

    
  }
  onProviderScroll(event: any) {
    if (this.providers.length < this.providerTotalRecords) {
      this.providerPage++;
      this.loadProviders(this.providerSearch);
    }
  }

  onPatientScroll(event: any) {
    if (this.patients.length < this.patientTotalRecords) {
      this.patientPage++;
      this.loadPatients(this.patientSearch);
    }
  }

  onProviderFilter(event: any) {
    this.providerPage = 1;
    this.providers = [];
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
    console.log("FROM VALUEE")
   console.log(formValue)
    // Convert date to UTC format before sending to backend
  const selectedDate = formValue.appointment_date instanceof Date
  ? new Date(
      Date.UTC(
        formValue.appointment_date.getFullYear(),
        formValue.appointment_date.getMonth(),
        formValue.appointment_date.getDate()
      )
    ).toISOString()  // Convert to UTC format
  : formValue.appointment_date;

  console.log("SELECTED DATE")
  console.log(selectedDate)
    const appointmentData = {
      provider_id: typeof formValue.provider_id === 'string' ? formValue.provider_id : formValue.provider_id._id,
      patient_id: typeof formValue.patient_id === 'string' ? formValue.patient_id : formValue.patient_id._id,
      reason: formValue.reason,
      appointment_date: selectedDate,
      appointment_time: formValue.appointment_time.slot,
      status: formValue.status,
    };

    console.log("appouintment data")
    console.log(appointmentData)
 
    this.confirmationService.confirm({
      message: 'Please confirm to proceed',
      header: this.isEditMode ? 'Confirm Update' : 'Confirm Registration',
      icon: 'pi pi-exclamation-circle',
      acceptButtonProps: { label: 'Confirm', severity: 'primary' },
      rejectButtonProps: { label: 'Cancel', severity: 'contrast', outlined: true },
      accept: () => {
       // console.log(appointmentData);
        const action = this.isEditMode
          ? this.appointmentService.updateAppointment(this.appointment._id, appointmentData)
          : this.appointmentService.createAppointment(appointmentData);

        action.subscribe({
          next: (response) => {

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.isEditMode ? 'Appointment updated successfully!' : 'Appointment created successfully!Redirecting to Appointment-Views',
              life: 2000,
            });

            if(this.isEditMode){
            setTimeout(() => {
              this.appointmentSaved.emit(); // Emit the updated appointment
            }, 2000);
           
          }else{
            this.appointmentForm.reset();
            setTimeout(() => {
              this.router.navigate(['welcome/appointment-view']);
            }, 2000);
          }


         
           
            this.selectedAppointment = null;

           // this.router.navigate(['welcome/appointment-view'])
          
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
