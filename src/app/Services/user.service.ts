import { Injectable } from "@angular/core";
import { Auth, User } from "@angular/fire/auth";
import { Database, ref, set } from "@angular/fire/database";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "@angular/fire/storage";
import { onValue } from "firebase/database";
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

  async uploadProfilePicture(userId: string, imageUrl: string): Promise<string> {
    const storage = getStorage();
    const userImageRef = storageRef(storage, `users/${userId}/profilePicture.jpg`);
    await uploadString(userImageRef, imageUrl, 'data_url');
    const downloadURL = await getDownloadURL(userImageRef);
    const userRef = ref(this.db, `users/${userId}/profilePicture`);
    await set(userRef, downloadURL);
    return downloadURL;
  }
  
  async getProfilePicture(userId: string): Promise<string | null> {
    try {
      const storage = getStorage();
      const userImageRef = storageRef(storage, `users/${userId}/profilePicture.jpg`);
      return await getDownloadURL(userImageRef);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return null;
    }
  }

  getUserFormation(): Promise<any> {
    return new Promise((resolve, reject) => {
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

        for (let roomId in rooms) {
          const users = rooms[roomId].users;
          if (users) {
            for (let userKey in users) {
              if (users[userKey].uid === uid) {
                userInfo = users[userKey];
                userInfo.room = roomId;
                break;
              }
            }
          }
          if (userInfo) break;
        }

        if (userInfo) {
          observer.next(userInfo);
        } else {
          console.error("Aucune information utilisateur trouvée.");
          observer.error("Utilisateur introuvable.");
        }
      });
    });
  }
}