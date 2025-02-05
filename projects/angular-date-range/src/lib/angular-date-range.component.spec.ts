import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularDateRangeComponent } from './angular-date-range.component';

describe('AngularDateRangeComponent', () => {
  let component: AngularDateRangeComponent;
  let fixture: ComponentFixture<AngularDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularDateRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
