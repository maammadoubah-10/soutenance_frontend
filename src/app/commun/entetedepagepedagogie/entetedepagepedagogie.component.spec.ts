import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntetedepagepedagogieComponent } from './entetedepagepedagogie.component';

describe('EntetedepagepedagogieComponent', () => {
  let component: EntetedepagepedagogieComponent;
  let fixture: ComponentFixture<EntetedepagepedagogieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntetedepagepedagogieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntetedepagepedagogieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
