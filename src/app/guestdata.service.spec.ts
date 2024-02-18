import { TestBed } from '@angular/core/testing';

import { GuestdataService } from './guestdata.service';

describe('GuestdataService', () => {
  let service: GuestdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuestdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
