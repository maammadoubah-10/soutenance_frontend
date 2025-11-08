import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvancementsComponent } from './avancements.component';

describe('AvancementsComponent', () => {
  let component: AvancementsComponent;
  let fixture: ComponentFixture<AvancementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvancementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvancementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
