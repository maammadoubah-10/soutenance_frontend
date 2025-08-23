import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitredepageComponent } from './titredepage.component';

describe('TitredepageComponent', () => {
  let component: TitredepageComponent;
  let fixture: ComponentFixture<TitredepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitredepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitredepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
