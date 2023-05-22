import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationBoxComponent } from './duration-box.component';

describe('DurationBoxComponent', () => {
  let component: DurationBoxComponent;
  let fixture: ComponentFixture<DurationBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DurationBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
