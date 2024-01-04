import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStatusButtonComponent } from './card-status-button.component';

describe('CardStatusButtonComponent', () => {
  let component: CardStatusButtonComponent;
  let fixture: ComponentFixture<CardStatusButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardStatusButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardStatusButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
