import { TestBed } from '@angular/core/testing';

import { TypeMissionService } from './type-mission.service';

describe('TypeMissionService', () => {
  let service: TypeMissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeMissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
