import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealCalenderComponent } from './meal-calender.component';

describe('MealCalenderComponent', () => {
  let component: MealCalenderComponent;
  let fixture: ComponentFixture<MealCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MealCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
