import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactSalarialComponent } from './impact-salarial.component';

describe('ImpactSalarialComponent', () => {
  let component: ImpactSalarialComponent;
  let fixture: ComponentFixture<ImpactSalarialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactSalarialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpactSalarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
