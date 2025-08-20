import { TestBed } from '@angular/core/testing';

import { MissionPointageService } from './mission-pointage.service';

describe('MissionPointageService', () => {
  let service: MissionPointageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionPointageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
