import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotdepassoublieComponent } from './motdepassoublie.component';

describe('MotdepassoublieComponent', () => {
  let component: MotdepassoublieComponent;
  let fixture: ComponentFixture<MotdepassoublieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotdepassoublieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MotdepassoublieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
