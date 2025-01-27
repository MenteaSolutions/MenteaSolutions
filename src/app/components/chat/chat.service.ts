import { Injectable } from "@angular/core";
import { Database, ref, onValue, set, push } from "@angular/fire/database";
import { BehaviorSubject, Observable } from "rxjs"; // Ajout de l'import Observable

interface Admin {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}


@Injectable({
  providedIn: "root",
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private studentsSubject = new BehaviorSubject<any[]>([]);
  students$ = this.studentsSubject.asObservable();

  constructor(private db: Database) {}









  // Fonction pour envoyer un message dans une salle spécifique
  sendMessage(roomId: string, message: string, firstName: string, isAudio: boolean = false) {
    const timestamp = new Date().toISOString();
  
    const messageData = {
      firstName: firstName,
      text: isAudio ? null : message, // Si c'est un message vocal, pas de texte
      audio: isAudio ? message : null, // Si c'est un texte, pas d'audio
      timestamp: timestamp,
    };
  
    const messageRef = push(ref(this.db, `rooms/${roomId}/messages`));
    set(messageRef, messageData).catch((error) => {
      console.error("Erreur lors de l'envoi du message :", error);
    });
  }


  
  
  
  

  // Fonction pour récupérer les messages d'une salle en temps réel
  getMessages(roomId: string): void {
    const messagesRef = ref(this.db, `rooms/${roomId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val();
      const messageList = messages ? Object.values(messages) : [];
      this.messagesSubject.next(messageList);
    });
  }

  // Fonction pour récupérer les étudiants d'une formation spécifique
  getStudents(roomId: string): void {
    const studentsRef = ref(this.db, `rooms/${roomId}/users`);
    const adminRef = ref(this.db, `admins`);

    onValue(studentsRef, (snapshot) => {
      const students = snapshot.val();
      let studentList = students ? Object.values(students) : [];

      // Récupérer l'administrateur et l'ajouter dans la liste
      onValue(adminRef, (adminSnapshot) => {
        const admins = adminSnapshot.val();
        if (admins) {
          const adminList: Admin[] = Object.values(admins).map(
            (admin: any) => ({
              firstName: admin.firstname,
              lastName: admin.lastname,
              email: admin.email,
              role: admin.role,
            })
          );
          studentList = [...studentList, ...adminList];
        }
        this.studentsSubject.next(studentList);
      });
    });
  }
}
