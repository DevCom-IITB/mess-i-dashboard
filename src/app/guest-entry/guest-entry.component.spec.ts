import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestEntryComponent } from './guest-entry.component';

describe('GuestEntryComponent', () => {
  let component: GuestEntryComponent;
  let fixture: ComponentFixture<GuestEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
