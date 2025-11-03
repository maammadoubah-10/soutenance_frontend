import { TestBed } from '@angular/core/testing';

import { PrelevementService } from './prelevement.service';

describe('PrelevementService', () => {
  let service: PrelevementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrelevementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
