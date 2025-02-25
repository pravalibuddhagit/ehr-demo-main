import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-pagination',
  standalone: true,
  templateUrl: './patient-pagination.component.html',
  providers: [ConfirmationService, MessageService],
  imports: [TableModule, ConfirmDialogModule, ButtonModule, InputTextModule]
})
export class PatientPaginationComponent implements OnInit {
  patients: any[] = []; // Empty array initialization 
  totalRecords: number = 0;  
  loading: boolean = false;  
  pageSize: number = 5;  
  pageIndex: number = 0;
  apiUrl = 'https://your-backend.com/api/patients';  

  http = inject(HttpClient);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  router = inject(Router);

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    const params = { page: this.pageIndex + 1, limit: this.pageSize };

    this.http.get<{ patients: any[], totalRecords: number }>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        this.patients = data.patients || [];  
        this.totalRecords = data.totalRecords || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching patients', error);
        this.patients = [];  
        this.totalRecords = 0;
        this.loading = false;
      }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.pageIndex = event.first! / event.rows!;
    this.pageSize = event.rows!;
    this.loadPatients();
  }

  editPatient(patient: any): void {
    console.log('Editing patient:', patient);
    this.router.navigate(['/edit-patient', patient.id]);
  }

  deletePatient(patient: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${patient.first_name} ${patient.last_name}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(`${this.apiUrl}/${patient.id}`).subscribe({
          next: () => {
            this.patients = this.patients.filter(p => p !== patient);
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Patient deleted successfully!' });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete patient!' });
          }
        });
      }
    });
  }
}
