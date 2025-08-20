import { TestBed } from '@angular/core/testing';

import { OrdreVirementService } from './ordre-virement.service';

describe('OrdreVirementService', () => {
  let service: OrdreVirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdreVirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
