import { TestBed } from '@angular/core/testing';

import { NgDateRangeService } from './ng-date-range.service';

describe('NgDateRangeService', () => {
  let service: NgDateRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgDateRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
