import { Component } from '@angular/core';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrl: './home-card.component.css'
})
export class HomeCardComponent {
  title: string = "Title";
  description: string = "Lorem ipsum";
  leftButton: string = "Left Button";
  rightButton: string = "Right Button";
}
