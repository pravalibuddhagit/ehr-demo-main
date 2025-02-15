import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
//import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
 
//import { ToggleSwitch } from 'primeng/toggleswitch';
 
@Component({
  selector: 'app-user-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterModule],
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss']
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
 constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobile_phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address_line_1: ['', [Validators.required, Validators.maxLength(40)]],
      address_line_2: ['', [Validators.required, Validators.maxLength(40)]],
      city: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      state: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      zipcode: ['', [Validators.required, Validators.pattern(/^\d{6}$|^\d{9}$/)]],
      country: ['United States', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue],
      allowNotifications: [false],
      notes: ['', [Validators.maxLength(200)]] // ✅ Notes field (optional, max 200 characters)
});
 
 
  }
  ngOnInit() {
    this.userForm.get('notifications')?.valueChanges.subscribe(value => {
      console.log('Notifications Toggled:', value);
    });
  }
  onSubmit() {
    if (this.userForm.valid) {
      alert('User created');
    }
  }  
}
 