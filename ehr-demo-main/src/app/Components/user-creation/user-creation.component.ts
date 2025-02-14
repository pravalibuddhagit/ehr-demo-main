import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-user-creation',
  imports: [
    FormsModule,
    CommonModule, // Only if using in a feature module
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,

  ],
  templateUrl: './user-creation.component.html',
  styleUrl: './user-creation.component.scss'
})
export class UserCreationComponent {
  ingredient: any = '';
  value = "";
}
