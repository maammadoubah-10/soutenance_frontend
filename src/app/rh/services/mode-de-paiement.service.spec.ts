import { TestBed } from '@angular/core/testing';

import { ModeDePaiementService } from './mode-de-paiement.service';

describe('ModeDePaiementService', () => {
  let service: ModeDePaiementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeDePaiementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
