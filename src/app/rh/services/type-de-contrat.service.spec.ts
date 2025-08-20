import { TestBed } from '@angular/core/testing';

import { TypeDeContratService } from './type-de-contrat.service';

describe('TypeDeContratService', () => {
  let service: TypeDeContratService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeDeContratService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
