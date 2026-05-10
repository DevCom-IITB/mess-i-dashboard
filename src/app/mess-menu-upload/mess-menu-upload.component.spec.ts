import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessMenuUploadComponent } from './mess-menu-upload.component';

describe('MessMenuUploadComponent', () => {
  let component: MessMenuUploadComponent;
  let fixture: ComponentFixture<MessMenuUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessMenuUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessMenuUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
