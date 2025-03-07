import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  styleUrls: ['./forgot-password.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string = '';
  error: string = '';
  isLoading: boolean = false; // Loading state

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading = true; // Show loader

    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: (res) => {
        this.isLoading = false; // Hide loader
        this.message = 'Password reset link sent to your email!';
        this.error = '';

        // Hide the message after 3 seconds
        setTimeout(() => {
          this.message = '';
        }, 5000);
      },
      error: (err) => {
        setTimeout(() => {
        this.isLoading = false; // Hide loader
        this.error = err.error?.error?.message || 'Something went wrong!';
        this.message = '';

        // Hide the error message after 3 seconds
        setTimeout(() => {
          this.error = '';
        }, 5000);
      }, 1500);
    }
  });
}
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
