
import { Routes } from '@angular/router';
//import { LoginComponent } from './Components/login/login.component';
//import { UserCreationComponent } from './user-creation/user-creation.component'; 
import { UserCreationComponent } from '../app/Components/user-creation/user-creation.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { LoginComponent } from './Components/login/login.component';
import { PublicLayoutComponent } from './Components/public-layout/public-layout.component';
import { MainLayoutComponent } from './Components/main-layout/main-layout.component';
import { PaginationComponent } from './Components/pagination/pagination.component';
import { authGuard } from './Components/guards/auth.guard';
import { WelcomeComponent } from './Components/welcome/welcome.component';

export const routes: Routes = [
    
    {
        path: '',
        component: PublicLayoutComponent, // Wraps Login/Register
        children: [
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegistrationComponent }
        ]
      },
      // {
      //   path: 'dashboard',
      //   component: MainLayoutComponent,
      //   canActivate: [authGuard], // Protects Dashboard
      //   children: [
      //    { path: '', component: PaginationComponent },
      //     { path: 'user-creation', component: UserCreationComponent }
      //   ],
       
      // },

      {
        path: 'welcome',
        component: MainLayoutComponent, // Wrapper for sidebar & header
        canActivate: [authGuard], // Protects Dashboard
        children: [
 
          { path: '', component: WelcomeComponent },
          { path: 'dashboard', component: PaginationComponent },
          { path: 'user-creation', component: UserCreationComponent },
        ],
      },
      { path: '**', redirectTo: 'login' }

    
    // { path: 'user-creation', component: UserCreationComponent },
    // { path: 'login', component: LoginComponent },
    // { path: 'register', component: RegistrationComponent}
    
];
