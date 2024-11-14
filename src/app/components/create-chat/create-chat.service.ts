import { Injectable } from "@angular/core";
import {
  Database,
  ref,
  onValue,
  set,
  push,
  remove,
} from "@angular/fire/database";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private studentsSubject = new BehaviorSubject<any[]>([]);
  students$ = this.studentsSubject.asObservable();

  constructor(private db: Database) {}

  sendMessage(roomId: string, message: string, firstName: string): void {
    const messagesRef = ref(this.db, `rooms/${roomId}/messages`);
    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
      text: message,
      firstName: firstName, // Utilise ici le prénom récupéré
      timestamp: Date.now(),
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

      // Récupérer l'administrateur Tanja et l'ajouter dans la liste
      onValue(adminRef, (adminSnapshot) => {
        const admins = adminSnapshot.val();
        if (admins) {
          const adminList = Object.values(admins).map((admin: any) => ({
            firstName: admin.firstname, // Assurez-vous que c'est bien 'firstname' et pas autre chose
            lastName: admin.lastname,
            email: admin.email,
            role: admin.role,
          }));
          studentList = [...studentList, ...adminList];
        }
        this.studentsSubject.next(studentList);
      });
    });
  }

  // Fonction pour récupérer le prénom de l'administrateur
  getAdminFirstName(): Observable<string> {
    return new Observable((observer) => {
      const adminRef = ref(this.db, "admins");
      onValue(adminRef, (snapshot) => {
        const admins = snapshot.val();
        if (admins) {
          const adminData: any = Object.values(admins)[0]; // Récupérer le premier admin
          if (adminData && adminData.firstname) {
            observer.next(adminData.firstname); // Renvoyer le prénom correct
          } else {
            observer.next("Admin"); // Renvoyer par défaut 'Admin' si le prénom n'est pas trouvé
          }
        } else {
          observer.next("Admin"); // Par défaut si aucun admin n'est trouvé
        }
      });
    });
  }

  // Fonction pour supprimer une salle de chat
  deleteRoom(roomId: string): void {
    const roomRef = ref(this.db, `rooms/${roomId}`);
    remove(roomRef)
      .then(() => {
        //TODO - Add PopUP and remove this console.log
        // console.log(`La salle de chat ${roomId} a été supprimée.`);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la suppression de la salle de chat :",
          error
        );
      });
  }
}
