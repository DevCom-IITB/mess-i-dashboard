import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessMenuComponent } from './mess-menu.component';

describe('MessMenuComponent', () => {
  let component: MessMenuComponent;
  let fixture: ComponentFixture<MessMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
