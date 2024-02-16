import { TestBed } from '@angular/core/testing';

import { OtherincomeService } from './otherincome.service';

describe('OtherincomeService', () => {
  let service: OtherincomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherincomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
