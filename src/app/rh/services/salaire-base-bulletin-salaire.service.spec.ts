import { TestBed } from '@angular/core/testing';

import { SalaireBaseBulletinSalaireService } from './salaire-base-bulletin-salaire.service';

describe('SalaireBaseBulletinSalaireService', () => {
  let service: SalaireBaseBulletinSalaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaireBaseBulletinSalaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
