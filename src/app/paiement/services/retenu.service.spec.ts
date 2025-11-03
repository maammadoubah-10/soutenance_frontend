import { TestBed } from '@angular/core/testing';

import { RetenuService } from './retenu.service';

describe('RetenuService', () => {
  let service: RetenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
