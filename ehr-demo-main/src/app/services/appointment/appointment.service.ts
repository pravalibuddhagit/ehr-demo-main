import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`; // Matches your backend route

  constructor(private http: HttpClient) {}

  // Method to create a new appointment
  createAppointment(appointment: any): Observable<any> {
    return this.http
      .post<{ success: boolean; data: any; error?: { message: string } }>(this.apiUrl, appointment, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data;
          } else {
            return throwError(() => new Error(response.error?.message || 'Appointment creation failed.'));
          }
        }),
        catchError(this.handleError)
      );
  }

  // Method to get paginated appointments
  getAppointmentsPag(page: number,limit:number, search: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) params = params.set('search', search);

    console.log('API params:', params.toString());
    return this.http
      .get<{ success: boolean; data: any; error?: { message: string } }>(`${this.apiUrl}/pusers`, {
        headers: this.getHeaders(),
        params: params,
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data; // Returns { appointments: [], pagination: {} }
          } else {
            return throwError(() => new Error(response.error?.message || 'Appointment fetching failed'));
          }
        }),
        catchError(this.handleError)
      );
  }

  // Method to update an appointment
  updateAppointment(id: string, appointment: any): Observable<any> {
    return this.http
      .put<{ success: boolean; data: any; error?: { message: string } }>(`${this.apiUrl}/${id}`, appointment, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data;
          } else {
            return throwError(() => new Error(response.error?.message || "Appointment can't be updated"));
          }
        }),
        catchError(this.handleError)
      );
  }

  // Method to get providers with pagination for select cum search
  getProviders(search: string = '', page: number = 1, limit: number = 4): Observable<any> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
    //  .set('limit', limit.toString());

    return this.http
      .get<{ success: boolean; data: any; pagination: any; error?: { message: string } }>(
        `${this.apiUrl}/providers`,
        { headers: this.getHeaders(), params }
      )
      .pipe(
        map((response) => {
          if (response.success) {
            return { providers: response.data, pagination: response.pagination };
          } else {
            return throwError(() => new Error(response.error?.message || 'Failed to fetch providers'));
          }
        }),
        catchError(this.handleError)
      );
  }

  // Method to get patients with pagination for select cum search
  getPatients(search: string = '', page: number = 1, limit: number = 4): Observable<any> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
     // .set('limit', limit.toString());

    return this.http
      .get<{ success: boolean; data: any; pagination: any; error?: { message: string } }>(
        `${this.apiUrl}/patients`,
        { headers: this.getHeaders(), params }
      )
      .pipe(
        map((response) => {
          if (response.success) {
            return { patients: response.data, pagination: response.pagination };
          } else {
            return throwError(() => new Error(response.error?.message || 'Failed to fetch patients'));
          }
        }),
        catchError(this.handleError)
      );
  }

  deleteAppointment(id: string) : Observable<any>{
    return this.http.delete<{ success: boolean; message: string; error?: { message: string } }>(`${this.apiUrl}/${id}`,{headers :  this.getHeaders() })
    .pipe(
      map(response =>{
        if(response.success){
          return response.message;
        }else{
          return  throwError(() => new Error(response.error?.message || "Appointment can't be deleted"));
        }
      }),
      catchError(this.handleError)
    )
 
  }



  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error.error?.message || 'Server Error';
    }
    return throwError(() => new Error(errorMessage));
  }
}