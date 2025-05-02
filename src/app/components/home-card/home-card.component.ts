import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.css'
})
export class HomeCardComponent {
  @Input() card : any ;
  @Input() stud : any;
  @Input() app_bar_suffix : string;
  redirect: string = "";
}
