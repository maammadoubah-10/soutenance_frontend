import { TestBed } from '@angular/core/testing';

import { TypeRetenuService } from './type-retenu.service';

describe('TypeRetenuService', () => {
  let service: TypeRetenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeRetenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
