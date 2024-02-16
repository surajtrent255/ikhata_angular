import { TestBed } from '@angular/core/testing';

import { CompanyLabelService } from './company-label.service';

describe('CompanyLabelService', () => {
  let service: CompanyLabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyLabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
