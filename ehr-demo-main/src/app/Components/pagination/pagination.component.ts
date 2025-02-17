import { Component, ViewChild } from '@angular/core';
// PrimeNG Modules
import { Table, TableModule } from 'primeng/table';
//import { ColumnFilterModule } from 'primeng/columnfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule, NgClass } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { Dialog, DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';

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
  //  NgClass,
    TableModule,
    SelectModule,
    DialogModule,
    AvatarModule,
    ButtonModule,
    ConfirmDialog, 
    ToastModule,

    CommonModule,
    FormsModule,
  ],
  providers: [ConfirmationService, MessageService]
,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  products = [
    {
      code: "f230fh0g3",
      name: "Bamboo Watch",
      category: "Accessories",
      quantity: 10
    },
    {
      code: "nvklal433",
      name: "Black Watch",
      category: "Accessories",
      quantity: 61
    },
    {
      code: "zz21cz3c1",
      name: "Blue Band",
      category: "Fitness",
      quantity: 1
    },
    {
      code: "244wgerg2",
      name: "Blue T-Shirt",
      category: "Clothing",
      quantity: 25
    },
    {
      code: "h456wer53",
      name: "Bracelet",
      category: "Accessories",
      quantity: 73
    },
  ]
  customers1 = [
    {
      name: "customers",
      country: "US",
      representative: "TEST",
      status: true
    }
  ];
  representatives = [{ label: "edvak", name: "edvak" }];



  customers: any[] = [];
  loading: boolean = true;
  selectedCustomer: any = null; // Store the customer that is being edited
  visible: boolean = false; // Control the dialog visibility

  // Define a reference to the p-table
  @ViewChild('dt1') dt1!: Table;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit() {
    // Dummy customer data
    this.customers = [{
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dob: '1990-05-15',
      gender: 'Male',
      email: 'john.doe@example.com',
      state: 'California',
      country: 'USA'
    },
    
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      dob: '1985-08-22',
      gender: 'Female',
      email: 'jane.smith@example.com',
      state: 'Texas',
      country: 'USA'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      dob: '1992-11-10',
      gender: 'Male',
      email: 'michael.johnson@example.com',
      state: 'New York',
      country: 'USA'
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Davis',
      dob: '1988-03-30',
      gender: 'Female',
      email: 'emily.davis@example.com',
      state: 'Florida',
      country: 'USA'
    },
    {
      id: 5,
      firstName: 'James',
      lastName: 'Williams',
      dob: '1995-07-17',
      gender: 'Male',
      email: 'james.williams@example.com',
      state: 'Nevada',
      country: 'USA'
    },
    {
      id: 6,
      firstName: 'Sophia',
      lastName: 'Martinez',
      dob: '1993-09-04',
      gender: 'Female',
      email: 'sophia.martinez@example.com',
      state: 'Arizona',
      country: 'USA'
    },
    {
      id: 7,
      firstName: 'Daniel',
      lastName: 'Garcia',
      dob: '1987-11-12',
      gender: 'Male',
      email: 'daniel.garcia@example.com',
      state: 'Washington',
      country: 'USA'
    },
    {
      id: 8,
      firstName: 'Olivia',
      lastName: 'Hernandez',
      dob: '1994-02-28',
      gender: 'Female',
      email: 'olivia.hernandez@example.com',
      state: 'Colorado',
      country: 'USA'
    },
    {
      id: 9,
      firstName: 'Liam',
      lastName: 'Lopez',
      dob: '1991-06-11',
      gender: 'Male',
      email: 'liam.lopez@example.com',
      state: 'Oregon',
      country: 'USA'
    },
    {
      id: 10,
      firstName: 'Isabella',
      lastName: 'Gonzalez',
      dob: '1989-04-25',
      gender: 'Female',
      email: 'isabella.gonzalez@example.com',
      state: 'Utah',
      country: 'USA'
    },
    {
      id: 11,
      firstName: 'Ethan',
      lastName: 'Miller',
      dob: '1990-07-20',
      gender: 'Male',
      email: 'ethan.miller@example.com',
      state: 'Idaho',
      country: 'USA'
    },
    {
      id: 12,
      firstName: 'Avery',
      lastName: 'Wilson',
      dob: '1986-01-09',
      gender: 'Female',
      email: 'avery.wilson@example.com',
      state: 'Michigan',
      country: 'USA'
    },
    {
      id: 13,
      firstName: 'Mason',
      lastName: 'Taylor',
      dob: '1994-10-16',
      gender: 'Male',
      email: 'mason.taylor@example.com',
      state: 'Ohio',
      country: 'USA'
    },
    {
      id: 14,
      firstName: 'Charlotte',
      lastName: 'Anderson',
      dob: '1992-12-05',
      gender: 'Female',
      email: 'charlotte.anderson@example.com',
      state: 'Illinois',
      country: 'USA'
    },
    {
      id: 15,
      firstName: 'Benjamin',
      lastName: 'Thomas',
      dob: '1993-04-14',
      gender: 'Male',
      email: 'benjamin.thomas@example.com',
      state: 'Virginia',
      country: 'USA'
    },
    {
      id: 16,
      firstName: 'Amelia',
      lastName: 'Jackson',
      dob: '1991-03-22',
      gender: 'Female',
      email: 'amelia.jackson@example.com',
      state: 'North Carolina',
      country: 'USA'
    },
    {
      id: 17,
      firstName: 'William',
      lastName: 'White',
      dob: '1988-07-30',
      gender: 'Male',
      email: 'william.white@example.com',
      state: 'Georgia',
      country: 'USA'
    },
    {
      id: 18,
      firstName: 'Mia',
      lastName: 'Clark',
      dob: '1996-02-18',
      gender: 'Female',
      email: 'mia.clark@example.com',
      state: 'Tennessee',
      country: 'USA'
    },
    {
      id: 19,
      firstName: 'Lucas',
      lastName: 'Rodriguez',
      dob: '1990-01-23',
      gender: 'Male',
      email: 'lucas.rodriguez@example.com',
      state: 'Minnesota',
      country: 'USA'
    },
    {
      id: 20,
      firstName: 'Harper',
      lastName: 'King',
      dob: '1993-05-12',
      gender: 'Female',
      email: 'harper.king@example.com',
      state: 'Kentucky',
      country: 'USA'
    }
    ];
    this.loading = false;
  }

  clear(table: Table) {
    table.clear();
    this.messageService.add({ severity: 'info', summary: 'Clear', detail: 'Filters are removed', life: 2000 });
  }

  onEdit(customer: any) {
    // Set the selected customer and show the dialog
    this.selectedCustomer = { ...customer }; // Ensure you don't directly modify the original object
    this.visible = true; // Show the dialog
  }

  onDelete(customer: any) {
    
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Perform global filter for the table
    if (this.dt1) {
      this.dt1.filterGlobal(value, 'contains');
    }
  }

  showDialog() {
    this.visible = true;
}

  saveCustomer() {
    
  }


    confirm1(event: Event) {

     
    
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Save',
            },
            accept: () => {
                this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Successfully Updated' });
                if (this.selectedCustomer) {
                  // Here, you can either update the customer data in the list or save to a backend.
                  console.log('Saving customer:', this.selectedCustomer);
                  // Find the customer in the list and update it with the modified details.
                  const index = this.customers.findIndex(c => c.id === this.selectedCustomer.id);
                  
                  this.visible = false; // Close the dialog
                }
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelled',
                    detail: 'Details are not Updated',
                    life: 3000,
                });
            },
        });
    }

    confirm2(event: Event,customer: any) {

       // Handle the delete logic
    console.log('Delete customer:', customer);
    // Implement confirmation and deletion logic
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            header: 'Alert',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
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
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            },
        });
    }

}
