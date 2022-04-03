import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginHref : string | undefined;

  constructor(private auth:AuthService,private route: ActivatedRoute,private router:Router){}

  ngOnInit(): void {
    if(this.auth.isLoggedIn()){
      this.router.navigate(['student'])
    }
    this.route.queryParams
      .subscribe(params => {
        if(params.code){
          this.auth.loginUser(params.code);
        } 
        console.log(params.code);
      }
    );
    this.loginHref = `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=${environment.clientID}&response_type=code&scope=basic profile program ldap&redirect_uri=${environment.redirectURL}`;
    
  }

}

