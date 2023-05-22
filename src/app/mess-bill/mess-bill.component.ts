import { Component, OnInit } from '@angular/core';
import { StudentdataService } from '../studentdata.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mess-bill',
  templateUrl: './mess-bill.component.html',
  styleUrls: ['./mess-bill.component.css']
})
export class MessBillComponent implements OnInit {

  render_form : boolean;
  form_gen_data: any;
  date = new Date()
  // constructor(private service) {
  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
    this.render_form = false
   }

  ngOnInit(): void {
  }

  async renderForm(data:any){
    // console.log(data)
    let num =  new Date(parseInt(data.form.value.year), parseInt(data.form.value.month), 0).getDate();
    // console.log(num)

    this.form_gen_data = {
      headers: ["Day","Cost Per Day"],
      numOfDays: num,
      month: data.form.value.month
    }

    this.render_form = true;
  }
  
}
