import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPaginationComponent } from './patient-pagination.component';

describe('PatientPaginationComponent', () => {
  let component: PatientPaginationComponent;
  let fixture: ComponentFixture<PatientPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientPaginationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
