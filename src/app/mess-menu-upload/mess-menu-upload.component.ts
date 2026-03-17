import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { StudentdataService } from '../studentdata.service';
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
  menus: any[] = [];
  hostels: string[] = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18', 'H19', 'H20']; // TODO: Update with actual hostel list or fetch from API
  isManager: boolean = false;
  userHostel: string = '';
  hostel_selectable: boolean = false;
  allowedHostels: boolean[] = new Array<boolean>(22);
  date = new Date();
  messHistory: any = { exists: true, loaded: false };
  uploadType: string = '';
  sheetUrl: string = '';

  constructor(
    public auth_service: AuthService,
    public router: Router,
    private data_service: StudentdataService,
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

  // TODO: Implement file upload logic 
  // TODO: Add file validation and error handling
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file);
    }
  }

  onUpload(): void {
    this.snackBar.open('Successful', 'Close', { 
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }}