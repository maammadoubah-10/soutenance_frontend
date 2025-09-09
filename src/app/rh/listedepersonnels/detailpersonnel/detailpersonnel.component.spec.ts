import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailpersonnelComponent } from './detailpersonnel.component';

describe('DetailpersonnelComponent', () => {
  let component: DetailpersonnelComponent;
  let fixture: ComponentFixture<DetailpersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailpersonnelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailpersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
