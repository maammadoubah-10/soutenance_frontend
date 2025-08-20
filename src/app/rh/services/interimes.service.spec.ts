import { TestBed } from '@angular/core/testing';

import { InterimesService } from './interimes.service';

describe('InterimesService', () => {
  let service: InterimesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterimesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
