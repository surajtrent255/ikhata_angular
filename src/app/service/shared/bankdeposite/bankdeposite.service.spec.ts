import { TestBed } from '@angular/core/testing';

import { BankdepositeService } from './bankdeposite.service';

describe('BankdepositeService', () => {
  let service: BankdepositeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankdepositeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
