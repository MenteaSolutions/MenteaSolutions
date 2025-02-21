import { Component, OnInit } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { Database, ref, set, push, onValue } from "@angular/fire/database";
import { generatePassword } from "./password-generator";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import Swal from "sweetalert2";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonSelectOption,
  IonList,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonInput,
  IonSelect, IonIcon } from "@ionic/angular/standalone";
import { remove } from "@angular/fire/database";
import { getAuth, deleteUser } from "firebase/auth";



@Component({
  selector: "app-create-user",
  standalone: true,
  imports: [IonIcon, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    FormsModule,
    IonList,
    IonButton,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule,
    IonInput,
  ],
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.css"],
})
export class CreateUserComponent implements OnInit {
  rooms = [
    "WebDesigner",
    "WebProgrammer",
    "Mobile Web Application Developer",
    "Python Software Engineer",
    "Data Analytics appliqué avec Python",
    "Marketing Digital",
  ];

  selectedRoom: string = "";
  numberOfStudents: number = 0;
  selectedRole: string = "user";
  message: string = "";
  studentInfo: Array<{ firstName: string; lastName: string }> = [];
  roomStudentCounts: Array<{ room: string; count: number  }> = [];
  createdUsers: Array<{
    firebaseKey: any;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    room: string;
  }> = []; // Ajouter la formation ici

  constructor(private auth: Auth, private db: Database) {}

  ngOnInit() {
    this.loadRoomStudentCounts();
    this.loadCreatedUsers(); // Charger les utilisateurs créés au démarrage
  }


  // Charger le nombre d'étudiants par formation
  loadRoomStudentCounts() {
    this.roomStudentCounts = [];
    this.rooms.forEach((room) => {
      const roomRef = ref(this.db, `rooms/${room}/users`);
      onValue(roomRef, (snapshot) => {
        const users = snapshot.val();
        const count = users ? Object.keys(users).length : 0;
        const existingRoom = this.roomStudentCounts.find(
          (r) => r.room === room
        );

        if (existingRoom) {
          existingRoom.count = count;
        } else {
          this.roomStudentCounts.push({ room, count });
        }
      });
    });
  }












  // Charger les utilisateurs directement depuis "rooms/{formation}/users"
  loadCreatedUsers() {
    this.createdUsers = []; // Réinitialisation propre ici
    this.rooms.forEach((room) => {
      const usersRef = ref(this.db, `rooms/${room}/users`);
      onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        if (users) {
          Object.keys(users).forEach((firebaseKey) => {
            const user = users[firebaseKey];
  
            // Vérifier si l'utilisateur est déjà dans la liste pour éviter les doublons
            const exists = this.createdUsers.some(u => u.firebaseKey === firebaseKey);
            if (!exists) {
              this.createdUsers.push({
                firebaseKey: firebaseKey, // 🔥 Stocker la clé Firebase pour suppression
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                room: room, // Assigner la formation
              });
            }
          });
        }
      }, { onlyOnce: true }); // 🔥 Évite que la fonction soit appelée en boucle
    });
  }
  














  // Mettre à jour le tableau des étudiants lorsque le nombre d'étudiants change
  onStudentNumberChange() {
    this.studentInfo = Array(this.numberOfStudents)
      .fill({})
      .map(() => ({ firstName: "", lastName: "" }));
  }

  // Valider et sauvegarder les étudiants dans Firebase
  validateAndSaveStudents() {
    if (
      !this.selectedRoom ||
      this.numberOfStudents <= 0 ||
      !this.selectedRole
    ) {
      this.message = "Veuillez remplir tous les champs";
      return;
    }
  
    for (let i = 0; i < this.numberOfStudents; i++) {
      const student = this.studentInfo[i];
  
      // Générer l'email basé sur le nom et le prénom
      const email = `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}@nomades.ch`;
      const password = generatePassword(8);

      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const userRef = push(
            ref(this.db, `rooms/${this.selectedRoom}/users`)
          );

          set(userRef, {
            uid: user?.uid,
            email: email,
            room: this.selectedRoom,
            firstName: student.firstName,
            lastName: student.lastName,
            role: this.selectedRole,
            password: password,
          }).then(() => {
            // Ajouter l'utilisateur au tableau local pour l'afficher dans l'UI
            this.createdUsers.push({
              firebaseKey: userRef.key, // 🔥 Stocker la clé Firebase pour suppression
              firstName: student.firstName,
              lastName: student.lastName,
              email: email,
              password: password,
              room: this.selectedRoom, // Ajout de la formation ici
            });

            this.message = `${this.numberOfStudents} utilisateurs ont été créés avec le rôle ${this.selectedRole}`;
            this.loadRoomStudentCounts(); // Recharger le nombre d'étudiants par salle après création
            this.loadCreatedUsers(); // Recharger les utilisateurs créés
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la création des utilisateurs", error);
          this.message = `Erreur: ${error.message}`;
        });
    }
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Votre travail a été enregistré.",
      showConfirmButton: false,
      heightAuto: false,
      timer: 1500,
    });
  }


   deleteStudent(user: any) {
    if (!user.room || !user.firebaseKey) {
      console.error("Room ou clé Firebase manquante, impossible de supprimer l'élève.");
      return;
    }
  
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Voulez-vous vraiment supprimer ${user.firstName} ${user.lastName} ?`,
      icon: "warning",
      showCancelButton: true,
      heightAuto: false,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        // Référence à l'utilisateur spécifique dans la base de données
        const userRef = ref(this.db, `rooms/${user.room}/users/${user.firebaseKey}`);
  
        // Supprimer l'utilisateur de la base de données
        remove(userRef)
          .then(() => {
            console.log(`Élève ${user.firstName} ${user.lastName} supprimé avec succès.`);
  
            // Mise à jour locale pour refléter la suppression
            this.createdUsers = this.createdUsers.filter(u => u.firebaseKey !== user.firebaseKey);
  
            // Affichage du message de succès
            Swal.fire({
              title: "Supprimé !",
              text: `${user.firstName} ${user.lastName} a été supprimé avec succès.`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              heightAuto: false
            });
          })
          .catch(error => {
            console.error("Erreur lors de la suppression de l'élève :", error);
            Swal.fire({
              title: "Erreur",
              text: "Une erreur est survenue lors de la suppression.",
              icon: "error"
            });
          });
      }
    });
  }
  
  
  
}
