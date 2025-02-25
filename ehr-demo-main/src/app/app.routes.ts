
import { Routes } from '@angular/router';
//import { LoginComponent } from './Components/login/login.component';
//import { UserCreationComponent } from './user-creation/user-creation.component'; 
import { UserCreationComponent } from '../app/Components/user-creation/user-creation.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { MainLayoutComponent } from './Components/main-layout/main-layout.component';
import { PaginationComponent } from './Components/pagination/pagination.component';
import { authGuard } from './Components/guards/auth.guard';
import { WelcomeComponent } from './Components/welcome/welcome.component';
import { PatientRegistrationComponent } from './Components/patient-registration/patient-registration.component';
import { AppointmentFormComponent } from './Components/appointment-form/appointment-form.component';

export const routes: Routes = [
      {
        
           path: '', redirectTo: 'login', pathMatch: 'full' 
         
      },

      {
        path: 'login',
        component: LoginComponent, // Wraps Login/Register
        
      },
      {
        path: 'register',
        component: RegistrationComponent, // Wraps Login/Register
        
      },

      {
        path: 'welcome',
        component: MainLayoutComponent, // Wrapper for sidebar & header
        canActivate: [authGuard], // Protects Dashboard
        children: [
 
          { path: '', component: WelcomeComponent },
          { path: 'dashboard', component: PaginationComponent },
          { path: 'user-creation', component: UserCreationComponent },
          {path: 'patient-creation', component:PatientRegistrationComponent},
          {path: 'appointment-creation', component:AppointmentFormComponent}
        ],
      },
      { path: '**', redirectTo: 'login' }

    
];
