import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAutorisationsComponent } from './type-autorisations.component';

describe('TypeAutorisationsComponent', () => {
  let component: TypeAutorisationsComponent;
  let fixture: ComponentFixture<TypeAutorisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeAutorisationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeAutorisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
