import { Component } from "@angular/core";
import { AuthService } from "../Services/auth.service";
import { IonButton, IonButtons } from "@ionic/angular/standalone";

@Component({
  selector: "app-log-out", // Nom du sélecteur du composant
  standalone: true,
  imports: [IonButtons, IonButton], // Importe les composants IonButtons et IonButton
  templateUrl: "./log-out.component.html",
  styleUrls: ["./log-out.component.css"],
})
export class LogOutComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout(); // Appelle la méthode logout du service d'authentification
  }
}
