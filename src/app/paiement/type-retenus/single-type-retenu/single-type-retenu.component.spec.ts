import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTypeRetenuComponent } from './single-type-retenu.component';

describe('SingleTypeRetenuComponent', () => {
  let component: SingleTypeRetenuComponent;
  let fixture: ComponentFixture<SingleTypeRetenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTypeRetenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTypeRetenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
