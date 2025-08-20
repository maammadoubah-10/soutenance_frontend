import { TestBed } from '@angular/core/testing';

import { TypePrimeService } from './type-prime.service';

describe('TypePrimeService', () => {
  let service: TypePrimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypePrimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
