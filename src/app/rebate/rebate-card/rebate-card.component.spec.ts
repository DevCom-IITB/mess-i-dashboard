import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateCardComponent } from './rebate-card.component';

describe('RebateCardComponent', () => {
  let component: RebateCardComponent;
  let fixture: ComponentFixture<RebateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebateCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
