import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuRebCardComponent } from './stu-reb-card.component';

describe('StuRebCardComponent', () => {
  let component: StuRebCardComponent;
  let fixture: ComponentFixture<StuRebCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StuRebCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StuRebCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
