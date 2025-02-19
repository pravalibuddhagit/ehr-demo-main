import { ButtonModule } from 'primeng/button';
import { UserService } from './../../services/user/user.service';
import { Component, Input, OnChanges,SimpleChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { User } from '../../models/user.model';
//import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventEmitter } from '@angular/core';
//import { ToggleSwitch } from 'primeng/toggleswitch';
import { ConfirmDialog } from 'primeng/confirmdialog';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterModule,ToastModule,ConfirmDialog,ButtonModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [ConfirmationService,MessageService],
})
export class FormComponent implements OnInit,OnChanges{
  @Input() editingUser: any | null = null;
  @Output() dataEvent = new EventEmitter<boolean>();
  maxDate: string = new Date().toISOString().split('T')[0];
  userForm: FormGroup;
  checked: boolean = true;
  isEditMode: boolean = false;
  visible: boolean = false; // Control the dialog visibility
 
  // ✅ List of countries
  countries = [
    "United States", "Canada", "United Kingdom", "India", "China", "Russia", "Germany",
    "France", "Australia", "Japan", "Brazil", "South Africa", "Mexico", "Spain", "Italy",
    "Netherlands", "Sweden", "Switzerland", "South Korea", "Singapore", "Argentina"
  ];
 
 // constructor(private fb: FormBuilder)
 constructor(private fb: FormBuilder,
  private messageService: MessageService,
  private router: Router,
  private UserService:UserService,
 private confirmationService:ConfirmationService
 
) {
// Initialize the form with validation
this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobile_phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address_line_1: ['', [Validators.required, Validators.maxLength(40)]],
      address_line_2: ['', [Validators.maxLength(40)]],
      city: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      state: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      zipcode: ['', [Validators.required, Validators.pattern(/^\d{5}(\d{4})?$/)]],

      country: ['United States', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue],
      allowNotifications: [false],
      notes: ['', [Validators.maxLength(200)]] // ✅ Notes field (optional, max 200 characters)
});

 
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
            this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Successfully Updated',  life: 1000 });
            if (this.editingUser) {
              
              // Here, you can either update the customer data in the list or save to a backend.
              console.log('Saving customer:', this.editingUser);
              // Find the customer in the list and update it with the modified details.
              //const index = this.customers.findIndex(c => c.id === this.selectedCustomer.id);
              
             
              console.log(this.visible);
              this.dataEvent.emit(false);
              
            }
        },
        reject: () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Cancelled',
                detail: 'Details are not Updated',
                life: 1000,
            });
         
        },
    });
  }
 
  ngOnInit(): void {
    // console.log("herere in form compo")
    // console.log(this.editingUser)
    
    // if (this.editingUser) {
    //   console.log(this.editingUser)
    //   console.log("herere")
    //   this.isEditMode = true;

    //   this.userForm.patchValue(this.editingUser);
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingUser'] && this.editingUser) {
      this.isEditMode = true;
      this.userForm.patchValue(this.editingUser);
    }else {
      this.isEditMode = false;
      this.userForm.reset(); // Reset form if editingUser is null or undefined
    }
  }

  // Form submission method
  onSubmit(): void {
    
    if (this.userForm.invalid) {
        console.log(this.userForm)
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all fields correctly.',
      });
      return;
    }
    
    
    console.log(this.userForm.value)
    if (this.isEditMode && this.editingUser) {

    
    
      // this.UserService.updateUser(this.editingUser._id, this.userForm.value).subscribe({
      //   // Handle update
        //dialog box close
      alert("updated user");
      // });
    } else {

      this.UserService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User Creation successful! Redirecting to Dashboard...',
          });
      
          setTimeout(() => {
            this.router.navigate(['/welcome/dashboard']);
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
   









    // Simulate email uniqueness check (replace with actual API call)
  /*  const isEmailUnique = this.checkEmailUniqueness(this.userForm.value.email);
    if (!isEmailUnique) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email is already registered.',
      });
      return;
    }

    const registrationSuccess = true; // Replace this with actual condition based on your API response

    if (registrationSuccess) {
      // Show success message
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'User creation successful! Redirecting to Dashboard...',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      // Show error message
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User creation failed. Please try again.',
      });
    }
  }

  // Simulate email uniqueness check (replace with actual API call)
  checkEmailUniqueness(email: string): boolean {
    // Replace this with an actual API call to check if the email is unique
    const registeredEmails = ['test@example.com', 'user@example.com'];
    return !registeredEmails.includes(email);
  }*/
  }

}