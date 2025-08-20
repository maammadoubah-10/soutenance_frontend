import { TestBed } from '@angular/core/testing';

import { ImputationService } from './imputation.service';

describe('ImputationService', () => {
  let service: ImputationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImputationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
