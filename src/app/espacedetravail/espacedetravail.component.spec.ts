import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacedetravailComponent } from './espacedetravail.component';

describe('EspacedetravailComponent', () => {
  let component: EspacedetravailComponent;
  let fixture: ComponentFixture<EspacedetravailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EspacedetravailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EspacedetravailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
