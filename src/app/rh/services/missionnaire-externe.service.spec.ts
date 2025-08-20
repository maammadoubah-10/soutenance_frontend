import { TestBed } from '@angular/core/testing';

import { MissionnaireExterneService } from './missionnaire-externe.service';

describe('MissionnaireExterneService', () => {
  let service: MissionnaireExterneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionnaireExterneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
