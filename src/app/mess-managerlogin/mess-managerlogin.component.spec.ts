import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessManagerloginComponent } from './mess-managerlogin.component';

describe('MessManagerloginComponent', () => {
  let component: MessManagerloginComponent;
  let fixture: ComponentFixture<MessManagerloginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessManagerloginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessManagerloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
