import { TestBed } from '@angular/core/testing';

import { TypeEtatService } from './type-etat.service';

describe('TypeEtatService', () => {
  let service: TypeEtatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeEtatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
