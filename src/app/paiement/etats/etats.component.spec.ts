import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtatsComponent } from './etats.component';

describe('EtatsComponent', () => {
  let component: EtatsComponent;
  let fixture: ComponentFixture<EtatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
