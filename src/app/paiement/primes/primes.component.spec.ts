import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimesComponent } from './primes.component';

describe('PrimesComponent', () => {
  let component: PrimesComponent;
  let fixture: ComponentFixture<PrimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
