import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { StuRebateDialogComponent } from '../components/stu-rebate-dialog/stu-rebate-dialog.component';
import { RebateRequest } from '../interfaces';
import { StudentdataService } from '../studentdata.service';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-rebate-admin',
  templateUrl: './rebate-admin.component.html',
  styleUrls: ['./rebate-admin.component.css']
})
export class RebateAdminComponent implements OnInit {

  pending_rebates: RebateRequest[] = new Array();
  accepted_rebates: RebateRequest[] = new Array();
  rejected_rebates: RebateRequest[] = new Array();
  CSV_fields : string[] = ["id","roll","start", "end", "rebate_docname","official","comment","reason","request_date"];
  includeCSV:boolean = true;

  constructor(private data_service:StudentdataService,private auth:AuthService,private dialog:MatDialog, private router:Router) {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['login'])
    }
   }

  ngOnInit(): void {
    this.initialise();
  }

  openDialog(roll:any) :void {
    console.log(roll)
    this.dialog.open(StuRebateDialogComponent,{
    data:{
      roll: roll
        }
    })
    // this.data_service.getAdminRebatesRoll(roll).then((res:any) => {
    //     this.dialog.open(StuRebateDialogComponent,{
    //     data:{accepted_rebates : res.accepted_rebate,
    //           rejected_rebates: res.rejected_rebate,
    //           pendeing_rebates: res.pending_rebate}
    // })
    // }).catch((e)=>
    // console.log(e))

  }
  
  setDialogValues(rebates:any) :void{
    const dialogRef = this.dialog.open(StuRebateDialogComponent,{
      // height:'3232px',
      // width:'5000px',
      data:{accepted_rebates : rebates}
    })
  }

  async getStudentRebates(roll:any,rebates: any){
    await this.data_service.getAdminRebatesRoll(roll).then((res:any) => {
      rebates = (res.pending_rebate);
    }).catch((e)=>
    console.log(e))
  }

  getRebates = () => this.data_service.getStudentRebates();

  async initialise(){
    this.data_service.getAdminRebates().then((res)=>{
      this.populateRebates(res);
      // console.log(res)
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      // console.log(e);
    });
  }




  updateList(rebateID: any){
    window.location.reload();
  }

  populateRebates(response: any): void{
    this.pending_rebates = response.pending_rebate;
    this.accepted_rebates = response.accepted_rebate;
    this.rejected_rebates = response.rejected_rebate;
    // console.log(this.pending_rebates)
  }

  async initialiseWithFilter(event:any){

    this.getRebates().then((res)=>{
      this.populateRebatesMonthFilter(res,event[0],event[1],event[2]);
    }).catch((e)=>{
      //FIXME: Remove the console log, maybe log somewhere else
      console.log(e);
    });
  }

  // updateList(rebateID: any){
  //   this.pending_rebates = this.pending_rebates.filter((reb) =>{
  //     return reb.id != rebateID;
  //   })
  // }
  
  // populateRebates(response: any): void{
  //   this.pending_rebates = response.pending_rebate;
  //   this.accepted_rebates = response.accepted_rebate;
  //   // console.log(this.accepted_rebates);
  //   this.rejected_rebates = response.rejected_rebate;
  // }

  // populateRebatesMonthFilter(start:Date,end:Date): void{
  checkFilterOnRebate(from_date:Date,to_date:Date,official:boolean,elem:RebateRequest): boolean{
    var start_date = elem.start.split('-')
    var elem_date = new Date(parseInt(start_date[2],10),parseInt(start_date[1],10),parseInt(start_date[0],10))
    // console.log(elem.official)
    if(isNaN(from_date.getDate()) && isNaN(to_date.getDate())){
      if (official) {
        if(elem.official){
          return true
        }
      } 
      // else if(!official)
      // else if()
      else if(!official){
        if(elem.official == undefined || elem.official == false){
          return true;
        }
        return false
      }
      
      return false
    }

    else{
      if(official){
        if(elem_date >= from_date && elem_date <= to_date && elem.official){
          return true
        }
      }

      else if(!official){
        if(elem_date >= from_date && elem_date <= to_date && (elem.official == undefined || !elem.official)){
          return true
        }
      }


      else if(elem_date >= from_date && elem_date <= to_date){
        return true
      }

      return false
    }
  }

  filterRebates(res:any,arr:any,from_date:Date,to_date:Date,official:boolean){ 
    for(let elem of res){
      if(this.checkFilterOnRebate(from_date,to_date,official,elem)){
        arr.push(elem)
      }
    }
  }
 populateRebatesMonthFilter(res:any,from_filter:string,to_filter:string, official:boolean): void{
    var from_date = new Date(Date.parse(from_filter))
    var to_date = new Date(Date.parse(to_filter))
    this.pending_rebates.splice(0,this.pending_rebates.length)
    this.accepted_rebates.splice(0,this.accepted_rebates.length)
    this.rejected_rebates.splice(0,this.rejected_rebates.length)
    this.filterRebates(res.accepted_rebate,this.accepted_rebates,from_date,to_date,official);
    this.filterRebates(res.pending_rebate,this.pending_rebates,from_date,to_date,official);
    this.filterRebates(res.rejected_rebate,this.rejected_rebates,from_date,to_date,official);

  }

  get_entry_in_request(req:RebateRequest,key:String){
    switch(key) { 
      case "id": { 
        return req.id
         break; 
      } 
      case "roll": { 
        return req.roll
         break; 
      } 
      case "start": { 
        return req.start
         break; 
      } 
      case "end": { 
        return req.end
         break; 
      } 
      case "request_date": { 
        return req.request_date.replace(","," ")
         break; 
      } 
      case "reason": { 
        return req.reason
         break; 
      } 
      case "comment": { 
        return req.comment.replace(","," ")
        // return req.comment
         break; 
      } 
      case "official": { 
        return req.official
         break; 
      } 
      case "rebate_docname": { 
        return req.rebate_docname
         break; 
      } 
      default: { 
        return "wrong key"
         break; 
      } 
   } 
  }

  append_data_in_dict(data_dict:any,arr:RebateRequest[],type:string){
    // for(let req in arr){
      arr.forEach(req => {
        this.CSV_fields.forEach((key) =>
        {
          // req.__d
          try{
          data_dict["type"].push(type)
          try{
            // print(req)
            // console.log(key)
            // console.log(this.get_entry_in_request(req,key))
            
            data_dict[key].push(this.get_entry_in_request(req,key))
          }catch{
            data_dict[key].push(" ")
          }

          }catch{
            console.log(key)
          }
      
        });

      })
      // console.log(data_dict)
      // for(let key in this.CSV_fields)
  }

  downloadCSV(){
    // https://stackoverflow.com/questions/51487689/angular-5-how-to-export-data-to-csv-file
    
    var data_dict = {
      "id":[],
      "start":[],
      "end":[],
      "reason":[],
      "type":[],
      "request_date":[],
      "roll":[],
      "rebate_docame":[],
      "comment":[],
      "official":[]
      
    }

    this.append_data_in_dict(data_dict,this.rejected_rebates,"rejected")
    this.append_data_in_dict(data_dict,this.pending_rebates,"pending")
    this.append_data_in_dict(data_dict,this.accepted_rebates,"accepted")
    console.log(this.rejected_rebates)

    let csvList = []
    // Object.keys(data_dict).forEach(([key,value]) => {
      // ;
    // });
    csvList.push(Object.keys(data_dict).join(",")) 
    for(var i=0; i<data_dict["id"].length; i++){
      var temp = "";
      // });
      for(let [key,value] of Object.entries(data_dict)){
        temp = temp + value[i] + "," ;
      }
      csvList.push(temp.slice(0,temp.length -1 ));

    }

    let csv = csvList.join("\n");
    // let csv = [for(var i=0; i<data_dict["id"].length(); i++) ].join('\n')

    console.log(csv);
    var blob = new Blob([csv],{type:'text/csv'})
    saveAs(blob,"myfile.csv")

  }

  submit() {
    console.log("submit")
  }
  reset() {
    console.log("reset")
  }
}
