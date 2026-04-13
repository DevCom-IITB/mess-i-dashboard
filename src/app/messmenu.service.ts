import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessmenuService {
  baseurl = environment.backendURL + "/api";

  private isValidGoogleSheetLink(url: string): boolean {
  const pattern = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]+/;
  return pattern.test(url);
}

  constructor(private http: HttpClient, private auth: AuthService) { }

  /**
   * Upload mess menu from Excel file
   * @param hostel Hostel name (e.g., 'H1', 'H2', 'TANSA')
   * @param file Excel file to upload
   * @returns Promise with upload response
   */
  uploadMenuFromFile(hostel: string, file: File, sheetName?: string): Promise<any> {
    let url = this.baseurl.concat("/upload-menu");
    const formData = new FormData();
    formData.append('hostel', hostel);
    formData.append('file', file);
    formData.append('type', 'excel_file');
    if (sheetName) {
      formData.append('sheetName', sheetName);
    }

    return new Promise((resolve, reject) => {
      this.http.post(url, formData, {
        headers: {
          'x-access-token': this.auth.getToken()
        },
        withCredentials: true
      }).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err)
      );
    });
  }
  


  /**
   * Upload mess menu from Excel file for testing to multiple LLMs
   * @param hostel Hostel name (e.g., 'H1', 'H2', 'TANSA')
   * @param file Excel file to upload
   * @returns Promise with upload response
   */
  uploadMenuFromFileMultipleLLMs(hostel: string, file: File): Promise<any> {
    let url = this.baseurl.concat("/upload-menu-llm-testing");
    const formData = new FormData();
    formData.append('hostel', hostel);
    formData.append('file', file);
    formData.append('type', 'excel_file');

    return new Promise((resolve, reject) => {
      this.http.post(url, formData, {
        headers: {
          'x-access-token': this.auth.getToken()
        },
        withCredentials: true
      }).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  /**
   * Upload mess menu from Google Sheet link
   * @param hostel Hostel name (e.g., 'H1', 'H2', 'TANSA')
   * @param sheetUrl Google Sheet URL
   * @returns Promise with upload response
   */
  uploadMenuFromGoogleSheet(hostel: string, sheetUrl: string): Promise<any> {
    if (!this.isValidGoogleSheetLink(sheetUrl)) {
        return Promise.reject("Invalid Google Sheets URL");
    }

    let url = this.baseurl.concat("/upload-menu");
    const formData = new FormData();
    formData.append('hostel', hostel);
    formData.append('sheetUrl', sheetUrl);
    formData.append('type', 'google_sheet');

    return new Promise((resolve, reject) => {
      this.http.post(url, formData, {
        headers: {
          'x-access-token': this.auth.getToken()
        },
        withCredentials: true
      }).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  /**
   * Approve a mess menu
   * @param menuID ID of the menu to approve
   * @returns Promise with approval response
   */
  approveMenu(menuID: string): Promise<any> {
    let url = this.baseurl.concat("/approve-menu/", menuID);
    
    return new Promise((resolve, reject) => {
      this.http.post(url, {}, {
        headers: {
          'x-access-token': this.auth.getToken()
        },
        withCredentials: true
      }).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  /**
   * Reject a mess menu
   * @param menuID ID of the menu to reject
   * @returns Promise with rejection response
   */
  rejectMenu(menuID: string): Promise<any> {
    let url = this.baseurl.concat("/reject-menu/", menuID);
    
    return new Promise((resolve, reject) => {
      this.http.post(url, {}, {
        headers: {
          'x-access-token': this.auth.getToken()
        },
        withCredentials: true
      }).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  /**
   * Get hostel info for the logged-in user
   * @returns Promise with hostel info
   */
  getHostelInfo(): Promise<any> {
    const url = this.baseurl.concat('/get-hostel-info');

    return new Promise((resolve, reject) => {
      this.http.get(url, {
        headers: {
          'x-access-token': this.auth.getToken()
        },
        withCredentials: true
      }).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err)
      );
    });
  }

  /**
   * Get mess list for admin
   * @returns Promise with mess list
   */
  getMessList(): Promise<any> {
    let url = this.baseurl.concat("/mess-list");
    return new Promise((resolve, reject) => {
      this.http.get(url, {
        headers: {
          'x-access-token': this.auth.getToken()
        },
        withCredentials: true
      }).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err)
      );
    });
  }
}
