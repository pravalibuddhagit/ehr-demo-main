

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [[CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, CheckboxModule, ToastModule],],  // Use CommonModule instead of BrowserModule
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent { }
