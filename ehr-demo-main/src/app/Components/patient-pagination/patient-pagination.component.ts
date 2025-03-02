import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  loading: boolean = false;
  totalRecords: number = 0; // Add totalRecords
  currentPage: number = 1; // Add currentPage
  rowsPerPage: number = 10; // Default rows per page
  searchTerm: string = ''; // Add searchTerm

  @ViewChild('dt2') dt2!: Table;

  private searchSubject = new Subject<string>(); // ✅ Add Subject


constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router:Router,
    private patientService: PatientService
  ) {}
  
  ngOnInit() {
    this.loadPatients();

    // ✅ Debounce search input
    this.searchSubject.pipe(
      debounceTime(300),  // ✅ Wait for 500ms pause in typing
      distinctUntilChanged() // ✅ Only search if value changes
    ).subscribe((search) => {
      this.searchTerm = search;
      this.currentPage = 1;
      this.loadPatients();
    });
  }

  onGlobalSearch(event: Event, dt: Table) {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject.next(inputElement.value.trim().toLowerCase());
  }

// onGlobalSearch(event: Event, dt: Table) {

//     const inputElement = event.target as HTMLInputElement;
//     this.searchTerm = inputElement.value;
//     // dt.filterGlobal(inputElement.value, 'contains');
//     this.currentPage = 1; // Reset to page 1 on search
//     this.loadPatients();
//   }

// Load patients from API
loadPatients() {
 
  this.patientService.getPatientsPag(
    this.currentPage,
    this.rowsPerPage,
    this.searchTerm
    
  ).subscribe({
    next: (response) => {
      this.patients = response.patients; // Update patients array
      this.totalRecords=response.pagination.totalRecords;
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

onPageChange(event: any) {
  console.log('onPageChange called:', event);
  this.currentPage = event.first / event.rows + 1;
  this.rowsPerPage = event.rows;
  this.loadPatients();
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