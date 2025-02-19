import { User } from './../../models/user.model';
import { UserService } from './../../services/user/user.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { UserCreationComponent } from '../user-creation/user-creation.component';
import { FormComponent } from '../form/form.component';

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
    FormComponent
  ],
  providers: [ConfirmationService, MessageService]
,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit{




  customers: any[] = [];
  loading: boolean = true;
  selectedCustomer: any = null; // Store the customer that is being edited
  visible: boolean = false; // Control the dialog visibility
 
  // Define a reference to the p-table
  @ViewChild('dt1') dt1!: Table;

  constructor(private confirmationService: ConfirmationService, 
    private UserService :UserService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef) {}
 
  ngOnInit() {
    
    this.fecthAllUsers();

    this.loading = false;
  }
  receiveData(data: boolean) {
    this.visible=data;
   this.cdr.detectChanges();
   if (!data) { // If data is false, meaning the form was submitted or canceled
    this.fecthAllUsers(); // Refresh the list of users
  }
  }
  fecthAllUsers(){
    this.UserService.getAllUsers().subscribe({
      next: (res) => {
       
        this.customers=res;
       console.log("data fetchwed ")

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

  clear(table: Table) {
    table.clear();
    this.messageService.add({ severity: 'info', summary: 'Clear', detail: 'Filters are removed', life: 2000 });
  }

  onEdit(customer: any) {
    // Set the selected customer and show the dialog
    this.selectedCustomer = { ...customer }; // Ensure you don't directly modify the original object
    console.log("in pag comp"+ this.selectedCustomer )
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
                //  const index = this.customers.findIndex(c => c.id === this.selectedCustomer.id);
                  
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
            message: `Do you want to delete ${customer.first_name}?`,
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
              this.UserService.deleteUser(customer._id).subscribe({
                next: (res) => {
                  this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: `${customer.first_name} deleted succesfully` });
                  console.log("user deleted")
                  this.fecthAllUsers();
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
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            },
        });
    }

}
