import { TestBed } from '@angular/core/testing';

import { MessmenuService } from './messmenu.service';

describe('MessmenuService', () => {
  let service: MessmenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessmenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload menu from file', () => {
    const hostel = 'H1';
    const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    expect(service.uploadMenuFromFile(hostel, file)).toBeTruthy();
  });

  it('should upload menu from Google Sheet', () => {
    const hostel = 'H1';
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/test';
    
    expect(service.uploadMenuFromGoogleSheet(hostel, sheetUrl)).toBeTruthy();
  });

  it('should get mess menu', () => {
    const hostel = 'H1';
    const date = '2026-03-18';
    
    expect(service.getMessMenu(hostel, date)).toBeTruthy();
  });

  it('should delete mess menu', () => {
    const hostel = 'H1';
    const date = '2026-03-18';
    
    expect(service.deleteMessMenu(hostel, date)).toBeTruthy();
  });

  it('should get all mess menus for hostel', () => {
    const hostel = 'H1';
    
    expect(service.getAllMessMenus(hostel)).toBeTruthy();
  });
});
