import { TestBed } from '@angular/core/testing';

import { DemandeActeAdministratifService } from './demande-acte-administratif.service';

describe('DemandeActeAdministratifService', () => {
  let service: DemandeActeAdministratifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeActeAdministratifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
