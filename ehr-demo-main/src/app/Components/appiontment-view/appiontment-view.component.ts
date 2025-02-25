import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-appiontment-view',
  imports: [CommonModule, FormsModule,TableModule, ButtonModule, PaginatorModule,RouterModule],
  templateUrl: './appiontment-view.component.html',
  styleUrl: './appiontment-view.component.scss'
})
export class AppiontmentViewComponent {




  appointments = [
    {
      id: 1,
      doctor: { name: "Dr. Smith", speciality: "Cardiologist", address: "123 Main St, NY" },
      patient: { name: "Viraj Patel", email: "viraj.patel@example.com" },
      date: "2024-03-23",
      timeSlot: "10:00 AM - 10:30 AM",
      reason: "Chest pain consultation",
      status: "Confirmed"
    },
    {
      id: 2,
      doctor: { name: "Dr. Jones", speciality: "Dermatologist", address: "45 Oak St, LA" },
      patient: { name: "Sophia Jones", email: "sophia.jones@example.com" },
      date: "2024-03-02",
      timeSlot: "02:00 PM - 02:30 PM",
      reason: "Skin allergy treatment",
      status: "Pending"
    },
    {
      id: 3,
      doctor: { name: "Dr. Wilson", speciality: "Neurologist", address: "78 Elm St, TX" },
      patient: { name: "Parthiv Mehta", email: "parthiv.mehta@example.com" },
      date: "2024-03-03",
      timeSlot: "11:30 AM - 12:00 PM",
      reason: "Migraine diagnosis",
      status: "Completed"
    }

    ,

    {
      id: 4,
      doctor: { name: "Dr. Adams", speciality: "Orthopedic", address: "56 Pine St, SF" },
      patient: { name: "Liam Carter", email: "liam.carter@example.com" },
      date: "2024-03-04",
      timeSlot: "09:00 AM - 09:30 AM",
      reason: "Knee pain evaluation",
      status: "Confirmed"
    },
    {
      id: 5,
      doctor: { name: "Dr. Brown", speciality: "Pediatrician", address: "90 Maple St, CH" },
      patient: { name: "Emma Wilson", email: "emma.wilson@example.com" },
      date: "2024-03-05",
      timeSlot: "01:00 PM - 01:30 PM",
      reason: "Routine child check-up",
      status: "Pending"
    },
    {
      id: 6,
      doctor: { name: "Dr. Evans", speciality: "Endocrinologist", address: "33 Birch St, FL" },
      patient: { name: "Rajesh Kumar", email: "rajesh.kumar@example.com" },
      date: "2024-03-06",
      timeSlot: "03:00 PM - 03:30 PM",
      reason: "Thyroid disorder follow-up",
      status: "Confirmed"
    },
    {
      id: 7,
      doctor: { name: "Dr. Miller", speciality: "Ophthalmologist", address: "22 Cedar St, WA" },
      patient: { name: "Isabella Garcia", email: "isabella.garcia@example.com" },
      date: "2024-03-07",
      timeSlot: "10:30 AM - 11:00 AM",
      reason: "Vision test and prescription update",
      status: "Completed"
    },
    {
      id: 8,
      doctor: { name: "Dr. Thomas", speciality: "Psychiatrist", address: "77 Oakwood St, MA" },
      patient: { name: "Michael Lee", email: "michael.lee@example.com" },
      date: "2024-03-08",
      timeSlot: "04:00 PM - 04:30 PM",
      reason: "Anxiety disorder consultation",
      status: "Pending"
    }
  ];

  totalRecords = this.appointments.length;
  pageSize = 5;
  loading = false;

  constructor(private router: Router) { 

  }

  ngOnInit(): void { }

  onLazyLoad(event: any) {
    console.log("Lazy Load Event:", event);
  }

  editAppointment(appointment: any) {
    console.log("Edit:", appointment);
  }

  deleteAppointment(appointment: any) {
    console.log("Delete:", appointment);
  }

}
