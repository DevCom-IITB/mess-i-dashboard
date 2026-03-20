import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { StudentdataService } from '../studentdata.service';
import { MessmenuService } from '../messmenu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mess-menu-upload',
  templateUrl: './mess-menu-upload.component.html',
  styleUrls: ['./mess-menu-upload.component.css']
})
export class MessMenuUploadComponent implements OnInit {
  app_bar_suffix: string = "Mess Menu Upload";
  uploadForm: FormGroup;
  isManager: boolean = false;
  userHostel: string = '';
  hostel_selectable: boolean = false;
  allowedHostels: boolean[] = new Array<boolean>(22);
  date = new Date();
  messHistory: any = { exists: true, loaded: false };
  uploadType: string = '';
  sheetUrl: string = '';
  selectedFile: File | null = null;
  selectedHostel: string = '';
  menu_id: string = '';

  constructor(
    public auth_service: AuthService,
    public router: Router,
    private data_service: StudentdataService,
    private messmenu_service: MessmenuService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    if (!this.auth_service.isLoggedIn() || !this.auth_service.isStaff()) {
      this.router.navigate(['login']);
    }

    // TODO: Implement auto hostel fetching logic based on user role
  }

  ngOnInit(): void {
    this.hostel_selectable = this.auth_service.isAdmin();
    this.getAdminHostel();
  }

  getAdminHostel() {
    this.data_service.getAdminHostels().then((res: any) => {
      for (let i = 1; i < this.allowedHostels.length; i++) {
        this.allowedHostels[i] = false;
        if (res.includes(`H${i}`)) {
          this.allowedHostels[i] = true;
        }
        if (res.includes("TANSA")) {
          this.allowedHostels[21] = true;
        }
      }
    }).catch((res) => {
      console.log(res);
      this.messHistory = { exists: false, loaded: true };
    });
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
    }else if (this.uploadType === 'google_sheet') {
      if (!this.sheetUrl || this.sheetUrl.trim() === '') {
        this.errorPopup('Please enter a Google Sheet URL');
        return;
      }
    }

    // Proceeding with upload
    if (this.uploadType === 'excel' && this.selectedFile) {
      this.messmenu_service.uploadMenuFromFile(this.selectedHostel, this.selectedFile)
        .then((res: any) => {
          console.log(res);
          this.menu_id = res.menu_id;

          this.successPopup('Upload Successful. Processing will begin soon.');
          this.resetForm();
        })
        .catch((err: any) => this.handleError(err, 'Upload'));
    } else if (this.uploadType === 'google_sheet') {

      this.messmenu_service.uploadMenuFromGoogleSheet(this.selectedHostel, this.sheetUrl)
        .then((res: any) => {
          console.log(res);
          this.menu_id = res.menu_id;

          this.successPopup('Upload Successful. Processing will begin soon.');
          this.resetForm();
        })
        .catch((err: any) => this.handleError(err, 'Upload'));
    }
  }

  onApproval(): void {
    if (!this.menu_id) {
      this.errorPopup('No menu to approve. Please upload a menu first.');
      return;
    }

    this.messmenu_service.approveMenu(this.menu_id)
      .then((res: any) => {
        console.log(res);

        this.successPopup('Approval Successful.');
        this.resetForm();
      })
      .catch((err: any) => this.handleError(err, 'Approval'));
  }

  onRejection(): void {
    if (!this.menu_id) {
      this.errorPopup('No menu to reject. Please upload a menu first.');
      return;
    }

    this.messmenu_service.rejectMenu(this.menu_id)
      .then((res: any) => {
        console.log(res);

        this.successPopup('Rejection Successful.');
        this.resetForm();
      })
      .catch((err: any) => this.handleError(err, 'Rejection'));
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
    this.selectedHostel = '';
    this.uploadType = '';
    this.selectedFile = null;
    this.sheetUrl = '';
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