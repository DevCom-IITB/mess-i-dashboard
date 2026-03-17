import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessmenuService {
  baseurl = environment.backendURL + "/api";

  constructor(private http: HttpClient, private auth: AuthService) { }

  /**
   * Upload mess menu from Excel file
   * @param hostel Hostel name (e.g., 'H1', 'H2', 'TANSA')
   * @param file Excel file to upload
   * @returns Promise with upload response
   */
  uploadMenuFromFile(hostel: string, file: File): Promise<any> {
    let url = this.baseurl.concat("/upload-mess-menu");
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
    let url = this.baseurl.concat("/upload-mess-menu");
    const payload = {
      hostel: hostel,
      type: 'google_sheet',
      sheetUrl: sheetUrl
    };

    return new Promise((resolve, reject) => {
      this.http.post(url, payload, {
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
   * Get mess menu for a specific hostel and date
   * @param hostel Hostel name
   * @param date Date in format YYYY-MM-DD
   * @returns Promise with mess menu data
   */
//   getMessMenu(hostel: string, date: string): Promise<any> {
//     let url = this.baseurl.concat("/get-mess-menu/", hostel, "/", date);

//     return new Promise((resolve, reject) => {
//       this.http.get(url, {
//         headers: {
//           'x-access-token': this.auth.getToken()
//         },
//         withCredentials: true
//       }).subscribe(
//         (res: any) => resolve(res),
//         (err) => reject(err)
//       );
//     });
//   }

  /**
   * Delete mess menu for a specific hostel and date
   * @param hostel Hostel name
   * @param date Date in format YYYY-MM-DD
   * @returns Promise with delete response
   */
//   deleteMessMenu(hostel: string, date: string): Promise<any> {
//     let url = this.baseurl.concat("/delete-mess-menu/", hostel, "/", date);

//     return new Promise((resolve, reject) => {
//       this.http.delete(url, {
//         headers: {
//           'x-access-token': this.auth.getToken()
//         },
//         withCredentials: true
//       }).subscribe(
//         (res: any) => resolve(res),
//         (err) => reject(err)
//       );
//     });
//   }

  /**
   * Get all mess menus for a hostel
   * @param hostel Hostel name
   * @returns Promise with array of mess menus
   */
//   getAllMessMenus(hostel: string): Promise<any> {
//     let url = this.baseurl.concat("/get-all-mess-menus/", hostel);

//     return new Promise((resolve, reject) => {
//       this.http.get(url, {
//         headers: {
//           'x-access-token': this.auth.getToken()
//         },
//         withCredentials: true
//       }).subscribe(
//         (res: any) => resolve(res),
//         (err) => reject(err)
//       );
    // });
//   }
}
