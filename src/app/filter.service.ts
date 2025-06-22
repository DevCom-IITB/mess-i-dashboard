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

  normalizeToddMMyyyyFormat(dateStr: string): string {
    // Skip if already in DD-MM-YYYY format
    if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return dateStr;
    }
    
    // Handle MM-DD-YYYY format
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[1]}-${parts[0]}-${parts[2]}`;
      }
      return dateStr; 
    } catch (e) {
      console.error("Error normalizing date:", e);
      return dateStr;
    }
  }

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
    const normalizedStart = this.normalizeToddMMyyyyFormat(elem.start);
    const normalizedEnd = this.normalizeToddMMyyyyFormat(elem.end);
    
    var start_date = normalizedStart.split('-')
    var end_date = normalizedEnd.split('-')
    
    var elem_date = new Date(parseInt(start_date[2], 10), parseInt(start_date[1], 10)-1, parseInt(start_date[0], 10))
    var elem_date_end = new Date(parseInt(end_date[2], 10), parseInt(end_date[1], 10)-1, parseInt(end_date[0], 10))
    
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
 populateRebatesMonthFilter(res:any, from_filter:string, to_filter:string, official:boolean, rebates: {pending_rebates:RebateRequest[], accepted_rebates:RebateRequest[], rejected_rebates:RebateRequest[]}) {
  let from_date, to_date;
  try {
    // Parse DD-MM-YYYY format
    const parseDate = (dateStr: string) => {
      if (!dateStr || dateStr === "NONE") return new Date(NaN); 
      
      const parts = dateStr.split('-');
      if (parts.length !== 3) return new Date(NaN);
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    };
    
    from_date = parseDate(from_filter);
    to_date = parseDate(to_filter);
    
    console.log("Parsed filter dates:", {
      fromString: from_filter,
      toString: to_filter,
      fromDate: from_date,
      toDate: to_date
    });    
    // Clear existing arrays
    rebates.pending_rebates.splice(0, rebates.pending_rebates.length);
    rebates.accepted_rebates.splice(0, rebates.accepted_rebates.length);
    rebates.rejected_rebates.splice(0, rebates.rejected_rebates.length);
    
    this.filterRebates(res.accepted_rebate, rebates.accepted_rebates, from_date, to_date, official);
    this.filterRebates(res.pending_rebate, rebates.pending_rebates, from_date, to_date, official);
    this.filterRebates(res.rejected_rebate, rebates.rejected_rebates, from_date, to_date, official);
    
  } catch (e) {
    console.error("Error parsing dates for filter:", e);
  }
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
        const requestDate = req.request_date.replace(",", " ");
        return this.normalizeToddMMyyyyFormat(requestDate);
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
