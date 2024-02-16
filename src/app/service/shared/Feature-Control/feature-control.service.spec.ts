import { TestBed } from '@angular/core/testing';

import { FeatureControlService } from './feature-control.service';

describe('FeatureControlService', () => {
  let service: FeatureControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
