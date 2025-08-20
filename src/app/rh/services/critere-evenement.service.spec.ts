import { TestBed } from '@angular/core/testing';

import { CritereEvenementService } from './critere-evenement.service';

describe('CritereEvenementService', () => {
  let service: CritereEvenementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CritereEvenementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
