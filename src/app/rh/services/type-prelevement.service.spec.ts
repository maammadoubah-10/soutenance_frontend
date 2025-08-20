import { TestBed } from '@angular/core/testing';

import { TypePrelevementService } from './type-prelevement.service';

describe('TypePrelevementService', () => {
  let service: TypePrelevementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypePrelevementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
