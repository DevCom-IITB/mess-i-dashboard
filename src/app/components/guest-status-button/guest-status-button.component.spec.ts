import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestStatusButtonComponent } from './guest-status-button.component';

describe('GuestStatusButtonComponent', () => {
  let component: GuestStatusButtonComponent;
  let fixture: ComponentFixture<GuestStatusButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestStatusButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestStatusButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
