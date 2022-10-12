import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdRebateCardComponent } from './pd-rebate-card.component';

describe('PdRebateCardComponent', () => {
  let component: PdRebateCardComponent;
  let fixture: ComponentFixture<PdRebateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdRebateCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdRebateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
