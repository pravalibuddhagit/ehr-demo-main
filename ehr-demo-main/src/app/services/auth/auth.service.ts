import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { Manager } from '../../models/manager.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
   res:any;
  constructor(private http: HttpClient, private router: Router) {}
 


  register(manager: Manager): Observable<any> {
    return this.http.post<{ success: boolean, data: any, error: {message : string} }>(`${this.apiUrl}/register`, manager)
      .pipe(
        map(response => {
          if (response.success) {
            console.log(response)
            return response.data;
          } else {
            this.res=response;
            console.log(this.res.error);
            // If the response indicates failure, throw an error with the message from the API
            return throwError(() => new Error(response.error.message));
          }
          
        }),
     //  console.log('gg');
        catchError(this.handleError )
      );
  }

   // New login method
   login(email: string, password: string): Observable<any> {
    return this.http.post<{ success: boolean; data: any; error: { message: string } }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data; // Return user data or token
          } else {
            return throwError(() => new Error(response.error.message));
          }
        }),
        catchError(this.handleError)
      );
  }

  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    }  else {
      // Extract the error message from the response if available
      errorMessage = error.error.error?.message || `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }

     // Use throwError with a factory function
     return throwError(() => new Error(errorMessage));

  }

  
}
