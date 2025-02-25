import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppiontmentViewComponent } from './appiontment-view.component';

describe('AppiontmentViewComponent', () => {
  let component: AppiontmentViewComponent;
  let fixture: ComponentFixture<AppiontmentViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppiontmentViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppiontmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
