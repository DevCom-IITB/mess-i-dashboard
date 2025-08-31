import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrl: './app-bar.component.css'
})
export class AppBarComponent {
  @Input() suffix: string ;
  constructor(public auth: AuthService, private router: Router) { }
  toggleMenu(): void {
    this.router.navigate(['/list']);
  }
  goToHome(): void {
    this.router.navigate(['/home']);
  }
}