import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetenusComponent } from './retenus.component';

describe('RetenusComponent', () => {
  let component: RetenusComponent;
  let fixture: ComponentFixture<RetenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetenusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
