import { TestBed } from '@angular/core/testing';

import { PruchaseAdditionalInfoService } from './pruchase-additional-info.service';

describe('PruchaseAdditionalInfoService', () => {
  let service: PruchaseAdditionalInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PruchaseAdditionalInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
