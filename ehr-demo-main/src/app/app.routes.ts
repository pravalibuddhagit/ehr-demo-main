import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
//import { UserCreationComponent } from './user-creation/user-creation.component'; 
import { UserCreationComponent } from '../app/Components/user-creation/user-creation.component';

export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent
    },
    { path: 'user-creation', component: UserCreationComponent },
    
];
