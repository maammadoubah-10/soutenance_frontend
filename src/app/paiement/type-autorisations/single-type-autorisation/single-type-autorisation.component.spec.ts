import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleTypeAutorisationComponent } from './single-type-autorisation.component';

describe('SingleTypeAutorisationComponent', () => {
  let component: SingleTypeAutorisationComponent;
  let fixture: ComponentFixture<SingleTypeAutorisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleTypeAutorisationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleTypeAutorisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
