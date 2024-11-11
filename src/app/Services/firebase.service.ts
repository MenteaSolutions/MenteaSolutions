import { Injectable } from "@angular/core";
import { Database, ref, get, update } from "@angular/fire/database";
import { Auth, updatePassword } from "@angular/fire/auth"; // Pour mettre à jour le mot de passe dans Firebase Auth

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  constructor(private db: Database, private auth: Auth) {}

  // Récupérer les détails de l'utilisateur à partir de l'email
  async fetchUserDetails(userEmail: string): Promise<any> {
    try {
      const roomsRef = ref(this.db, "rooms");
      const roomsSnapshot = await get(roomsRef);

      if (roomsSnapshot.exists()) {
        const roomsData = roomsSnapshot.val();

        for (const roomName in roomsData) {
          if (roomsData[roomName].users) {
            const usersInRoom = roomsData[roomName].users;

            for (const userId in usersInRoom) {
              const userData = usersInRoom[userId];
              if (userData.email === userEmail) {
                const userDetails = {
                  uid: userId,
                  firstName: userData.firstName || "",
                  lastName: userData.lastName || "",
                  email: userData.email || "",
                  password: userData.password || "",
                  role: userData.role || "",
                  roomName: roomName,
                };
                return userDetails;
              }
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }

  // Mise à jour du mot de passe dans Firebase Authentication et Realtime Database
  async changeUserPassword(
    newPassword: string,
    userDetails: any
  ): Promise<void> {
    const currentUser = this.auth.currentUser; // Utilisateur connecté actuellement

    if (currentUser) {
      try {
        // 1. Mise à jour du mot de passe dans Firebase Authentication
        await updatePassword(currentUser, newPassword);
        console.log(
          "Password updated successfully in Firebase Authentication."
        );

        // 2. Mise à jour du mot de passe dans Firebase Realtime Database
        await this.updateUserPassword(userDetails.roomName, userDetails.uid);
        console.log(
          "Password updated successfully in Firebase Realtime Database."
        );
      } catch (error) {
        console.error("Error updating password:", error);
        throw error;
      }
    } else {
      throw new Error("No user is currently logged in.");
    }
  }
  // Mise à jour du mot de passe dans Firebase Realtime Database
  async updateUserPassword(roomName: string, userId: string): Promise<void> {
    try {
      const userRef = ref(this.db, `rooms/${roomName}/users/${userId}`);
      await update(userRef, { password: null }); // Mise à jour du mot de passe
      console.log(
        "Password updated successfully in Firebase Realtime Database."
      );
    } catch (error) {
      console.error(
        "Error updating password in Firebase Realtime Database:",
        error
      );
      throw error;
    }
  }
}
