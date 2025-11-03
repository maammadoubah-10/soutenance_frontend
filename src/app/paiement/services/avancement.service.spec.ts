import { TestBed } from '@angular/core/testing';

import { AvancementService } from './avancement.service';

describe('AvancementService', () => {
  let service: AvancementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvancementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
