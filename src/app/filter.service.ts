import { Injectable } from '@angular/core';
import { Input } from '@angular/core';
import { RebateRequest } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  // @Input() getRebates: () => Promise<unknown>;
  CSV_fields : string[] = ["fullname","room","id","roll","start", "end", "rebate_docname","official","comment","reason","request_date"];
  constructor() { }


  booleanify (value?: any): boolean{
    const truthy: string[] = [
        'true',
        'True',
        '1',
    ]
    if(typeof(value) == "boolean"){
      return value;
    }

    if(typeof(value) == "string"){
      if (value!=undefined){
        return truthy.includes(value)
      }
      return false
    }
    return false
  }
  // populateRebatesMonthFilter(start:Date,end:Date): void{
  checkFilterOnRebate(from_date:Date,to_date:Date,official:boolean,elem:RebateRequest): boolean{
    var start_date = elem.start.split('-')
    var end_date = elem.end.split('-')
    var elem_date = new Date(parseInt(start_date[2],10),parseInt(start_date[1],10)-1,parseInt(start_date[0],10))
    var elem_date_end = new Date(parseInt(end_date[2],10),parseInt(end_date[1],10)-1,parseInt(end_date[0],10))
    if(isNaN(from_date.getDate()) && isNaN(to_date.getDate())){
      if (official) {
        if(this.booleanify(elem.official)){
          return true
        }
      } 
      else if(!official){
        // console.log("this is the date filter official",official)
        // console.log(elem.comment)
        // console.log("this is the string official",(elem.official))
        // console.log(this.booleanify(elem.official))
        if(!this.booleanify(elem.official)){
          return true;
        }
        return false
      }
      
      return false
    }

    else{
      if(official){
        if(((elem_date.getTime() >= from_date.getTime() && elem_date.getTime() <= to_date.getTime()) ||(elem_date_end.getTime() >= from_date.getTime() && elem_date_end.getTime() <= to_date.getTime())) && this.booleanify(elem.official)){
          return true
        }
      }

      else if(!official){
        if(((elem_date.getTime() >= from_date.getTime() && elem_date.getTime() <= to_date.getTime()) ||(elem_date_end.getTime() >= from_date.getTime() && elem_date_end.getTime() <= to_date.getTime())) && (elem.official == undefined || !this.booleanify(elem.official))){
          return true
        }
      }


      else if(((elem_date.getTime() >= from_date.getTime() && elem_date.getTime() <= to_date.getTime()) ||(elem_date_end.getTime() >= from_date.getTime() && elem_date_end.getTime() <= to_date.getTime()))){
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
 populateRebatesMonthFilter(res:any,from_filter:string,to_filter:string, official:boolean,rebates : {pending_rebates:RebateRequest[],accepted_rebates:RebateRequest[],rejected_rebates:RebateRequest[]}): void{
    var from_date = new Date(Date.parse(from_filter))
    var to_date = new Date(Date.parse(to_filter))
    rebates.pending_rebates.splice(0,rebates.pending_rebates.length)
    rebates.accepted_rebates.splice(0,rebates.accepted_rebates.length)
    rebates.rejected_rebates.splice(0,rebates.rejected_rebates.length)
    this.filterRebates(res.accepted_rebate,rebates.accepted_rebates,from_date,to_date,official);
    this.filterRebates(res.pending_rebate,rebates.pending_rebates,from_date,to_date,official);
    this.filterRebates(res.rejected_rebate,rebates.rejected_rebates,from_date,to_date,official);

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
      case "room": {
        var temp = req.room;
        if (temp.startsWith("-")){
          temp = temp.substring(1,temp.length)
        }
        return temp
        
      }
      case "fullname": {
        return req.fullname
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
          data_dict["type"].push(type)
        this.CSV_fields.forEach((key) =>
        {
          try{
            
            data_dict[key].push(this.get_entry_in_request(req,key))
          }catch{
            data_dict[key].push(" ")
          }

      
        });

      })
      // console.log(data_dict)
      // for(let key in this.CSV_fields)
  }

  makeCSV(rebates : {pending_rebates:RebateRequest[],accepted_rebates:RebateRequest[],rejected_rebates:RebateRequest[]}){
    // https://stackoverflow.com/questions/51487689/angular-5-how-to-export-data-to-csv-file
    
    var data_dict = {
      "fullname":[],
      "room":[],
      "id":[],
      "start":[],
      "end":[],
      "reason":[],
      "type":[],
      "request_date":[],
      "roll":[],
      "rebate_docname":[],
      "comment":[],
      "official":[],
    }

    this.append_data_in_dict(data_dict,rebates.rejected_rebates,"rejected")
    this.append_data_in_dict(data_dict,rebates.pending_rebates,"pending")
    this.append_data_in_dict(data_dict,rebates.accepted_rebates,"accepted")
    // console.log(this.rejected_rebates)

    let csvList = []
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
    return csv;

  }
}
