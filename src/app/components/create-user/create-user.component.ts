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
  IonSelect,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-create-user",
  standalone: true,
  imports: [
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
  roomStudentCounts: Array<{ room: string; count: number }> = [];
  createdUsers: Array<{
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
    this.createdUsers = [];
    this.rooms.forEach((room) => {
      const usersRef = ref(this.db, `rooms/${room}/users`);
      onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        if (users) {
          Object.values(users).forEach((user: any) => {
            this.createdUsers.push({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              password: user.password,
              room: room, // Ajout de la formation ici
            });
          });
        }
      });
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
      const email = `student${Math.floor(Math.random() * 10000)}@school.com`;
      const password = generatePassword(8);
      const student = this.studentInfo[i];

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
      position: "top-end",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      heightAuto: false,
      timer: 1500,
    });
  }
}
