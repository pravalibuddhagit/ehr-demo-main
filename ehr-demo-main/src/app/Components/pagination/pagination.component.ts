import { Component } from '@angular/core';
// PrimeNG Modules
import { TableModule } from 'primeng/table';
//import { ColumnFilterModule } from 'primeng/columnfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { PaginatorModule } from 'primeng/paginator';
import { NgClass } from '@angular/common';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-pagination',
  imports: [
    DropdownModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    PaginatorModule,
    TagModule,
    MultiSelectModule,
   NgClass,
    TableModule,
    SelectModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  products = [
    {
      code: "f230fh0g3",
      name: "Bamboo Watch",
      category: "Accessories",
      quantity: 10
    },
    {
      code: "nvklal433",
      name: "Black Watch",
      category: "Accessories",
      quantity: 61
    },
    {
      code: "zz21cz3c1",
      name: "Blue Band",
      category: "Fitness",
      quantity: 1
    },
    {
      code: "244wgerg2",
      name: "Blue T-Shirt",
      category: "Clothing",
      quantity: 25
    },
    {
      code: "h456wer53",
      name: "Bracelet",
      category: "Accessories",
      quantity: 73
    },
  ]
  customers = [
    {
      name: "customers",
      country: "US",
      representative: "TEST",
      status: true
    }
  ];
  representatives = [{ label: "edvak", name: "edvak" }];
}
