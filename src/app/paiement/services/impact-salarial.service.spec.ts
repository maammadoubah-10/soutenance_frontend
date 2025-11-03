import { TestBed } from '@angular/core/testing';

import { ImpactSalarialService } from './impact-salarial.service';

describe('ImpactSalarialService', () => {
  let service: ImpactSalarialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpactSalarialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
