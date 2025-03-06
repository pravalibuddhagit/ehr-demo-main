import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`; // Matches your backend route

  constructor(private http: HttpClient) {}

  // Method to create a new patient
   createPatient(patient: any): Observable<any> {
    return  this.http
      .post<{ success: boolean; data: any; error?: { message: string } }>(this.apiUrl, patient, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return response.data;
          } else {
            return throwError(() => new Error(response.error?.message || 'Patient creation failed.'));
          }
        }),
        catchError(this.handleError)
      );
  }

  // Method to delete a patient
  deletePatient(id: string): Observable<any> {
    return this.http
      .delete<{ success: boolean; message: string; error?: { message: string } }>(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return response.message;
          } else {
            return throwError(() => new Error(response.error?.message || "Patient can't be deleted"));
          }
        }),
        catchError(this.handleError)
      );
  }

  // Method to get paginated patients
  getPatientsPag(
    page: number,
    limit:number,
    search: string = '',
  ): Observable<any> {
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
            return response.data; // Returns { patients: [], pagination: {} }
          } else {
            return throwError(() => new Error(response.error?.message || 'Patient fetching failed'));
          }
        }),
        catchError(this.handleError)
      );
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