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
  patients: any[] = [
    {
      first_name: 'John',
      last_name: 'Doe',
      dob: '1990-05-14',
      gender: 'Male',
      email: 'john.doe@example.com',
      mobile_phone: '(123) 456-7890',
      Address: 'California',
      status: 'completed'
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      dob: '1985-08-22',
      gender: 'Female',
      email: 'jane.smith@example.com',
      mobile_phone: '(098) 765-4321',
      Address: 'Texas',
      status: 'pending'
    },
    {
      first_name: 'Alice',
      last_name: 'Johnson',
      dob: '1992-11-30',
      gender: 'Female',
      email: 'alice.johnson@example.com',
      mobile_phone: '(112) 233-4455',
      Address: 'New York',
      status: 'rejected'
    },
    {
      first_name: 'Bob',
      last_name: 'Brown',
      dob: '1988-02-19',
      gender: 'Male',
      email: 'bob.brown@example.com',
      mobile_phone: '(556) 677-8899',
      Address: 'Florida',
      status: 'completed'
    },
    {
      first_name: 'Michael',
      last_name: 'Williams',
      dob: '1995-06-10',
      gender: 'Male',
      email: 'michael.williams@example.com',
      mobile_phone: '(234) 567-8901',
      Address: 'Nevada',
      status: 'pending'
    },
    {
      first_name: 'Emily',
      last_name: 'Davis',
      dob: '1987-09-25',
      gender: 'Female',
      email: 'emily.davis@example.com',
      mobile_phone: '(678) 901-2345',
      Address: 'Arizona',
      status: 'completed'
    },
    {
      first_name: 'Daniel',
      last_name: 'Martinez',
      dob: '1993-12-17',
      gender: 'Male',
      email: 'daniel.martinez@example.com',
      mobile_phone: '(789) 012-3456',
      Address: 'Illinois',
      status: 'rejected'
    },
    {
      first_name: 'Olivia',
      last_name: 'Garcia',
      dob: '1991-04-07',
      gender: 'Female',
      email: 'olivia.garcia@example.com',
      mobile_phone: '(890) 123-4567',
      Address: 'Washington',
      status: 'pending'
    },
    {
      first_name: 'Ethan',
      last_name: 'Rodriguez',
      dob: '1989-07-29',
      gender: 'Male',
      email: 'ethan.rodriguez@example.com',
      mobile_phone: '(901) 234-5678',
      Address: 'Colorado',
      status: 'completed'
    },
    {
      first_name: 'Sophia',
      last_name: 'Lee',
      dob: '1996-03-11',
      gender: 'Female',
      email: 'sophia.lee@example.com',
      mobile_phone: '(012) 345-6789',
      Address: 'Oregon',
      status: 'pending'
    }
  ];
  
constructor(
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private router:Router
  ) {}
  selectedStatus: string | null = null;
  statusOptions = [
    { label: 'All', value: null },
    { label: 'Completed', value: 'completed' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Pending', value: 'pending' } // Ensure all values are lowercase
  ];
  
  
  
  ngOnInit(): void {}

  onGlobalSearch(event: Event, dt: Table) {const inputElement = event.target as HTMLInputElement; // Cast to HTMLInputElement
      dt.filterGlobal(inputElement.value, 'contains');}

      onStatusFilterChange(event: any, table: Table): void {
        console.log('Selected Status:', this.selectedStatus); // Debugging
        if (!this.selectedStatus) {
          table.filter('', 'status', 'equals'); // Reset filter to show all records
        } else {
          table.filter(this.selectedStatus.toLowerCase(), 'status', 'equals'); // Ensure lowercase matching
        }
      }
      


      getSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
        switch (status.toLowerCase()) { // Ensure lowercase for consistency
          case 'completed':
            return 'success';
          case 'pending':
            return 'warn';  // Use 'warn' instead of 'warning' (PrimeNG uses 'warn')
          case 'rejected':
            return 'danger';
          default:
            return 'info';
        }
            
            
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