import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service'; // Assure-toi que le chemin est correct
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-log-out', // Nom du sélecteur du composant
  standalone: true,
  imports:[IonicModule],
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutComponent {

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout(); // Appelle la méthode logout du service d'authentification
  }
}