import { ChangeDetectorRef, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { Table, TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { NgClass } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ListboxModule } from 'primeng/listbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DrawerModule } from 'primeng/drawer';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { PatientService } from  './../../services/patient/patient.service'; // Import PatientService

@Component({
  selector: 'app-patient-pagination',
  imports: [ DropdownModule,ButtonModule, SelectButtonModule, RadioButtonModule, ListboxModule, FloatLabelModule,
     DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, 
     ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, TagModule,IconFieldModule, InputIconModule, DrawerModule, ConfirmDialog],
  templateUrl: './patient-pagination.component.html',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  styleUrl: './patient-pagination.component.scss'
})
export class PatientPaginationComponent {
 
  patients: any[] = []; // Initialize as empty array
  
constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router:Router,
    private patientService: PatientService
  ) {}
  
  
  
  ngOnInit(): void {
    this.loadPatients(); // Fetch patients on init
  }

onGlobalSearch(event: Event, dt: Table) {
    const inputElement = event.target as HTMLInputElement;
    dt.filterGlobal(inputElement.value, 'contains');
    this.loadPatients(1, inputElement.value); // Update list based on search
  }

// Load patients from API
loadPatients(page: number = 1, search: string = '') {
  this.patientService.getPatientsPag(page, search).subscribe({
    next: (response) => {
      this.patients = response.patients; // Update patients array
      this.cdr.detectChanges(); // Ensure UI updates
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


      
   
      confirm2(event: Event, patient: any) {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: `Do you want to delete ${patient.first_name}?`,
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
            this.patientService.deletePatient(patient._id).subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Confirmed',
                  detail: `${patient.first_name} deleted successfully`,
                });
                this.loadPatients(); // Refresh the list after deletion
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: error.message || 'Failed to delete patient',
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