import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMessBillComponent } from './form-mess-bill.component';

describe('FormMessBillComponent', () => {
  let component: FormMessBillComponent;
  let fixture: ComponentFixture<FormMessBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMessBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMessBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
