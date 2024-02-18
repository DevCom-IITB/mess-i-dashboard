import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestEntryFormComponent } from './guest-entry-form.component';

describe('GuestEntryFormComponent', () => {
  let component: GuestEntryFormComponent;
  let fixture: ComponentFixture<GuestEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestEntryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
