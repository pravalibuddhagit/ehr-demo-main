import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone:true,
  imports:[CommonModule,FormsModule,ReactiveFormsModule,RouterModule]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  message: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  submit() {
    if (this.resetPasswordForm.invalid) return;

    this.authService.resetPassword(this.token, this.resetPasswordForm.value).subscribe({
      next: (res) => {
        this.message = 'Password has been reset successfully!';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.error = err.error?.error?.message || 'Something went wrong!';
      }
    });
  }
}
