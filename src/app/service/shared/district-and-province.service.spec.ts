import { TestBed } from '@angular/core/testing';

import { DistrictAndProvinceService } from './district-and-province.service';

describe('DistrictAndProvinceService', () => {
  let service: DistrictAndProvinceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistrictAndProvinceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
