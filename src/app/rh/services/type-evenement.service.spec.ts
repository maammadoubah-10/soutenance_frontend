import { TestBed } from '@angular/core/testing';

import { TypeEvenementService } from './type-evenement.service';

describe('TypeEvenementService', () => {
  let service: TypeEvenementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeEvenementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
