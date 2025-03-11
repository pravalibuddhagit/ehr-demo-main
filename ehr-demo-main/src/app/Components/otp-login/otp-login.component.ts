import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { InputOtp } from 'primeng/inputotp';


@Component({
  selector: 'app-otp-login',
  imports: [FormsModule, CommonModule, RouterModule,InputOtp],
  standalone: true,
  templateUrl: './otp-login.component.html',
  styleUrl: './otp-login.component.scss'
})
export class OtpLoginComponent {
  email: string = '';
  otp: string = '';
  isOtpSent: boolean = false;
  message: string = '';
  error: string = '';
  loading: boolean = false;  // ✅ Loading state

  constructor(private authService: AuthService, private router: Router) {}

  sendOTP() {
    this.loading = true;  // Start spinner
    this.authService.sendOTP(this.email).subscribe({
      next: (res) => {
        this.isOtpSent = true;
        this.message = 'OTP sent successfully!';
        this.error = '';
        this.loading = false; // Stop spinner
      },
      error: (err) => {
        this.error = err.error?.error || 'Something went wrong!';
        this.message = '';
        this.loading = false; // Stop spinner
      }
    });
  }

  verifyOTP() {
    this.loading = true; // Start spinner
    this.authService.verifyOTP(this.email, this.otp).subscribe({
      next: (res) => {
        this.message = 'OTP verified successfully! Redirecting...';
        this.error = '';
        this.authService.setToken(res.token);
        setTimeout(() => {
          this.router.navigate(['/welcome']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Invalid OTP!';
        this.message = '';
        this.loading = false; // Stop spinner
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);  // ✅ Navigate back to login page
  }

  editEmail() {
    this.isOtpSent = false;  // ✅ Allow user to edit email
    this.email = '';
    this.message = '';
    this.error = '';
  }
}
