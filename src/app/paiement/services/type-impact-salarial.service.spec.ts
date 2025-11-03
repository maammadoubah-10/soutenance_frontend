import { TestBed } from '@angular/core/testing';

import { TypeImpactSalarialService } from './type-impact-salarial.service';

describe('TypeImpactSalarialService', () => {
  let service: TypeImpactSalarialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeImpactSalarialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
