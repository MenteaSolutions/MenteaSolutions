import { Component } from "@angular/core";
import { AuthService } from "../../Services/auth.service"; // Assurez-vous que le chemin est correct
import { CommonModule } from "@angular/common";
import { IonApp } from "@ionic/angular/standalone";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
  standalone: true,
  imports: [IonApp, CommonModule],
})
export class MenuComponent {
  constructor(private authService: AuthService) {}

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isUser(): boolean {
    return this.authService.isUser();
  }
}
