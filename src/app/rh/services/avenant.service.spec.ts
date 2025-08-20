import { TestBed } from '@angular/core/testing';

import { AvenantService } from './avenant.service';

describe('AvenantService', () => {
  let service: AvenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvenantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
