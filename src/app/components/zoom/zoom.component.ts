import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FormacaoService } from "../create-zoom/formacao.service";
import { Zoom } from "../../interfaces/zoom";
import { DialogZoomComponent } from "../dialog-zoom/dialog-zoom.component";
import { Formation } from "../../interfaces/formation";
import {
  IonTitle,
  IonHeader,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonContent,
  IonSelectOption,
  IonRow,
  IonCol,
  IonGrid,
  ToastController,
  IonIcon,
  IonInput,
  IonSelect,
} from "@ionic/angular/standalone";
import { Auth, User } from "@angular/fire/auth"; // Import Firebase Auth
import { addIcons } from "ionicons";
import { copyOutline } from "ionicons/icons";
import { ChatService } from "../chat/chat.service";

@Component({
  selector: "app-zoom",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonRow,
    IonCol,
    IonGrid,
    IonIcon,
  ],
  templateUrl: "./zoom.component.html",
  styleUrls: ["./zoom.component.css"],
})
export class ZoomComponent implements OnInit {
  roomId: string = ""; // Dynamiser le roomId
  zooms: Zoom[] = [];
  formations: Formation[] = [];
  selectedFormacaoToShowAulas: Formation | null = null;
  idSelectedFormation: string = "";
  zoomsToShowByFormation: Zoom[] = [];

  constructor(
    private chatService: ChatService,
    private auth: Auth,
    private formacaoService: FormacaoService,
    private dialog: MatDialog,
    private toastController: ToastController
  ) {
    addIcons({ copyOutline });
  }

  // Fonction pour copier le texte du code d'accès
  copyToClipboard(code: string) {
    navigator.clipboard
      .writeText(code)
      .then(async () => {
        const toast = await this.toastController.create({
          message: "Code d'accès copié!",
          duration: 2000,
          color: "success",
        });
        toast.present();
      })
      .catch((err) => {
        console.error("Erreur lors de la copie du texte: ", err);
      });
  }

  ngOnInit() {
    // Récupère les formations disponibles au démarrage du composant
    this.formacaoService.getFormation().subscribe((formations: Formation[]) => {
      this.formations = formations;
    });
    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.chatService.getUserRoom(user.uid).subscribe(
          (userInfo: any) => {
            if (userInfo) {
              this.roomId = userInfo.room;
              this.selectFormacao();
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
  
  // Função que recupera os cursos (zooms) de uma formação específica
  selectFormacao() {
    
    console.log("ID da formação selecionada: ", this.selectedFormacaoToShowAulas?.name);
    console.log(this.roomId);
    
    
    const id = this.roomId;
    if (id) {
      this.formacaoService
      .getZoomByIdFormation(id)
      .subscribe((zooms: Zoom[]) => {
        if (zooms.length > 0) {
          this.zoomsToShowByFormation = this.sortZoomsByDate(zooms);
        }
        this.selectedFormacaoToShowAulas = {name: this.roomId};
      });
    }
  }

  // Função para ordenar os zooms pela data
  sortZoomsByDate(zooms: Zoom[]): Zoom[] {
    return zooms
      .filter(zoom => zoom.date !== undefined) // Filtra objetos com data indefinida
      .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()); // Ordena em ordem decrescente
  }

  // Fonction pour ouvrir le dialogue avec la vidéo (iframe)
  openDialog(link?: string) {
    this.dialog.open(DialogZoomComponent, {
      maxWidth: "100vw",
      maxHeight: "100vh",
      height: "100%",
      width: "100%",
      data: { iframeUrl: link },
    });
  }
}
