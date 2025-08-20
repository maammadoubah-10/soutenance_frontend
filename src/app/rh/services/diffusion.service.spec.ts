import { TestBed } from '@angular/core/testing';

import { DiffusionService } from './diffusion.service';

describe('DiffusionService', () => {
  let service: DiffusionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiffusionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
