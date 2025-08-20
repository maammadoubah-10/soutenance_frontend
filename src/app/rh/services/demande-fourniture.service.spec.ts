import { TestBed } from '@angular/core/testing';

import { DemandeFournitureService } from './demande-fourniture.service';

describe('DemandeFournitureService', () => {
  let service: DemandeFournitureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeFournitureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
