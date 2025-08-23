import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagenontrouveeComponent } from './pagenontrouvee.component';

describe('PagenontrouveeComponent', () => {
  let component: PagenontrouveeComponent;
  let fixture: ComponentFixture<PagenontrouveeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagenontrouveeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagenontrouveeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
