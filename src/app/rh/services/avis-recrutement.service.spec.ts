import { TestBed } from '@angular/core/testing';

import { AvisRecrutementService } from './avis-recrutement.service';

describe('AvisRecrutementService', () => {
  let service: AvisRecrutementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvisRecrutementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
