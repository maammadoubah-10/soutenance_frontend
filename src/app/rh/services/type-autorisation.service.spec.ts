import { TestBed } from '@angular/core/testing';

import { TypeAutorisationService } from './type-autorisation.service';

describe('TypeAutorisationService', () => {
  let service: TypeAutorisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeAutorisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
