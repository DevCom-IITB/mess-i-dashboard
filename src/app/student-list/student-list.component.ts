import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import {StudentdataService} from 'src/app/studentdata.service'
import { AuthService } from '../auth.service';
import { StateService } from '../state.service';
import { Router } from '@angular/router';
//import { analyzeAndValidateNgModules } from '@angular/compiler';  #upgrading from angular 12->13, this command gives error while running the server(probably deprecated) 
import { HostListener } from '@angular/core';
import { Student } from '../interfaces';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
  entriesPerPage = 9;
  searchText = this.stateService.SearchText;
  totalEntry = 105;
  entryNumber = 1;
  justAfterScrolling = true;
  subject = new Subject();
  
  constructor(private stateService: StateService,private service:StudentdataService,private auth:AuthService, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
  }

  ngOnInit(): void {
    this.justAfterScrolling = true;
    this.getList(this.entryNumber);
    this.updateNav.emit();
    this.subject.pipe(debounceTime(1000)).subscribe((val)=>{
      this.getList(1);
    });
  }
  
  search(evt:any){
    const phrase = evt.target.value;
    this.searchText = phrase;
    this.subject.next(phrase);

  }

  async getList(startIndex : any){
    this.stateService.SearchText =this.searchText;
      this.service.getStudentList(startIndex,this.searchText,this.entriesPerPage).then((res)=>{
        
          this.temp = res;
          // console.log(this.temp)
          this.studentInfoList = Object.entries(this.temp);
      }).catch((res)=>{
        this.errMsg = res
    })
  }

  async nextEntries(){ //add an argument of pageNumber and pass to to the api to get the corresponding list of students
    //update the page number and the studInfoList 
      // this.startEntry += this.entriesPerPage; 
      // this.endEntry += Math.min(this.entriesPerPage, this.totalEntry - this.endEntry);
    // if(this.entryNumber+this.entriesPerPage>this.totalEntry) return;
    this.entryNumber += this.entriesPerPage;
    this.getList(this.entryNumber); 
  }

  async prevEntries(){
      // this.endEntry -= this.entriesPerPage; 
      // this.startEntry -= Math.min(this.startEntry, this.entriesPerPage);
    if(this.entryNumber==1) return;
    this.entryNumber -= this.entriesPerPage;
    this.getList(this.entryNumber);
  }

  displayStudData(indexOfStudent:any) {
    // console.log(this.studentInfoList[indexOfStudent]);
    var temp_student = {
      id: this.studentInfoList[indexOfStudent][0],
      name: this.studentInfoList[indexOfStudent][1].fullname,
      hostel: this.studentInfoList[indexOfStudent][1].hostel,
      room: this.studentInfoList[indexOfStudent][1].room,
      card_status: this.studentInfoList[indexOfStudent][1].mess_allowed
    } as Student;
    this.service.put_student_in_cache(temp_student);
    this.router.navigate(['/studentcard'],{queryParams: {rollNum:this.studentInfoList[indexOfStudent][0]}})
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


