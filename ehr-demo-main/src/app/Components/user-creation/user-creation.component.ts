import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { User } from '../../models/user.model';
import { FormComponent } from '../form/form.component';
//import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
 
//import { ToggleSwitch } from 'primeng/toggleswitch';
 
@Component({
  selector: 'app-user-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterModule,ToastModule,
FormComponent
  ],
  templateUrl: './user-creation.component.html',
  styleUrls: ['./user-creation.component.scss'],
  providers: [MessageService],
})
export class UserCreationComponent {
 

}