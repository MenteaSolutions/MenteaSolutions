import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FormacaoService } from "../create-zoom/formacao.service";
import { Zoom } from "../../interfaces/zoom";
import { DialogZoomComponent } from "../dialog-zoom/dialog-zoom.component";
import { Formation } from "../../interfaces/formation";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonContent,
  IonRow,
  IonCol,
  IonGrid,
  ToastController,
  IonIcon,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { copyOutline } from "ionicons/icons";
import { UserService } from "../../Services/user.service";

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
  formationUserLogged: any;
  zooms: Zoom[] = [];
  formations: Formation[] = [];
  selectedFormacaoToShowAulas: Formation | null = null;
  idSelectedFormation: string = "";
  zoomsToShowByFormation: Zoom[] = [];

  constructor(
    private formacaoService: FormacaoService,
    private dialog: MatDialog,
    private toastController: ToastController,
    private userService: UserService
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
    this.userService
      .getUserFormation()
      .then((formation) => {
        this.formationUserLogged = formation;
        this.selectFormacao();
      })
      .catch((error) => {
        console.error("Erro ao obter a formação:", error);
      });
  }

  // Função que recupera os cursos (zooms) de uma formação específica
  selectFormacao() {
    const id = this.formationUserLogged.id;
    if (id) {
      this.formacaoService
        .getZoomByIdFormation(id)
        .subscribe((zooms: Zoom[]) => {
          if (zooms.length > 0) {
            this.zoomsToShowByFormation = this.sortZoomsByDate(zooms);
          }
          this.selectedFormacaoToShowAulas = {
            name: this.formationUserLogged.name,
          };
        });
    }
  }

  // Função para ordenar os zooms pela data
  sortZoomsByDate(zooms: Zoom[]): Zoom[] {
    return zooms
      .filter((zoom) => zoom.date !== undefined) // Filtra objetos com data indefinida
      .sort(
        (a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime()
      ); // Ordena em ordem decrescente
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
