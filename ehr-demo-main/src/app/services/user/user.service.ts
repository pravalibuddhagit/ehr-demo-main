import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse ,HttpParams} from '@angular/common/http';
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

  getAllUsers2(
    page: number,
     search: string,
      state: string,
      stateMode: string,
       country: string,
       countryMode: string
      )
       : Observable<any> {
    let params = new HttpParams()
        .set('page', page.toString())
        .set('limit', '10');

    if (search) params = params.set('search', search);
    if (state) {
      params = params.set('state', state);
      params = params.set('stateMode', stateMode);
    }
    if (country) {
      params = params.set('country', country);
      params = params.set('countryMode', countryMode);
    }

    console.log('API params:', params.toString());
    
    return this.http.get<any>(`${this.apiUrl}/pusers`, { 
      headers: this.getHeaders(),
      params: params 
    }).pipe(
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

  
  updateUser(id: string, user: User) : Observable<any>{
    return this.http.put<{ success: boolean; message: string; error?: { message: string } }>(`${this.apiUrl}/${id}`,user,{headers :  this.getHeaders() })
    .pipe(
      map(response =>{
        if(response.success){
          return response.message;
        }else{
          return  throwError(() => new Error(response.error?.message || "User can't be Updated"));
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
      errorMessage = error.error.error?.message || "Server Error";
    }
    return throwError(() => new Error(errorMessage));
  }
}
