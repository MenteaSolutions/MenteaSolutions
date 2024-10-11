import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../Services/firebase.service'; // Import FirebaseService
import { Auth } from '@angular/fire/auth'; // Firebase Authentication
import { ModalController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PasswordChangeModalComponent } from '../../password-change-modal/password-change-modal.component';

@Component({
  selector: 'app-room-users',
  standalone: true,
  imports:[FormsModule, CommonModule, IonicModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})


export class UserComponent implements OnInit {
  userDetails: any = null; // Pour stocker les détails de l'utilisateur
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private auth: Auth,
    private modalController: ModalController // Injecter ModalController pour ouvrir le modal
  ) {}

  ngOnInit() {
    this.loadUserDetails(); // Charger les détails de l'utilisateur
  }

  async loadUserDetails() {
    this.isLoading = true;
    this.error = null;
    try {
      const currentUser = this.auth.currentUser;
      if (currentUser && currentUser.email) {
        this.userDetails = await this.firebaseService.fetchUserDetails(currentUser.email);
        if (!this.userDetails) {
          this.error = 'No user details found.';
        }
      } else {
        this.error = 'No user is logged in.';
      }
    } catch (error) {
      this.error = 'Error fetching user details.';
      console.error('Error fetching user details:', error);
    } finally {
      this.isLoading = false;
    }
  }
  // Ouvrir le modal pour changer le mot de passe
  async openPasswordChangeModal() {
    const modal = await this.modalController.create({
      component: PasswordChangeModalComponent,
      componentProps: { userDetails: this.userDetails } // Transmettre les détails de l'utilisateur au modal
    });

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.success) {
        // Mettre à jour le mot de passe dans l'interface utilisateur
        this.userDetails.password = result.data.newPassword;
      }
    });

    await modal.present();
  }
}
