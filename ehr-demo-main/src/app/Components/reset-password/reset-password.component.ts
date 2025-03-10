import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import zxcvbn from 'zxcvbn'; // Import password strength checker


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
  passwordStrengthText: string = '';
  passwordStrengthClass: string = 'bg-gray-300';
  passwordStrengthTextClass: string = 'text-gray-500';
  firstName: string = '';
  email: string = '';

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
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$_!%*?&])[A-Za-z\d@$_!%*?&]{3,8}$/)

        ]
      ]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.firstName = params['firstName'] || 'User';
      this.email = params['email'] || '';
    });  }

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
        this.isLoading = false; // Hide loader
        this.error = err.error?.error?.message || 'Something went wrong!';
        this.message = '';

        // Hide error message after 3 seconds
        setTimeout(() => {
          this.error = '';
        }, 3000);
      }
    });
  }


  checkPasswordStrength() {
    const password = this.resetPasswordForm.get('newPassword')?.value;
  
    if (!password) {
      this.passwordStrengthText = '';
      this.passwordStrengthClass = 'bg-gray-300';
      this.passwordStrengthTextClass = 'text-gray-500';
      return;
    }
  
    const result = zxcvbn(password);
    const strengthScore = result.score; // Score from 0 (weakest) to 4 (strongest)
  
    const strengthLevels = [
      { text: 'Very Weak', class: 'bg-red-500', textClass: 'text-red-500' },
      { text: 'Weak', class: 'bg-orange-400', textClass: 'text-orange-400' },
      { text: 'Medium', class: 'bg-yellow-400', textClass: 'text-yellow-400' },
      { text: 'Strong', class: 'bg-green-400', textClass: 'text-green-400' },
      { text: 'Very Strong', class: 'bg-green-600', textClass: 'text-green-600' }
    ];
  
    this.passwordStrengthText = strengthLevels[strengthScore].text;
    this.passwordStrengthClass = strengthLevels[strengthScore].class;
    this.passwordStrengthTextClass = strengthLevels[strengthScore].textClass;
  }
  

}
