import { TestBed } from '@angular/core/testing';

import { StatutDemandeService } from './statut-demande.service';

describe('StatutDemandeService', () => {
  let service: StatutDemandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatutDemandeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
