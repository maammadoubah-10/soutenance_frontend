import { TestBed } from '@angular/core/testing';

import { RequerantService } from './requerant.service';

describe('RequerantService', () => {
  let service: RequerantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequerantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
