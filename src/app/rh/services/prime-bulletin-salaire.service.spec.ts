import { TestBed } from '@angular/core/testing';

import { PrimeBulletinSalaireService } from './prime-bulletin-salaire.service';

describe('PrimeBulletinSalaireService', () => {
  let service: PrimeBulletinSalaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrimeBulletinSalaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
