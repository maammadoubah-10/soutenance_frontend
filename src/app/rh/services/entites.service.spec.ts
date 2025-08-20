import { TestBed } from '@angular/core/testing';

import { EntitesService } from './entites.service';

describe('EntitesService', () => {
  let service: EntitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
