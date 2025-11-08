import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTypeEtatComponent } from './single-type-etat.component';

describe('SingleTypeEtatComponent', () => {
  let component: SingleTypeEtatComponent;
  let fixture: ComponentFixture<SingleTypeEtatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTypeEtatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTypeEtatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
