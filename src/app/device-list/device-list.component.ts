import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.css'
})
export class DeviceListComponent implements OnInit {
    app_bar_suffix : string = "Devices";
    devices:any = [
    {
      hostel: 'Brahmaputra',
      id: '001',
      sync: '2025-04-22 14:30',
      version: '2.1.5',
      cards: 42
    },
    {
      hostel: 'Siang',
      id: '002',
      sync: '2025-04-22 15:45',
      version: '2.1.5',
      cards: 37
    },
    {
      hostel: 'Umiam',
      id: '003',
      sync: '2025-04-22 10:15',
      version: '2.1.4',
      cards: 53
    }];
    ngOnInit(): void {
      
    }
}
