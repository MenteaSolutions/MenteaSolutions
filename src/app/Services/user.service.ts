import { Injectable, OnInit } from "@angular/core";
import { Auth, User } from "@angular/fire/auth";
import { Database } from "@angular/fire/database";
import { onValue, ref } from "firebase/database";
import { Observable } from "rxjs";
import { FormacaoService } from "../components/create-zoom/formacao.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  formationId: string = "";

  constructor(
    private auth: Auth,
    private db: Database,
    private formacaoService: FormacaoService
  ) {}

  getUserFormation(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Certifique-se de retornar a Promise
      this.auth.onAuthStateChanged((user: User | null) => {
        if (user) {
          this.getUserRoom(user.uid).subscribe(
            (userInfo: any) => {
              if (userInfo) {
                this.formacaoService
                  .getFormationByName(userInfo.room)
                  .subscribe(
                    (formations: any) => {
                      if (formations.length > 0) {
                        resolve(formations[0]);
                      }
                    },
                    (error) => reject(error)
                  );
              } else {
                reject(new Error("Usuário não possui informações de sala."));
              }
            },
            (error) => reject(error)
          );
        } else {
          reject(new Error("Usuário não autenticado."));
        }
      });
    });
  }

  getUserRoom(uid: string): Observable<any> {
    return new Observable((observer) => {
      const roomsRef = ref(this.db, `rooms`);
      onValue(roomsRef, (snapshot) => {
        const rooms = snapshot.val();
        let userInfo = null;

        // Parcourir chaque salle
        for (let roomId in rooms) {
          const users = rooms[roomId].users;
          if (users) {
            // Parcourir chaque utilisateur dans la salle
            for (let userKey in users) {
              if (users[userKey].uid === uid) {
                // Comparer les UID
                userInfo = users[userKey];
                userInfo.room = roomId; // Ajouter l'ID de la salle à l'information utilisateur
                break;
              }
            }
          }
          if (userInfo) break; // Sortir de la boucle si on trouve l'utilisateur
        }

        if (userInfo) {
          observer.next(userInfo); // Renvoyer les informations de l'utilisateur
        } else {
          console.error("Aucune information utilisateur trouvée.");
          observer.error("Utilisateur introuvable.");
        }
      });
    });
  }
}
