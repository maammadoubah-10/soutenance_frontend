import { TestBed } from '@angular/core/testing';

import { BulletinSalaireService } from './bulletin-salaire.service';

describe('BulletinSalaireService', () => {
  let service: BulletinSalaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulletinSalaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
