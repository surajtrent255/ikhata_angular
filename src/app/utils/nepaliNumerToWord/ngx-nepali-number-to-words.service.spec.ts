import { TestBed } from '@angular/core/testing';

import { NgxNepaliNumberToWordsService } from './ngx-nepali-number-to-words.service';

describe('NgxNepaliNumberToWordsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxNepaliNumberToWordsService = TestBed.get(NgxNepaliNumberToWordsService);
    expect(service).toBeTruthy();
  });
});
