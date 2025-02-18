import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
//import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
 
//import { ToggleSwitch } from 'primeng/toggleswitch';
 
@Component({
  selector: 'app-user-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterModule,ToastModule],
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss'],
  providers: [MessageService],
})
export class UserCreationComponent implements OnInit{
  maxDate: string = new Date().toISOString().split('T')[0];
  userForm: FormGroup;
  checked: boolean = true;
 
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
  private UserService:UserService

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
  ngOnInit(): void {
    // Watch for changes in notification toggle
    this.userForm.get('allowNotifications')?.valueChanges.subscribe(value => {
      console.log('Notifications Toggled:', value);
    });
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
    
    this.UserService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User Creation successful! Redirecting to Dashboard...',
        });
    
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
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