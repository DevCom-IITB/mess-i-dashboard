import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import {StudentdataService} from 'src/app/studentdata.service'
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  @Output("UpdateNav") updateNav :EventEmitter<any> = new EventEmitter();
  studentImageMap = new Map();
  //studentInfoList_array = [];
  studentInfoList : any;
  temp : any;
  errMsg = "";
  isImageLoading:any;

  justAfterScrolling = true;
  
  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    //ithis.checkFucn();
    this.justAfterScrolling = true;
    this.getList("new");
    this.updateNav.emit();
    // console.log(this.updateNav)
  }
   

async getList(tempNext : any){

    this.service.getStudentList(tempNext).then((res)=>{
      
        this.temp = res;
        if(tempNext == "new"){
          this.studentInfoList = ( Object.entries(this.temp)); //added an append
        }
        else{
          this.studentInfoList = this.studentInfoList.concat( Object.entries(this.temp));
        }
        //console.log(res); 
        this.makeImageList();
        
        //console.log(this.studentImageMap);
    }).catch((res)=>{
      this.errMsg = res
    })
  }

//async checkFucn(){
//  console.log("i was called")
//}

 toggl(currStudRoll:any){
   console.log("click")
   let res = this.service.togglActive(currStudRoll)
   if (res){
     this.changeMessStatus(currStudRoll);
   }
  }

async changeMessStatus(rollNumber:any){

  for (let index = 0; index < this.studentInfoList.length; index++) {
    if (this.studentInfoList[index][0] == rollNumber) {
      this.studentInfoList[index][1].mess_allowed = !this.studentInfoList[index][1].mess_allowed;
      //console.log(rollNumber);
      //console.log("changed mess status");

    }
  }
}




//Image Stuff

//this function pushes the list of images for the corresponding students in the list studentImage
//it is called every time a get request is made to get the list of students.
async makeImageList(){
  for(let stud of this.studentInfoList){
    //console.log(stud);
    this.getImageFromService(stud[0]);
  }  
}

async getImageFromService(roll: any) {
  this.isImageLoading = true;
  this.service.getImage(roll).subscribe(data => {
    this.createImageFromBlob(data,roll);
    this.isImageLoading = false;
  }, error => {
    this.isImageLoading = false;
    console.log(error);
  });
}
async createImageFromBlob(image: Blob,roll:any) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.studentImageMap.set(roll,reader.result);//push the image in an array the time of initial get req
    }, false);
  
    if (image) {
        reader.readAsDataURL(image);
    }
  }


  

  multiple_scroll(){
    this.justAfterScrolling = true;
    console.log("multiplescroll")
  }


  
  @HostListener("window:scroll", [])
  onScroll(): void {
    
  if (((window.innerHeight + window.scrollY ) >= document.body.offsetHeight) && this.justAfterScrolling) {
        // you're at the bottom of the page
        this.getList("old");
        console.log("we reach bottom")
        this.justAfterScrolling = false; 

        setTimeout(()=>{ this.multiple_scroll(); },500);


    }
}  
}


