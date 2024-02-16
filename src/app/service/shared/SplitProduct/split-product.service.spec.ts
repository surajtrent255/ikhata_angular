import { TestBed } from '@angular/core/testing';

import { SplitProductService } from './split-product.service';

describe('SplitProductService', () => {
  let service: SplitProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplitProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
