import { Component } from "@angular/core";
import { AuthService } from "../../Services/auth.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
  IonContent,
  IonItem,
  IonButton,
  IonText,
  IonToast,
  IonInputPasswordToggle,
  IonMenuButton,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-login",
  standalone: true,
  imports:[FormsModule, CommonModule,IonContent,IonItem,IonInputPasswordToggle,IonButton,IonText, IonToast, IonMenuButton, IonMenuButton],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  errorMessage: string = "";
  toastMessage: string = ""; // Për mesazhin e toast
  isToastOpen: boolean = false; // Për gjendjen e toast

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    try {
      // Appel du service d'authentification pour se connecter
      await this.authService.login(this.email, this.password);

      // Après connexion réussie, rediriger en fonction du rôle
      if (this.authService.isAdmin()) {
        this.router.navigate(["/createUser"]);
      } else if (this.authService.isUser()) {
        this.router.navigate(["/user"]);
      } else {
        this.errorMessage = "Unknown role. Please contact support.";
      }
    } catch (error) {
      this.showToast("Connexion échouée. Veuillez vérifier vos informations."); // Mesazh në frëngjisht
      console.error("Login error:", error);
    }
  }

  // Funksioni për të shfaqur toast
  showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
  }

  // Funksioni për të mbyllur toast kur përfundon
  closeToast() {
    this.isToastOpen = false;
  }
}
