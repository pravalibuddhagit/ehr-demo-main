import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone:true,
  styleUrls: ['./forgot-password.component.css'],
  imports: [CommonModule,FormsModule,ReactiveFormsModule]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string = '';
  error: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    console.log('ForgotPasswordComponent Loaded');

  }

  submit() {
    if (this.forgotPasswordForm.invalid) return;

    this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
      next: (res) => {
        this.message = 'Password reset link sent to your email!';
        this.error = '';
      },
      error: (err) => {
        this.error = err.error?.error?.message || 'Something went wrong!';
        this.message = '';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']); // This ensures navigation works
  }
}
