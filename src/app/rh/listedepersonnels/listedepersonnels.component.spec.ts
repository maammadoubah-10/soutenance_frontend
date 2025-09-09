import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedepersonnelsComponent } from './listedepersonnels.component';

describe('ListedepersonnelsComponent', () => {
  let component: ListedepersonnelsComponent;
  let fixture: ComponentFixture<ListedepersonnelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListedepersonnelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListedepersonnelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
