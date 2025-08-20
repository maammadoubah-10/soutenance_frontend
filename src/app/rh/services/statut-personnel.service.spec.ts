import { TestBed } from '@angular/core/testing';

import { StatutPersonnelService } from './statut-personnel.service';

describe('StatutPersonnelService', () => {
  let service: StatutPersonnelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatutPersonnelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
