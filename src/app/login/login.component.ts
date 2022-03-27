import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
      this.router.navigate([''])
    }
    this.route.queryParams
      .subscribe(params => {
        if(params.code){
          this.auth.loginUser(params.code);
        } 
        console.log(params.code);
      }
    );
    this.loginHref = `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=1dE3mAQY7EvCjw5IdHgoNtbutjgZy14CyIsWKRK8&response_type=code&scope=basic profile program ldap&redirect_uri=http://localhost:4200/login`;
    
  }

}

