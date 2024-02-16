import { TestBed } from '@angular/core/testing';

import { FixedAssetsService } from './fixed-assets.service';

describe('FixedAssetsService', () => {
  let service: FixedAssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedAssetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
