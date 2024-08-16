import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  public getJsonValue: any;
  public postJsonValue: any;
  public putJsonValue: any;
  constructor(private http: HttpClient, private fb: FormBuilder, private authService: AuthService , private router : Router) { }

  forgetForm: FormGroup;
  error: any = null;
  success: boolean = false;

  ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onForgetSubmit(username:any) {
    this.authService.forgetPassword(username).subscribe(
        (res) => {
          console.log(res);
          this.success = true;
          alert('New password sent to registerd email successfully!');
          this.router.navigate(['/mess-manager']);
        },
        (err) => {
          console.log(err);
          this.error = err;
          let errorMessage = 'An error occurred while sending the password reset email. Please try again later.';
          if (err.status === 400) {
            errorMessage = 'Invalid email address. Please check the email address and try again.';
          } else if (err.status === 404) {
            errorMessage = 'Email address not found. Please check the email address and try again.';
          } else if (err.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          }
          alert(errorMessage);
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });;
        }
      );
    // if (this.forgetForm.valid) { 
    // } else {
    //   Object.keys(this.forgetForm.controls).forEach(key => {
    //     const control = this.forgetForm.controls[key];
    //     if (control.errors != null) {
    //       control.markAsTouched();
    //     }
    //   });
    // }
  }
  // Add comments or section headers here if needed
}
