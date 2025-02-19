
import { AuthService } from '../../services/auth/auth.service';
import { LoginComponent } from './../login/login.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterLink,RouterModule,ButtonModule, InputTextModule, ToastModule,
    
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [MessageService],
})
export class RegistrationComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private AuthService: AuthService
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(35), Validators.pattern(/^[A-Za-z\s]+$/)]],
      last_name: ['', [Validators.required, Validators.maxLength(35), Validators.pattern(/^[A-Za-z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
         Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/),
        ],
      ],
      confirm_password: ['', [Validators.required]],
      agreeTerms: [false, [Validators.requiredTrue]],  // Adding the checkbox validation here
    },
    { validators: this.passwordMatchValidator }
  );
  }
  passwordMatchValidator(control: FormGroup): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirm_password')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all fields correctly.',
      });
      return;
    }


    console.log(this.registerForm.value)
    this.AuthService.register(this.registerForm.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration successful! Redirecting to login...',
        });
    
        setTimeout(() => {
          this.router.navigate(['/login']);
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
   /* // Simulate email uniqueness check (replace with actual API call)
    const isEmailUnique = this.checkEmailUniqueness(this.registerForm.value.email);
    if (!isEmailUnique) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email is already registered.',
      });
      return;
    }

    // Simulate registration success (replace with actual API call)
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Registration successful! Redirecting to login...',
    });

    // Redirect to login after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  // Simulate email uniqueness check (replace with actual API call)
  checkEmailUniqueness(email: string): boolean {
    // Replace this with an actual API call to check if the email is unique
    const registeredEmails = ['test@example.com', 'user@example.com'];
    return !registeredEmails.includes(email);*/
  }
}