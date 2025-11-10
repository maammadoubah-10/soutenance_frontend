import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeImpactSalarialComponent } from './type-impact-salarial.component';

describe('TypeImpactSalarialComponent', () => {
  let component: TypeImpactSalarialComponent;
  let fixture: ComponentFixture<TypeImpactSalarialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeImpactSalarialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeImpactSalarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
