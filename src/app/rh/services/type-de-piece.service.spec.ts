import { TestBed } from '@angular/core/testing';

import { TypeDePieceService } from './type-de-piece.service';

describe('TypeDePieceService', () => {
  let service: TypeDePieceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeDePieceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
