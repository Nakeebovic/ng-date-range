import { TestBed } from '@angular/core/testing';

import { AngularDateRangeService } from './angular-date-range.service';

describe('AngularDateRangeService', () => {
  let service: AngularDateRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularDateRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
