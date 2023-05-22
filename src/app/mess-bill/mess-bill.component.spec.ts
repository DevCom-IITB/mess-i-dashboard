import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessBillComponent } from './mess-bill.component';

describe('MessBillComponent', () => {
  let component: MessBillComponent;
  let fixture: ComponentFixture<MessBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
