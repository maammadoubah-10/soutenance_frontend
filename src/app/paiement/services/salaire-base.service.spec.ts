import { TestBed } from '@angular/core/testing';

import { SalaireBaseService } from './salaire-base.service';

describe('SalaireBaseService', () => {
  let service: SalaireBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaireBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
