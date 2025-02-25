import { User } from './../../models/user.model';
import { UserService } from './../../services/user/user.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FilterMatchMode,FilterMetadata } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FormComponent } from '../form/form.component';
import { Router,RouterModule } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [
    DropdownModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    PaginatorModule,
    TagModule,
    MultiSelectModule,
    TableModule,
    SelectModule,
    DialogModule,
    AvatarModule,
    ButtonModule,
    ConfirmDialog,
    ToastModule,
    CommonModule,
    FormsModule,
    FormComponent,
    

  
   
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent  {
  customers: any[] = [];
  loading: boolean = false;
  selectedCustomer: any = null;
  visible: boolean = false;
  
  // Pagination variables
  currentPage: number = 1;
  totalRecords: number = 0;
  rowsPerPage: number = 10;
  
  // Search and filter variables
  searchTerm: string = '';

  stateFilter: string = '';
  stateMatchMode: string = FilterMatchMode.CONTAINS; // Default

  countryFilter: string = '';
  countryMatchMode: string = FilterMatchMode.CONTAINS; // Default
  
  @ViewChild('dt1') dt1!: Table;

  constructor(
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router:Router
  ) {}

  // ngOnInit() {
  //   console.log('ngOnInit called');
  //   this.loadUsers();
  // }

  loadUsers() {
    //this.loading = true;
    console.log('loadUsers called with:', {
      currentPage: this.currentPage,
      searchTerm: this.searchTerm,
      stateFilter: this.stateFilter,
      stateMatchMode: this.stateMatchMode,
      countryFilter: this.countryFilter,
      countryMatchMode: this.countryMatchMode
    });
    this.userService.getAllUsers2(
      this.currentPage,
      this.searchTerm,
      this.stateFilter,
      this.stateMatchMode,
      this.countryFilter,
      this.countryMatchMode
    ).subscribe({
      next: (response) => {
        this.customers = response.users;
        this.totalRecords = response.pagination.totalRecords;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        if(error.message==="Invalid token"){
          this.messageService.add({
            severity: 'warn',
            summary: 'Timeout',
            detail:'Session has expired, Login again !',
          });
          setTimeout(() => {
            this.router.navigate(['/login']); // Navigate after confirmation
          }, 2000);
        }
        else{this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      }
      }
    });
  }

  receiveData(data: boolean) {
    this.visible = data;
    this.cdr.detectChanges();
    if (!data) {
      this.loadUsers();
    }
  }

  onPageChange(event: any) {
    console.log('onPageChange called:', event);
    console.log('Filters from event:', event.filters);

    // Calculate current page from first and rows
    this.currentPage = event.first / event.rows + 1;
    this.rowsPerPage = event.rows;
// Extract filter values and match modes from event.filters
const stateFilterObj = event.filters?.state as FilterMetadata | undefined;
const countryFilterObj = event.filters?.country as FilterMetadata | undefined;

this.stateFilter = stateFilterObj?.value || '';
this.stateMatchMode = stateFilterObj?.matchMode || FilterMatchMode.CONTAINS;
this.countryFilter = countryFilterObj?.value || '';
this.countryMatchMode = countryFilterObj?.matchMode || FilterMatchMode.CONTAINS;

console.log('State filter:', { value: this.stateFilter, matchMode: this.stateMatchMode });
console.log('Country filter:', { value: this.countryFilter, matchMode: this.countryMatchMode });

    this.loadUsers();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('onSearch called, value:', input.value);
    this.searchTerm = input.value;
    this.currentPage = 1;
    this.loadUsers();
  }

  


  onEdit(customer: any) {
   
    this.selectedCustomer = { ...customer };
    console.log(this.selectedCustomer)
    this.visible = true;
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
            this.loadUsers();
          },
          error: (error) => {
            
            this.messageService.add({
              severity: 'warn',
              summary: 'Error',
              detail: error.message,
            });
          }
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected'
        });
      },
    });
  }


}