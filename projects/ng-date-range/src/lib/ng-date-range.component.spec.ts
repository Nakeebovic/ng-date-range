import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDateRangeComponent } from './ng-date-range.component';

describe('NgDateRangeComponent', () => {
  let component: NgDateRangeComponent;
  let fixture: ComponentFixture<NgDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgDateRangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
