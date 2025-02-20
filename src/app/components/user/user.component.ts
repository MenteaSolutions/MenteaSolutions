  import { Component, OnInit } from "@angular/core";
  import { FirebaseService } from "../../Services/firebase.service";
  import { Auth } from "@angular/fire/auth";
  import { ModalController } from "@ionic/angular/standalone";
  import { FormsModule } from "@angular/forms";
  import { CommonModule } from "@angular/common";
  import { PasswordChangeModalComponent } from "../../password-change-modal/password-change-modal.component";
  import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
  import { UserService } from "../../Services/user.service";
  import {
    IonContent,
    IonCard,
    IonCardHeader,
    IonAvatar,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton,
    IonInputPasswordToggle,
    IonInput,
  } from "@ionic/angular/standalone";

  @Component({
    selector: "app-room-users",
    standalone: true,
    imports: [
      IonButton,
      IonLabel,
      IonItem,
      IonCardContent,
      IonCardTitle,
      IonAvatar,
      IonCardHeader,
      IonCard,
      FormsModule,
      CommonModule,
      IonInputPasswordToggle,
      IonContent,
      IonInput,
    ],
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"],
  })
  export class UserComponent implements OnInit {
    userDetails: any = null;
    isLoading: boolean = true;
    error: string | null = null;

    constructor(
      private firebaseService: FirebaseService,
      private auth: Auth,
      private modalController: ModalController,
      private userService: UserService
    ) {}

    ngOnInit() {
      this.loadUserDetails();
    }

    async loadUserDetails() {
      this.isLoading = true;
      this.error = null;
      try {
        const currentUser = this.auth.currentUser;
        if (currentUser && currentUser.email) {
          this.userDetails = await this.firebaseService.fetchUserDetails(currentUser.email);
          if (!this.userDetails) {
            this.error = "No user details found.";
          } else {
            // Buscar e atribuir a foto de perfil
            this.userDetails.profilePicture = await this.userService.getProfilePicture(currentUser.uid);
          }
        } else {
          this.error = "No user is logged in.";
        }
      } catch (error) {
        this.error = "Error fetching user details.";
        console.error("Error fetching user details:", error);
      } finally {
        this.isLoading = false;
      }
    }

    async openPasswordChangeModal() {
      const modal = await this.modalController.create({
        component: PasswordChangeModalComponent,
        componentProps: { userDetails: this.userDetails },
      });
    
      modal.onDidDismiss().then((result) => {
        if (result.data && result.data.success) {
          this.userDetails.password = result.data.newPassword;
        }
      });
    
      await modal.present();
    }
    async changeProfilePicture() {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.DataUrl
        });

        if (image) {
          const resizedImage = await this.resizeImage(image.dataUrl ?? '', 150, 150);
          this.userDetails.profilePicture = resizedImage;

          const currentUser = this.auth.currentUser;
          if (currentUser) {
            await this.userService.uploadProfilePicture(currentUser.uid, resizedImage);
          }
        }
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    }
    
    resizeImage(dataUrl: string, width: number, height: number): Promise<string> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL());
          } else {
            reject(new Error('Failed to get canvas context'));
          }
        };
        img.onerror = (error) => reject(error);
      });
    }
  }