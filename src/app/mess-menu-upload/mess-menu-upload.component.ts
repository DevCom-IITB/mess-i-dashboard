import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessmenuService } from '../messmenu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-mess-menu-upload',
  templateUrl: './mess-menu-upload.component.html',
  styleUrls: ['./mess-menu-upload.component.css']
})
export class MessMenuUploadComponent implements OnInit {
  app_bar_suffix: string = "Mess Menu Upload";
  environment = environment;
  uploadForm: FormGroup;
  isManager: boolean = false;
  userHostel: string = '';
  allowedHostels: boolean[] = new Array<boolean>(22);
  date = new Date();
  messHistory: any = { exists: true, loaded: false };
  uploadType: string = 'excel';
  sheetUrl: string = '';
  selectedFile: File | null = null;
  sheetNames: string[] = [];
  selectedSheet: string = '';
  selectedHostel: string = '';
  menuID: string = '';
  parsedMenuData: any; //TODO: Shouldnt be any
  isApproving: boolean = false;
  isRejecting: boolean = false;
  isUploading: boolean = false;
  isUserAdmin: boolean = false;

  constructor(
    public auth_service: AuthService,
    public router: Router,
    private messmenu_service: MessmenuService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    if (!this.auth_service.isLoggedIn() || !this.auth_service.isStaff()) {
      this.router.navigate(['login']);
    }
    this.isUserAdmin = this.auth_service.isAdmin();

    // TODO: Implement auto hostel fetching logic based on user role
  }

  ngOnInit(): void {
    this.getHostelandSheet();
  }

  getHostelandSheet() {
    if (this.isUserAdmin) {
      this.messmenu_service.getMessList().then((res: any) => {
        this.allowedHostels = res;
        this.selectedHostel = ''; // Default to empty for admin
      }).catch((res) => {
        console.log(res);
        this.errorPopup('Unable to fetch mess list. Please try again.');
      });
    } else {
      this.messmenu_service.getHostelInfo().then((res: any) => {
        const hostel = res?.hostel || '';
        this.userHostel = hostel;
        this.selectedHostel = hostel;
        this.sheetUrl = res.sheetUrl;
      }).catch((res) => {
        console.log(res);
        this.messHistory = { exists: false, loaded: true };
        this.errorPopup('Unable to fetch your hostel. Please try again.');
      });
    }
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    
    if (!file) {
      this.errorPopup('No file selected');
      return;
    }

    // File type validation
    const allowedExtensions = ['xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      this.selectedFile = null; 
      this.errorPopup('Only .xlsx and .xls files are allowed');
      return;
    }

    // File size validation (max 10MB)
    const maxSizeInMB = 10;
    const fileSizeInMB = file.size / (1024 * 1024);
    
    if (fileSizeInMB > maxSizeInMB) {
      this.selectedFile = null; 
      this.errorPopup(`File size exceeds ${maxSizeInMB}MB limit`);
      return;
    }

    this.selectedFile = file;
    this.sheetNames = [];
    this.selectedSheet = '';
    this.parsedMenuData = null;
    this.successPopup(`File selected: ${file.name}`);
  }


  onUpload(): void {
    if (!this.selectedHostel || this.selectedHostel === '') {
      this.errorPopup('Please select a hostel');
      return;
    }

    if (!this.uploadType || this.uploadType === '') {
      this.errorPopup('Please select an upload type');
      return;
    }

    // Check Excel file
    if (this.uploadType === 'excel') {
      if (!this.selectedFile) {
        this.errorPopup('Please select an Excel file');
        return;
      }
      if (this.sheetNames.length > 0 && !this.selectedSheet) {
        this.errorPopup('Please select a sheet from the dropdown');
        return;
      }
    }
    // else if (this.uploadType === 'google_sheet') {
    //   if (!this.sheetUrl || this.sheetUrl.trim() === '') {
    //     this.errorPopup('Please enter a Google Sheet URL');
    //     return;
    //   }
    // }
     else{
      this.errorPopup('Invalid upload type selected');
    }

    if(this.environment.llmTesting){
      if(this.selectedFile){
        this.isUploading = true;
        this.messmenu_service.uploadMenuFromFileMultipleLLMs(this.selectedHostel, this.selectedFile)
          .then((res: any) => {
            console.log(res);
            this.menuID = res.menuID;
            this.isUploading = false;
            this.successPopup('Upload Successful. Processing will finish soon.');
            this.resetForm();
          })
          .catch((err: any) => {
            this.isUploading = false;
            this.handleError(err, 'Upload');
          });
        }else{
          this.errorPopup('Please select an Excel file');
        }
        return;
    }

    // Proceeding with upload
    if (this.uploadType === 'excel' && this.selectedFile) {
      this.isUploading = true;
      this.messmenu_service.uploadMenuFromFile(this.selectedHostel, this.selectedFile, this.selectedSheet || undefined)
        .then((res: any) => {
          console.log(res);
          if (res.multipleSheets) {
            this.sheetNames = res.sheetNames;
            this.isUploading = false;
            this.successPopup('Multiple sheets found. Please select a sheet and upload again.', 6000);
            return;
          }
          this.menuID = res.menuID;
          this.parsedMenuData = res.menu;
          this.isUploading = false;
          this.successPopup('Upload Successful. Please verify before approval.');
          // this.resetForm(); //Reseting form now only happens after approval
        })
        .catch((err: any) => {
          this.isUploading = false;
          this.handleError(err, 'Upload');
        });
    // } else if (this.uploadType === 'google_sheet') {
    //   this.isUploading = true;
    //   this.messmenu_service.uploadMenuFromGoogleSheet(this.selectedHostel, this.sheetUrl)
    //     .then((res: any) => {
    //       console.log(res);
    //       this.menuID = res.menuID;
    //       this.parsedMenuData = res.menu;
    //       this.isUploading = false;
    //       this.successPopup('Upload Successful. Please verify before approval.');
    //       this.resetForm();
    //     })
    //     .catch((err: any) => {
    //       this.isUploading = false;
    //       this.handleError(err, 'Upload');
    //     });
    }else{
      this.errorPopup('Please select a valid upload type');
    }
  }

  onApproval(): void {
    if (!this.menuID) {
      this.errorPopup('No menu to approve. Please upload a menu first.');
      return;
    }

    this.isApproving = true;
    this.messmenu_service.approveMenu(this.menuID)
      .then((res: any) => {
        console.log(res);
        this.isApproving = false;
        this.successPopup('Approval Successful. Changes will be reflected on InstiApp soon.');
        this.resetForm();
        this.menuID = ''; // Clear menuID afterwardss
      })
      .catch((err: any) => {
        this.isApproving = false;
        this.handleError(err, 'Approval');
      });
  }

  onRejection(): void {
    if (!this.menuID) {
      this.errorPopup('No menu to reject. Please upload a menu first.');
      return;
    }

    this.isRejecting = true;
    this.messmenu_service.rejectMenu(this.menuID)
      .then((res: any) => {
        console.log(res);
        this.isRejecting = false;
        this.successPopup('Rejection Successful.');
        this.resetForm();
        this.menuID = ''; 
      })
      .catch((err: any) => {
        this.isRejecting = false;
        this.handleError(err, 'Rejection');
      });
  }

  private handleError(err: any, action: string): void {
    let errorMessage = 'Unknown error';
    
    if (err.status === 401 || err.status === 403) { 
      errorMessage = 'Unauthorized/Forbidden - Contact admin if you believe this is an error';
    } else if (err.status === 400) {
      errorMessage = err.error?.message || 'Missing required fields';
    } else if (err.error?.message) {
      errorMessage = err.error.message;
    }
    
    this.errorPopup('Upload failed: ' + errorMessage);
  }

  resetForm(): void {
    this.selectedHostel = this.userHostel;
    this.uploadType = 'excel';
    this.selectedFile = null;
    this.sheetNames = [];
    this.selectedSheet = '';
    this.parsedMenuData = null;
  }

  successPopup(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Close', { 
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  errorPopup(message: string, duration: number = 15000): void {
    this.snackBar.open(message, 'Close', { 
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}