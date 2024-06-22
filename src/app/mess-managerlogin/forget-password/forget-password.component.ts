import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  public getJsonValue: any;
  public postJsonValue: any;
  public putJsonValue: any;
  constructor(private http: HttpClient, private fb: FormBuilder, private authService: AuthService) { }

  forgetForm: FormGroup;
  error: any = null;
  success: boolean = false;

  ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onForgetSubmit(email:any) {
    this.authService.forgetPassword(email).subscribe(
        (res) => {
          console.log(res);
          this.success = true;
        },
        (err) => {
          console.log(err);
          this.error = err;
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
