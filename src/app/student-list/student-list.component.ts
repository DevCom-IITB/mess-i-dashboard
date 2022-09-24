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
  // studentImageMap = new Map();
  //studentInfoList_array = [];
  studentInfoList : any;
  temp : any;
  errMsg = "";
  // isImageLoading:any;
  startEntry = 1;
  entriesPerPage = 20;
  totalEntry = 105;
  endEntry = Math.min(this.entriesPerPage,this.totalEntry);
  justAfterScrolling = true;
  
  constructor(private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.justAfterScrolling = true;
    this.getList("new");
    this.updateNav.emit();
  }
   

  async getList(tempNext : any){

      this.service.getStudentList(tempNext).then((res)=>{
        
          this.temp = res;
          console.log(this.temp)
          this.studentInfoList = Object.entries(this.temp);
      }).catch((res)=>{
        this.errMsg = res
      })
    }

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
      }
    }
  }

  async nextEntries(){ //add an argument of pageNumber and pass to to the api to get the corresponding list of students
    //update the page number and the studInfoList 
    if (this.endEntry  < this.totalEntry) {
      // this.startEntry += this.entriesPerPage; 
      // this.endEntry += Math.min(this.entriesPerPage, this.totalEntry - this.endEntry);
      this.getList("next"); 
    }
  }

  async prevEntries(){
    if (this.startEntry > 0) {
      // this.endEntry -= this.entriesPerPage; 
      // this.startEntry -= Math.min(this.startEntry, this.entriesPerPage);
      this.getList("new");
    }
  }

  displayStudData(rollNum:any) {
    console.log(rollNum)  
  }



//Image Stuff

//this function pushes the list of images for the corresponding students in the list studentImage
//it is called every time a get request is made to get the list of students.
// async makeImageList(){
//   for(let stud of this.studentInfoList){
//     //console.log(stud);
//     this.getImageFromService(stud[0]);
//   }  
// }

// async getImageFromService(roll: any) {
//   this.isImageLoading = true;
//   this.service.getImage(roll).subscribe(data => {
//     this.createImageFromBlob(data,roll);
//     this.isImageLoading = false;
//   }, error => {
//     this.isImageLoading = false;
//     console.log(error);
//   });
// }
// async createImageFromBlob(image: Blob,roll:any) {
//     let reader = new FileReader();
//     reader.addEventListener("load", () => {
//       this.studentImageMap.set(roll,reader.result);//push the image in an array the time of initial get req
//     }, false);
  
//     if (image) {
//         reader.readAsDataURL(image);
//     }
//   }


//scrolling handler  

  // multiple_scroll(){
  //   this.justAfterScrolling = true;
  //   console.log("multiplescroll")
  // }


  
  // @HostListener("window:scroll", [])
  // onScroll(): void {
   
  // if (((window.innerHeight + window.scrollY ) >= document.body.offsetHeight) && this.justAfterScrolling) {
  //       // you're at the bottom of the page
  //       // this.getList("old");
  //       console.log("we reach bottom")
  //       this.justAfterScrolling = false; 

  //       setTimeout(()=>{ this.multiple_scroll(); },500);


  //   }
  // }  
}


