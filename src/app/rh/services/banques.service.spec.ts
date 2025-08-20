import { TestBed } from '@angular/core/testing';

import { BanquesService } from './banques.service';

describe('BanquesService', () => {
  let service: BanquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BanquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
