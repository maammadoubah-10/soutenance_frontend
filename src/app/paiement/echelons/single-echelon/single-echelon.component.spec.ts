import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEchelonComponent } from './single-echelon.component';

describe('SingleEchelonComponent', () => {
  let component: SingleEchelonComponent;
  let fixture: ComponentFixture<SingleEchelonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleEchelonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleEchelonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
