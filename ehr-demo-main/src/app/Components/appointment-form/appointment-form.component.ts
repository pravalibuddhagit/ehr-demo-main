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
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
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

export class AppointmentFormComponent{

  @Input() appointment: any; 
  @Output() appointmentSaved = new EventEmitter<any>(); 
  isEditMode: boolean = false;
  selectedAppointment: any;
  
  selectedProvider: any; // or specify correct type
  selectedPatient: any;  // or specify correct type
  loading: boolean = false;
  appointmentForm!: FormGroup;
  providers: any[] = [];
  patients: any[] = [];
  //providerPage = 1;
  isBrowser = false;
  patientPage : number = 1;
  providerTotalRecords = 0;
  patientTotalRecords = 0;
  providerSearch: string = '';
  patientSearch: string = '';
  limit :number=10;
  lastLazyEvent: any; // Added proper declaration here
  providerPage: number = 1; // Starting from 0 like your friend's code
 // providerTotalRecords: number = 0;
 // limit: number = 10;
 // loading: boolean = false;
  //searchProvider: string = '';
  lastLazyLoadTime: number = 0;
  lastLazyLoadTimep: number = 0;
  debounceTimeout: any;
  allProvidersLoaded: boolean = false;
  allPatientsLoaded : boolean = false;  
  
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
 
  minDate: Date = new Date();
  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdRef: ChangeDetectorRef,
    private appointmentService: AppointmentService // Inject PatientService
  ) {
    this.minDate = new Date();
    this.isBrowser = isPlatformBrowser(platformId);
    this.appointmentForm = this.fb.group({
      provider_id: [null, Validators.required], // Changed to provider_id
      patient_id: [null, Validators.required], // Changed to patient_id
      reason: ['', [Validators.required, Validators.minLength(3)]],
      appointment_date: [null, Validators.required],
      appointment_time: [null, Validators.required],
      status: ['pending', Validators.required]
    });
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

    


     const appointmentDate = new Date(this.appointment.appointment_date);
    this.minDate = this.isEditMode ? appointmentDate : new Date();

    this.appointmentForm.patchValue({
      provider_id: providerr,
      patient_id: patientt,
      reason: this.appointment.reason,
      
      appointment_date: appointmentDate,
      appointment_time: this.timeSlots.find(slot => slot.slot === this.appointment.appointment_time),
      status: this.appointment.status
    });
    this.cdRef.detectChanges();
  }else {
    this.isEditMode = false;
    this.minDate = new Date(); 
    
    this.appointmentForm.reset(); // Reset form if editingUser is null or undefined
    this.selectedProvider = null;
      this.selectedPatient = null;
  }
}


loadProviders(search: string = this.providerSearch ,start: number, limit: number) {
  if (this.allProvidersLoaded) return;
  console.log('Loading providers:', { start, limit }); // Debug log
    this.loading = true;
  
   this.appointmentService.getProviders(search, start, limit).subscribe({
      next: (response) => {
        console.log('Response received:', response); // Debug log
        if (start === 1) {
          this.providers = response.providers;
        } else {
          this.providers = [...this.providers, ...response.providers];
        }
        this.providerTotalRecords = response.pagination.totalRecords;

        if (response.providers.length < limit) {
          this.allProvidersLoaded = true;
          console.log('All providers loaded');
        }
      
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
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.log('Error loading providers:', error); // Debug log
        this.loading = false;
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

  loadPatients(search: string = this.patientSearch ,start: number, limit: number) {
  
    if (this.allPatientsLoaded) return;

    console.log('Loading patients:', { start, limit }); // Debug log
    this.loading = true;

         
        
  this.appointmentService.getPatients(search, start, limit).subscribe({
      next: (response) => {
        console.log('Response received:', response); // Debug log
        if (start === 1) {
          this.patients = response.patients;
        } else {
          this.patients = [...this.patients, ...response.patients];
        }
        this.patientTotalRecords = response.pagination.totalRecords;

        if (response.patients.length < limit) {
          this.allPatientsLoaded = true;
          console.log('All patients loaded');
        }
        
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


  onPatientScroll(event: any) {
    const now = Date.now();
    if (now - this.lastLazyLoadTimep < 500) { // Debounce
      return;
    }

   // console.log('Lazy load event triggeredssss in patient:', event); // Debug log
    
    
     
      this.lastLazyLoadTimep = now;
      const newStart = this.patientPage++;
      this.loadPatients(this.patientSearch,newStart, 10);
  }

  onProviderFilter(event: any) {
    this.lastLazyLoadTime = Date.now();
    this.providerSearch = event.filter || '';
    
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.providers = [];
      this.providerPage = 1;
      this.allProvidersLoaded = false;
      this.loadProviders(this.providerSearch,1, this.limit);
    }, 300);
  }

  onPatientFilter(event: any) {
    this.lastLazyLoadTimep = Date.now();
    this.patientSearch = event.filter || '';
    
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.patients = [];
      this.patientPage = 1;
      this.allPatientsLoaded = false;
      this.loadPatients(this.patientSearch,1, this.limit);
    }, 300);
  }
  onProviderScroll(event: any) {
    const now = Date.now();
    if (now - this.lastLazyLoadTime < 500) { // Debounce
      return;
    }

    //console.log('Lazy load event triggeredssss:', event); // Debug log
    
    
     
      this.lastLazyLoadTime = now;
      const newStart = this.providerPage++;
      this.loadProviders(this.providerSearch,newStart, 10);
    
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
   console.log("date value",formValue.appointment_date)
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
