import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateFormComponent } from './rebate-form.component';

describe('RebateFormComponent', () => {
  let component: RebateFormComponent;
  let fixture: ComponentFixture<RebateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebateFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
