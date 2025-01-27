import { Component, OnInit, AfterViewChecked } from "@angular/core"; // Import AfterViewChecked pour le scroll automatique

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
  IonInput,
  IonCardContent,
  IonCard, IonIcon } from "@ionic/angular/standalone";
import { UserService } from "../../Services/user.service";

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [IonIcon, 
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
    IonInput,
    IonCard,
    IonCardContent,
  ],
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  newMessage: string = "";
  roomId: string = ""; // Dynamiser le roomId
  messages$: Observable<any[]> = new Observable<any[]>(); // Initialiser les messages
  students$: Observable<any[]> = new Observable<any[]>(); // Initialiser les étudiants
  currentUserFirstName: string = ""; // Récupérer dynamiquement le prénom de l'utilisateur connecté


  isRecording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  audioBlob: Blob | null = null;



  constructor(
    private chatService: ChatService,
    private auth: Auth,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.userService.getUserRoom(user.uid).subscribe(
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



  ngAfterViewChecked() {
    this.scrollToBottom(); // Appeler le scroll automatique après chaque mise à jour de la vue
  }

  // loadChat() {
  //   if (this.roomId) {
  //     // Charger les messages pour la salle de chat
  //     this.chatService.getMessages(this.roomId);
  //     this.messages$ = this.chatService.messages$;

  //     // Charger les étudiants de la formation sélectionnée
  //     this.chatService.getStudents(this.roomId); // Appel à la méthode pour récupérer les étudiants
  //     this.students$ = this.chatService.students$; // Récupérer les étudiants
  //   } else {
  //     console.error("Aucun Room ID trouvé.");
  //   }
  // }
  loadChat() {
    if (this.roomId) {
      this.chatService.getMessages(this.roomId);
      this.messages$ = this.chatService.messages$;
  
      this.messages$.subscribe(() => {
        this.scrollToLastMessage(); // Scroll directement vers le dernier message
      });
  
      this.chatService.getStudents(this.roomId);
      this.students$ = this.chatService.students$;
    } else {
      console.error("Aucun Room ID trouvé.");
    }
  }

  scrollToLastMessage() {
    const lastMessage = document.getElementById('last-message');
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }
  
  
  







  sendMessage() {
    if (this.newMessage.trim()) {
      // Envoyer le message
      this.chatService.sendMessage(
        this.roomId,
        this.newMessage,
        this.currentUserFirstName
      );
  
      // Réinitialiser le champ d'input
      this.newMessage = "";

    }
  }

  // Méthode pour scroller vers le bas
  scrollToBottom() {
    const messagesContainer = document.querySelector(".messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }









  // toggleRecording() {
  //   if (this.isRecording) {
  //     this.stopRecording();
  //   } else {
  //     this.startRecording();
  //   }
  // }
  
  // startRecording() {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     navigator.mediaDevices
  //       .getUserMedia({ audio: true })
  //       .then((stream) => {
  //         this.mediaRecorder = new MediaRecorder(stream);
  //         this.recordedChunks = [];
  
  //         this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
  //           if (event.data.size > 0) {
  //             this.recordedChunks.push(event.data);
  //           }
  //         };
  
  //         this.mediaRecorder.onstop = () => {
  //           this.audioBlob = new Blob(this.recordedChunks, { type: "audio/webm" });
  //           console.log("Audio enregistré avec succès.");
  //           // this.playAudio();
  //         };
  
  //         this.mediaRecorder.start();
  //         this.isRecording = true;
  //         console.log("Enregistrement démarré...");
  //       })
  //       .catch((error) => {
  //         console.error("Erreur lors de l'accès au microphone :", error);
  //       });
  //   } else {
  //     console.error("API getUserMedia non supportée.");
  //   }
  // }
  
  // stopRecording() {
  //   if (this.mediaRecorder && this.isRecording) {
  //     this.mediaRecorder.stop();
  //     this.isRecording = false;
  
  //     this.mediaRecorder.onstop = () => {
  //       this.audioBlob = new Blob(this.recordedChunks, { type: "audio/webm" });
  
  //       // Créer une URL pour écouter (facultatif)
  //       const audioURL = URL.createObjectURL(this.audioBlob);
  //       console.log("Enregistrement terminé :", audioURL);
  
  //       // Lire le fichier audio et envoyer le message vocal
  //       this.sendAudioMessage();
  //     };
  //   }
  // }
  
  // sendAudioMessage() {
  //   if (this.audioBlob) {
  //     const reader = new FileReader();
  
  //     // Lire le fichier audio et le convertir en Base64
  //     reader.onload = () => {
  //       const audioBase64 = reader.result as string;
  
  //       // Envoyer l'audio comme un message vocal
  //       this.chatService.sendMessage(
  //         this.roomId,
  //         audioBase64,
  //         this.currentUserFirstName,
  //         true
  //       );
  //       console.log("Message vocal envoyé !");
  //     };
  
  //     reader.readAsDataURL(this.audioBlob); // Convertir le Blob en Base64
  //   } else {
  //     console.warn("Aucun fichier audio à envoyer.");
  //   }
  // }
  
  
}
