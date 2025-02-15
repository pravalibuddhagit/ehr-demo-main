import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, ToastModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  // Dummy users for testing
  private dummyUsers = [
    { email: 'user1@example.com', password: 'Password123!' },
    { email: 'user2@example.com', password: 'Password456!' },
    { email: 'user3@example.com', password: 'Password789!' },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    // Check if "Remember Me" was checked previously
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail, rememberMe: true });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all fields correctly.',
      });
      return;
    }

    const email = this.loginForm.value.email.toLowerCase(); // Email is not case-sensitive
    const password = this.loginForm.value.password; // Password is case-sensitive
    const rememberMe = this.loginForm.value.rememberMe;

    // Save email to localStorage if "Remember Me" is checked
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Simulate API call for login (replace with actual API call)
    const user = this.dummyUsers.find(
      (u) => u.email.toLowerCase() === email && u.password === password
    );

    if (user) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successful! Redirecting...',
      });

      // Redirect to dashboard or home page after 2 seconds
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Incorrect email or password.',
      });
    }
  }
}