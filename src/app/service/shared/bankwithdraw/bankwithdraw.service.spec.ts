import { TestBed } from '@angular/core/testing';

import { BankwithdrawService } from './bankwithdraw.service';

describe('BankwithdrawService', () => {
  let service: BankwithdrawService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankwithdrawService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
