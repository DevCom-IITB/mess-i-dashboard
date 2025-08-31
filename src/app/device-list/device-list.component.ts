import { Component, OnInit } from '@angular/core';
import { StudentdataService } from '../studentdata.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent implements OnInit {
    app_bar_suffix : string = "Devices";
    devices:any = [
    // {
    //   hostel: 'Brahmaputra',
    //   id: '001',
    //   sync: '2025-04-22 14:30',
    //   version: '2.1.5',
    //   cards: 42
    // },
    // {
    //   hostel: 'Siang',
    //   id: '002',
    //   sync: '2025-04-22 15:45',
    //   version: '2.1.5',
    //   cards: 37
    // },
    // {
    //   hostel: 'Umiam',
    //   id: '003',
    //   sync: '2025-04-22 10:15',
    //   version: '2.1.4',
    //   cards: 53
    // }];
    ];
  constructor(private data_service:StudentdataService){
  }

  ngOnInit(): void {
    this.populateDevices();
  }

  populateDevices(): void {
    this.data_service.getDevices().then((res:any) => {
      this.devices = res;
      console.log("Devices fetched successfully:", this.devices);
    }).catch((e) => {
      console.error("Error fetching devices:", e);
    });
  }
}
