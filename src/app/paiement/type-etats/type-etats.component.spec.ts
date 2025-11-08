import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeEtatsComponent } from './type-etats.component';

describe('TypeEtatsComponent', () => {
  let component: TypeEtatsComponent;
  let fixture: ComponentFixture<TypeEtatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeEtatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeEtatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
