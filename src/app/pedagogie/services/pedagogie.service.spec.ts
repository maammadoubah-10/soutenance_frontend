import { TestBed } from '@angular/core/testing';

import { PedagogieService } from './pedagogie.service';

describe('CourrierService', () => {
  let service: PedagogieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedagogieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
