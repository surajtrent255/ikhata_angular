import { TestBed } from '@angular/core/testing';

import { SalesCartService } from './sales-cart-service.service';

describe('SalesCartServiceService', () => {
  let service: SalesCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
