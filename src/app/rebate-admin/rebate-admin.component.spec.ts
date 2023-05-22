import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateAdminComponent } from './rebate-admin.component';

describe('RebateAdminComponent', () => {
  let component: RebateAdminComponent;
  let fixture: ComponentFixture<RebateAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebateAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
