import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  message: string = '';
  error: string = '';
  isLoading: boolean = false; // Loading state

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$_!%*?&])[A-Za-z\d@_$!%*?&]{3,8}$/)
        ]
      ]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  // submit() {
  //   if (this.resetPasswordForm.invalid) return;

  //   this.isLoading = true; // Show loader

  //   this.authService.resetPassword(this.token, this.resetPasswordForm.value).subscribe({
  //     next: (res) => {
  //       this.isLoading = true; // Hide loader
  //       this.message = 'Password has been reset successfully!';
  //       this.error = '';

  //       // Redirect after 3 seconds
  //       setTimeout(() => this.router.navigate(['/login']), 4000);
  //     },
  //     error: (err) => {
  //       this.isLoading = false; // Hide loader
  //       this.error = err.error?.error?.message || 'Something went wrong!';
  //       this.message = '';

  //       // Hide error message after 3 seconds
  //       setTimeout(() => {
  //         this.error = '';
  //       }, 3000);
  //     }
  //   });
  // }

  submit() {
    if (this.resetPasswordForm.invalid) return;
  
    this.isLoading = true; // Show loader
  
    this.authService.resetPassword(this.token, this.resetPasswordForm.value).subscribe({
      next: (res) => {
        this.isLoading = true; // Hide loader
        this.message = 'Password has been reset successfully!';
        this.error = '';
  
        // Redirect after 3 seconds
        setTimeout(() => this.router.navigate(['/login']), 4000);
      },
      error: (err) => {
        // Show loading spinner for a brief moment before displaying the error message
        setTimeout(() => {
          this.isLoading = false; // Hide loader
          this.error = err.error?.error?.message || 'Something went wrong!';
          this.message = '';
  
          // Hide error message after 3 seconds
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }, 1500); // Delay before showing error
      }
    });
  }
  
}
