import { TestBed } from '@angular/core/testing';

import { SalesBillServiceService } from './sales-bill-service.service';

describe('SalesBillServiceService', () => {
  let service: SalesBillServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesBillServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
