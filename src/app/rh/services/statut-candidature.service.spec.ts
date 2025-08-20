import { TestBed } from '@angular/core/testing';

import { StatutCandidatureService } from './statut-candidature.service';

describe('StatutCandidatureService', () => {
  let service: StatutCandidatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatutCandidatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
