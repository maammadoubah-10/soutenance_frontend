import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeRetenusComponent } from './type-retenus.component';

describe('TypeRetenusComponent', () => {
  let component: TypeRetenusComponent;
  let fixture: ComponentFixture<TypeRetenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeRetenusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeRetenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
