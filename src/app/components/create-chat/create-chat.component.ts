import { Component, OnInit } from "@angular/core";
import { ChatService } from "./create-chat.service";
import { Observable } from "rxjs";
import { FormsModule } from "@angular/forms"; // Pour ngModel
import { CommonModule } from "@angular/common";
import { Auth, User } from "@angular/fire/auth"; // Import Firebase Auth
import Swal from "sweetalert2";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelectOption,
  
} from "@ionic/angular/standalone";

@Component({
  selector: "app-create-chat",
  standalone: true,
  imports: [
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonButton,
    IonLabel,
    IonItem,
    IonListHeader,
    IonList,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    FormsModule,
    IonSelectOption,
    CommonModule,
  ],
  templateUrl: "./create-chat.component.html",
  styleUrls: ["./create-chat.component.css"],
})
export class CreateChatComponent implements OnInit {
  newMessage: string = "";
  rooms: string[] = [
    "WebDesigner",
    "WebProgrammer",
    "Data Analytics appliqué avec Python",
    "Marketing Digital",
    "Mobile Web Application Developer",
    "Python Software Engineer",
  ]; // Liste des formations
  selectedRoom: string = this.rooms[0]; // Salle par défaut
  messages$: Observable<any[]> = new Observable<any[]>(); // Initialiser les messages
  students$: Observable<any[]> = new Observable<any[]>(); // Initialiser les étudiants
  currentUserFirstName: string = ""; // Récupérer dynamiquement le prénom de l'utilisateur connecté

  constructor(private chatService: ChatService, private auth: Auth) {}

  ngOnInit() {
    this.loadChat(this.selectedRoom);

    // Récupérer l'utilisateur actuellement connecté
    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        // Ici, récupérer les informations de l'utilisateur connecté (comme Tanja) depuis Firebase
        this.chatService.getAdminFirstName().subscribe((adminFirstName) => {
          this.currentUserFirstName = adminFirstName;
        });
      }
    });
  }

  changeRoom() {
    // Charger les messages et étudiants pour la nouvelle salle sélectionnée
    this.loadChat(this.selectedRoom);
  }

  loadChat(roomId: string) {
    // Charger les messages pour la salle de chat sélectionnée
    this.chatService.getMessages(roomId);
    this.messages$ = this.chatService.messages$;

    // Charger les étudiants de la formation sélectionnée
    this.chatService.getStudents(roomId);
    this.students$ = this.chatService.students$;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(
        this.selectedRoom,
        this.newMessage,
        this.currentUserFirstName
      );
      this.newMessage = ""; // Réinitialiser le champ après l'envoi
    }
  }

  deleteRoom() {
    if (this.selectedRoom) {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        text: `Vous ne pourrez pas revenir en arrière après avoir supprimé la formation ${this.selectedRoom} et tous ses messages.`,
        icon: "warning",
        showCancelButton: true,
        heightAuto: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
        cancelButtonText: "Annuler",
      }).then((result) => {
        if (result.isConfirmed) {
          // Appeler la méthode pour supprimer la salle de chat
          this.chatService.deleteRoom(this.selectedRoom);

          // Afficher un message de succès
          Swal.fire({
            title: "Supprimé !",
            heightAuto: false,
            text: `La salle de chat ${this.selectedRoom} a bien été supprimée.`,
            icon: "success",
          });

          // Réinitialiser la sélection
          this.selectedRoom = "";
        }
      });
    }
  }
}
