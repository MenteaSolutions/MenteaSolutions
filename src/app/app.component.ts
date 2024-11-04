import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {   IonApp, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenu, IonSegmentButton, IonTitle, IonToolbar, MenuController } from '@ionic/angular/standalone';
import { AuthService } from './Services/auth.service'; // Correct the path to services
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { UpdatesNotificationComponent } from "./app-updates-notification";
import '@khmyznikov/pwa-install';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, UpdatesNotificationComponent, IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,IonList, IonItem, IonButtons, IonButton, IonSegmentButton ], // Import RouterModule
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add CUSTOM_ELEMENTS_SCHEMA to handle ion-* elements
})
export class AppComponent {
  constructor(private menu: MenuController, public authService: AuthService) {

  }

  // Method to close the menu
  closeMenu() {
    this.menu.close();
  }

  // Logout method
  logout() {
    this.authService.logout();
  }
}