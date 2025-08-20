import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntetedepageComponent } from './entetedepage.component';

describe('EntetedepageComponent', () => {
  let component: EntetedepageComponent;
  let fixture: ComponentFixture<EntetedepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntetedepageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntetedepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
