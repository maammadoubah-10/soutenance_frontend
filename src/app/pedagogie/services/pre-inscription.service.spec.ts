import { TestBed } from '@angular/core/testing';

import { PreInscriptionService } from './pre-inscription.service';

describe('PreInscriptionService', () => {
  let service: PreInscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreInscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
