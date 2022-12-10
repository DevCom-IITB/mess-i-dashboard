import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuRebateDialogComponent } from './stu-rebate-dialog.component';

describe('StuRebateDialogComponent', () => {
  let component: StuRebateDialogComponent;
  let fixture: ComponentFixture<StuRebateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StuRebateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StuRebateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
