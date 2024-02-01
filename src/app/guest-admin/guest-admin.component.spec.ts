import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestAdminComponent } from './guest-admin.component';

describe('GuestAdminComponent', () => {
  let component: GuestAdminComponent;
  let fixture: ComponentFixture<GuestAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
