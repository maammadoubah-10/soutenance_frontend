import { TestBed } from '@angular/core/testing';

import { FacteurService } from './facteur.service';

describe('FacteurService', () => {
  let service: FacteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
