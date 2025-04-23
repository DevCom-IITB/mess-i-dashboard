import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.css'
})
export class AppBarComponent {
  @Input() suffix: string ;

}
