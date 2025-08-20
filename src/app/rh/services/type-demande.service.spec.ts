import { TestBed } from '@angular/core/testing';

import { TypeDemandeService } from './type-demande.service';

describe('TypeDemandeService', () => {
  let service: TypeDemandeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeDemandeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
