import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionPedagoComponent } from './connexion-pedago.component';

describe('ConnexionPedagoComponent', () => {
  let component: ConnexionPedagoComponent;
  let fixture: ComponentFixture<ConnexionPedagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnexionPedagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnexionPedagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
