import { TestBed } from '@angular/core/testing';

import { VatRateTypesService } from './vat-rate-types.service';

describe('VatRateTypesService', () => {
  let service: VatRateTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VatRateTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
