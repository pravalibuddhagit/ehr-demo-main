import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // Ensure your backend route matches this

  constructor(private http: HttpClient) {}

  // Method to create a new user
  createUser(user: User): Observable<User> {
    debugger
    return this.http.post<{ success: boolean; data: any; error?: { message: string } }>(this.apiUrl, user,{ headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            return throwError(() => new Error(response.error?.message || 'User creation failed.'));
          }
        }),
        catchError(this.handleError)
      );
  }

  getAllUsers(): Observable<User[]> {
   
    return this.http.get<{ success: boolean; data: any; error?: { message: string } }>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          } else {
            return throwError(() => new Error(response.error?.message || 'User fetching failed'));
          }
        }),
        catchError(this.handleError)
      );
  }
 
  deleteUser(id: string) : Observable<any>{
    return this.http.delete<{ success: boolean; message: string; error?: { message: string } }>(`${this.apiUrl}/${id}`,{headers :  this.getHeaders() })
    .pipe(
      map(response =>{
        if(response.success){
          return response.message;
        }else{
          return  throwError(() => new Error(response.error?.message || "User can't be deleted"));
        }
      }),
      catchError(this.handleError)
    )

  }
  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error.error?.message || `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
