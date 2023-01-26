import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebateListComponent } from './rebate-list.component';

describe('RebateListComponent', () => {
  let component: RebateListComponent;
  let fixture: ComponentFixture<RebateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RebateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RebateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
