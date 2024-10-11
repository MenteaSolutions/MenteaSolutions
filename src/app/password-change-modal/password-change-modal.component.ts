import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FirebaseService } from '../Services/firebase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-password-change-modal',
  standalone: true,
  imports:[FormsModule, CommonModule, IonicModule],
  templateUrl: './password-change-modal.component.html',
  styleUrls: ['./password-change-modal.component.scss'],
})
export class PasswordChangeModalComponent {
  @Input() userDetails: any;
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  // Déclarez deux variables pour stocker le type de mot de passe (texte ou mot de passe)
  passwordType1: string = 'password'; // Pour le champ "New Password"
  passwordType2: string = 'password'; // Pour le champ "Confirm New Password"

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService
  ) {}

  // Fonction pour fermer le modal
  dismiss() {
    this.modalController.dismiss();
  }
  // Fonction pour basculer entre afficher/masquer le mot de passe pour le champ "New Password"
  togglePasswordVisibility1() {
    this.passwordType1 = this.passwordType1 === 'password' ? 'text' : 'password';
  }

  // Fonction pour basculer entre afficher/masquer le mot de passe pour le champ "Confirm New Password"
  togglePasswordVisibility2() {
    this.passwordType2 = this.passwordType2 === 'password' ? 'text' : 'password';
  }

  // Fonction pour changer le mot de passe
  async changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    try {
      await this.firebaseService.changeUserPassword(this.newPassword, this.userDetails);
      console.log('Password updated successfully');
      this.modalController.dismiss({
        success: true,
        newPassword: this.newPassword
      });
    } catch (error) {
      this.errorMessage = 'Error updating password.';
      console.error('Error:', error);
    }
  }
}