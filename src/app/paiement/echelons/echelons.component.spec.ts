import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchelonsComponent } from './echelons.component';

describe('EchelonsComponent', () => {
  let component: EchelonsComponent;
  let fixture: ComponentFixture<EchelonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EchelonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EchelonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
