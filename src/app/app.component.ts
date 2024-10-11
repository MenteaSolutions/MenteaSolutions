import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController, IonicModule } from '@ionic/angular';
import { AuthService } from './Services/auth.service'; // Correct the path to services
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, IonicModule, RouterModule], // Import RouterModule
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add CUSTOM_ELEMENTS_SCHEMA to handle ion-* elements
})
export class AppComponent {
  constructor(private menu: MenuController, public authService: AuthService) {}

  // Method to close the menu
  closeMenu() {
    this.menu.close();
  }

  // Logout method
  logout() {
    this.authService.logout();
  }
}