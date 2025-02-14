import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergedAppComponent } from './merged-app.component';

describe('MergedAppComponent', () => {
  let component: MergedAppComponent;
  let fixture: ComponentFixture<MergedAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergedAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergedAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
