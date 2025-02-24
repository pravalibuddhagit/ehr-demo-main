import { ButtonModule } from 'primeng/button';
import { UserService } from './../../services/user/user.service';
import { Component, Input, OnChanges,SimpleChanges, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { User } from '../../models/user.model';
//import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventEmitter } from '@angular/core';
//import { ToggleSwitch } from 'primeng/toggleswitch';
import { ConfirmDialog } from 'primeng/confirmdialog';
import {MessageModule} from 'primeng/message';
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterModule,ToastModule,ConfirmDialog,ButtonModule,MessageModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [ConfirmationService,MessageService],
})
export class FormComponent implements OnInit,OnChanges{
  @Input() editingUser: any | null = null;
  @Output() dataEvent = new EventEmitter<boolean>();
  maxDate: string = new Date().toISOString().split('T')[0];
  userForm: FormGroup;
  checked: boolean = true;
  isEditMode: boolean = false;
  visible: boolean = false; // Control the dialog visibility

  // ✅ List of countries
  countryList = [
    {
      name: 'United States',
      states: [
        { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'] },
        { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'] },
        { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee'] },
        { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'] },
        { name: 'Illinois', cities: ['Chicago', 'Springfield', 'Naperville', 'Peoria', 'Rockford'] }
      ]
    },
    {
      name: 'China',
      states: [
        { name: 'Beijing', cities: ['Beijing', 'Tongzhou', 'Haidian', 'Chaoyang', 'Fengtai'] },
        { name: 'Shanghai', cities: ['Shanghai', 'Pudong', 'Huangpu', 'Xuhui', 'Jingan'] },
        { name: 'Guangdong', cities: ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Zhuhai'] },
        { name: 'Sichuan', cities: ['Chengdu', 'Mianyang', 'Leshan', 'Deyang', 'Yibin'] },
        { name: 'Zhejiang', cities: ['Hangzhou', 'Ningbo', 'Wenzhou', 'Shaoxing', 'Jinhua'] }
      ]
    },
    {
      name: 'India',
      states: [
        { name: 'Andhra Pradesh', cities: ['Vizianagaram','  Vishakapatnam','Guntur','Krishna','Chittoor'] },
        { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'] },
        { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'] },
        { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'] },
        { name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad'] },
        { name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'] }
      ]
    },
    {
      name: 'Canada',
      states: [
        { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'] },
        { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Sherbrooke'] },
        { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Kelowna', 'Surrey', 'Burnaby'] },
        { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'] },
        { name: 'Manitoba', cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie'] }
      ]
    },
    {
      name: 'United Kingdom',
      states: [
        { name: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'] },
        { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'] },
        { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Bangor', 'Wrexham'] },
        { name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Armagh'] },
        { name: 'Cornwall', cities: ['Truro', 'Falmouth', 'Penzance', 'St Austell', 'Newquay'] }
      ]
    },
    {
      name: 'Germany',
      states: [
        { name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Würzburg'] },
        { name: 'Berlin', cities: ['Berlin', 'Charlottenburg', 'Friedrichshain', 'Kreuzberg', 'Prenzlauer Berg'] },
        { name: 'Hesse', cities: ['Frankfurt', 'Wiesbaden', 'Darmstadt', 'Offenbach', 'Kassel'] },
        { name: 'North Rhine-Westphalia', cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Bonn'] },
        { name: 'Saxony', cities: ['Dresden', 'Leipzig', 'Chemnitz', 'Zwickau', 'Görlitz'] }
      ]
    },
    {
      name: 'France',
      states: [
        { name: 'Île-de-France', cities: ['Paris', 'Versailles', 'Boulogne-Billancourt', 'Saint-Denis', 'Nanterre'] },
        { name: 'Provence-Alpes-Côte d\'Azur', cities: ['Marseille', 'Nice', 'Toulon', 'Avignon', 'Aix-en-Provence'] },
        { name: 'Nouvelle-Aquitaine', cities: ['Bordeaux', 'Limoges', 'Pau', 'Bayonne', 'Poitiers'] },
        { name: 'Auvergne-Rhône-Alpes', cities: ['Lyon', 'Grenoble', 'Saint-Étienne', 'Clermont-Ferrand', 'Annecy'] },
        { name: 'Occitanie', cities: ['Toulouse', 'Montpellier', 'Perpignan', 'Béziers', 'Nîmes'] }
      ]
    }
  ];
  stateList: any[] = [];
  cityList: any[] = [];
 // constructor(private fb: FormBuilder)
 constructor(private fb: FormBuilder,
  private messageService: MessageService,
  private router: Router,
  private UserService:UserService,
 private confirmationService:ConfirmationService
 
) {
// Initialize the form with validation
this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      mobile_phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address_line_1: ['', [Validators.required, Validators.maxLength(40)]],
      address_line_2: ['', [Validators.maxLength(40)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern(/^\d{5}(\d{4})?$/)]],

      country: ['United States', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue],
      allowNotifications: [false],
      notes: ['', [Validators.maxLength(200)]] // ✅ Notes field (optional, max 200 characters)
});

 
  }

  confirm1(event: Event) {

     
    
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure that you want to proceed?',
        header: 'Confirmation',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Save',
        },
        accept: () => {
           
          this.onSubmit();
        //  this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Successfully Updated',  life: 1000 });
            if (this.editingUser) {
              
              // Here, you can either update the customer data in the list or save to a backend.
            //  console.log('Saving customer:', this.editingUser);
              // Find the customer in the list and update it with the modified details.
              //const index = this.customers.findIndex(c => c.id === this.selectedCustomer.id);
              
            
              console.log(this.visible);
              setTimeout(() => {
                this.dataEvent.emit(false);
              }, 2000);  // 2000 milliseconds = 2 seconds
              this.msg2.set(false);
              this.msg.set(true);
            setTimeout(()=>{
              this.msg.set(false);
            },3500);
              
            }
        },
        reject: () => {
          
            this.msg2.set(true);
            setTimeout(()=>{
              this.msg2.set(false);
            },3500);
         
        },
    });
  }

  msg=signal(false);
 msg2=signal(false);


 
  ngOnInit(): void {
 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingUser'] && this.editingUser) {
      console.log("hello")
      console.log(this.editingUser)
      const formattedDob = this.editingUser.dob ? new Date(this.editingUser.dob).toISOString().split('T')[0] : '';
      this.isEditMode = true;
      this.userForm.patchValue({
        ...this.editingUser,
        dob: formattedDob  // Ensure the date is properly formatted
      });
      this.onCountryChange();
      this.onStateChange();
    
     
    }else {
      this.isEditMode = false;
      this.userForm.reset(); // Reset form if editingUser is null or undefined
    }
  }

  onCountryChange() {
    const selectedCountry = this.userForm.value.country;
    const country = this.countryList.find(c => c.name === selectedCountry);
    this.stateList = country ? country.states : [];
    this.cityList = [];

    
  }

  onStateChange() {
    const selectedState = this.userForm.value.state;
    const state = this.stateList.find(s => s.name === selectedState);
    this.cityList = state ? state.cities : [];
  
  }

  // Form submission method
  onSubmit(): void {
    
    if (this.userForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all fields correctly.',
      });
      return;
    }
    
    
    console.log("userfomr value in submit function");
    console.log(this.userForm.value);
    const rawDate = this.userForm.value.dob; // This is in YYYY-MM-DD format
    const formattedDOB = formatDate(rawDate, 'dd-MM-yyyy', 'en-US'); // Convert to DD-MM-YYYY
    console.log('Formatted DOB:', formattedDOB);
 
    const isoDOB = new Date(rawDate).toISOString(); // Convert to ISO format for backend
    console.log('DOB for Backend:', isoDOB);
    if (this.isEditMode && this.editingUser) {

    
     console.log("just befre passing the ediitng user");
     console.log(this.userForm.value);
      this.UserService.updateUser(this.editingUser._id,this.userForm.value).subscribe({
        next: (res) => {
         
         console.log("user has updated")
  
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        }
      });
    } else {
        console.log(this.userForm.value)
      this.UserService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User Creation successful! Redirecting to Dashboard...',
          });
      
          setTimeout(() => {
            this.router.navigate(['/welcome/dashboard']);
          }, 2000);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        }
      });
    }
   

  }

}