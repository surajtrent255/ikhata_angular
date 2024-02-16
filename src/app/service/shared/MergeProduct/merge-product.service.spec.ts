import { TestBed } from '@angular/core/testing';

import { MergeProductService } from './merge-product.service';

describe('MergeProductService', () => {
  let service: MergeProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MergeProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
