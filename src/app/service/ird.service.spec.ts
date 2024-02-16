import { TestBed } from '@angular/core/testing';

import { IrdService } from './ird.service';

describe('IrdService', () => {
  let service: IrdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IrdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
