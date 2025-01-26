import { Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, User } from "@angular/fire/auth";
import { Database, ref, get } from "@angular/fire/database";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userRole: "admin" | "user" | null = null;

  constructor(
    private auth: Auth,
    private db: Database,
    private router: Router
  ) {}

  // Méthode pour se connecter avec Firebase Authentication
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;

      // Appeler la fonction pour chercher le rôle de l'utilisateur
      await this.fetchUserRole(user);

      // Rediriger l'utilisateur en fonction de son rôle
      this.redirectUser();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  // Méthode pour récupérer le rôle de l'utilisateur
  async fetchUserRole(user: User | null): Promise<void> {
    if (user) {
      try {
        // Vérifier d'abord dans la collection "admins"
        const adminRef = ref(this.db, `admins/${user.uid}`);
        const adminSnapshot = await get(adminRef);

        if (adminSnapshot.exists()) {
          const adminData = adminSnapshot.val();

          if (adminData.role === "admin") {
            this.userRole = "admin";
            localStorage.setItem("userRole", "admin"); // Enregistrer le rôle dans localStorage
            return;
          }
        }
        // Si l'utilisateur n'est pas dans "admins", chercher dans les rooms par email
        await this.fetchUserRoleInRooms(user);
      } catch (error) {
        console.error("Error fetching user role:", error);
        throw error;
      }
    }
  }
  // Méthode pour récupérer le rôle de l'utilisateur dans les "rooms"
  async fetchUserRoleInRooms(user: User): Promise<void> {
    try {
      // Référence à la racine des salles
      const roomsRef = ref(this.db, "rooms");

      // Récupérer toutes les salles
      const roomsSnapshot = await get(roomsRef);

      if (roomsSnapshot.exists()) {
        const roomsData = roomsSnapshot.val();

        // Parcourir toutes les salles pour trouver l'utilisateur par email
        for (const roomName in roomsData) {
          if (roomsData.hasOwnProperty(roomName)) {
            // Récupérer tous les utilisateurs de cette salle
            const usersInRoom = roomsData[roomName].users;
            // Parcourir les utilisateurs dans la salle pour vérifier l'email
            for (const userId in usersInRoom) {
              if (usersInRoom.hasOwnProperty(userId)) {
                const userData = usersInRoom[userId];

                if (userData.email === user.email) {
                  // Comparer l'email plutôt que l'UID

                  // Vérifier si le rôle est présent et valide
                  if (userData.role === "user") {
                    this.userRole = "user";
                    localStorage.setItem("userRole", "user"); // Enregistrer le rôle dans localStorage
                    return;
                  } else if (userData.role === "admin") {
                    this.userRole = "admin";
                    localStorage.setItem("userRole", "admin"); // Enregistrer le rôle dans localStorage
                    return;
                  } else {
                    console.error(
                      "Invalid or missing role for user:",
                      userData.role
                    );
                    throw new Error(
                      "Invalid or missing role for user in the database"
                    );
                  }
                }
              }
            }
            console.error(`User not found in room: ${roomName}`);
          }
        }

        // Si l'utilisateur n'est trouvé dans aucune salle
        throw new Error("User not found in any room");
      } else {
        throw new Error("No rooms found in database");
      }
    } catch (error) {
      console.error("Error fetching user role from rooms:", error);
      throw error;
    }
  }
  // Méthode pour vérifier si l'utilisateur est admin
  isAdmin(): boolean {
    const role = localStorage.getItem("userRole");
    return role === "admin";
  }

  // Méthode pour vérifier si l'utilisateur est un utilisateur normal
  isUser(): boolean {
    const role = localStorage.getItem("userRole");
    return role === "user";
  }
  // Redirection en fonction du rôle de l'utilisateur
  redirectUser(): void {
    const role = localStorage.getItem("userRole");

    if (this.isAdmin()) {
      this.router.navigate(["/createUser"]); // Rediriger vers la page admin
    } else if (this.isUser()) {
      this.router.navigate(["/accueil"]); // Rediriger vers la page utilisateur
    } else {
      this.router.navigate(["/login"]); // Rediriger vers la page de login si le rôle est indéfini
    }
  } 
  // Méthode pour se déconnecter
  logout(): void {
    this.auth
      .signOut()
      .then(() => {
        this.userRole = null;
        localStorage.removeItem("userRole"); // Supprimer le rôle stocké
        this.router.navigate(["/login"]); // Rediriger vers la page de connexion
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  }
}
