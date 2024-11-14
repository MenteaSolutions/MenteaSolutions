import { Component, OnInit } from "@angular/core";

import { Observable } from "rxjs";
import { FormsModule } from "@angular/forms"; // Pour ngModel
import { CommonModule } from "@angular/common";
import { Auth, User } from "@angular/fire/auth"; // Import Firebase Auth
import { ChatService } from "./chat.service";
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
} from "@ionic/angular/standalone";

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [
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
    CommonModule,
  ],
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit {
  newMessage: string = "";
  roomId: string = ""; // Dynamiser le roomId
  messages$: Observable<any[]> = new Observable<any[]>(); // Initialiser les messages
  students$: Observable<any[]> = new Observable<any[]>(); // Initialiser les étudiants
  currentUserFirstName: string = ""; // Récupérer dynamiquement le prénom de l'utilisateur connecté

  constructor(private chatService: ChatService, private auth: Auth) {}

  ngOnInit() {
    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.chatService.getUserRoom(user.uid).subscribe(
          (userInfo: any) => {
            if (userInfo) {
              this.roomId = userInfo.room;
              this.currentUserFirstName = userInfo.firstName;
              this.loadChat();
            }
          },
          (error) => {
            console.error(
              "Erreur lors de la récupération des informations utilisateur :",
              error
            );
          }
        );
      }
    });
  }

  loadChat() {
    if (this.roomId) {
      // Charger les messages pour la salle de chat
      this.chatService.getMessages(this.roomId);
      this.messages$ = this.chatService.messages$;

      // Charger les étudiants de la formation sélectionnée
      this.chatService.getStudents(this.roomId); // Appel à la méthode pour récupérer les étudiants
      this.students$ = this.chatService.students$; // Récupérer les étudiants
    } else {
      console.error("Aucun Room ID trouvé.");
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      // Ajouter firstName (prénom de l'utilisateur connecté) à l'envoi du message
      this.chatService.sendMessage(
        this.roomId,
        this.newMessage,
        this.currentUserFirstName
      );
      this.newMessage = ""; // Réinitialiser le champ après l'envoi
    }
  }
}
