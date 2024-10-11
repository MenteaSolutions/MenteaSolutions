import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule, NgForm } from "@angular/forms";
import { FormacaoService } from './formacao.service';
import { Zoom } from '../../interfaces/zoom';
import { Formation } from "../../interfaces/formation";
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonButton, IonList, IonSelectOption, IonDatetimeButton, IonModal, IonDatetime, IonSelect, IonInput } from "@ionic/angular/standalone";

@Component({
  selector: "app-create-zoom",
  standalone: true,
  imports: [IonInput, IonDatetime, IonModal, IonDatetimeButton, 
    IonSelectOption, IonList, IonButton, IonLabel, IonItem, IonCardContent, 
    IonCardTitle, IonCardHeader, IonCard, IonContent, IonTitle, IonToolbar, 
    IonHeader, CommonModule, FormsModule,IonSelect
  ],
  templateUrl: "./create-zoom.component.html",
  styleUrls: ["./create-zoom.component.scss"],
})
export class CreateZoomComponent implements OnInit {
  novoLink: string = '';
  codigoAcesso: string = '';
  data: string = '';
  selectedFormacaoToAddLink: Formation | null = null;
  selectedFormacaoToShowAulas: Formation | null = null;
  zoomsToShowByFormation: Zoom[] = [];
  formacoes: Formation[] = [];
  zooms: Zoom[] = [];
  formationIdSelected: string = '';

  constructor(private formacaoService: FormacaoService) {}

  ngOnInit() {
    this.formacaoService.getFormation().subscribe((formacoes: Formation[]) => {
      this.formacoes = formacoes;
    });
  }

  getZooms() {
    const id = this.selectedFormacaoToShowAulas?.id;
    this.formacaoService.getZoomByIdFormation(id).subscribe((zooms: Zoom[]) => {
      this.zoomsToShowByFormation = zooms;
    });
  }

  adicionarLink() {
    console.log(this.selectedFormacaoToAddLink);
    
    if (this.selectedFormacaoToAddLink && this.novoLink && this.data) {
      const novoNome = `${this.selectedFormacaoToAddLink.name} - ${this.data}`;
      const novoRegistro: Zoom = {
        lien: this.novoLink,
        code: this.codigoAcesso,
        date: this.data,
        formationStr: this.selectedFormacaoToAddLink.name,
        idFormation: this.selectedFormacaoToAddLink.id,
      };

      this.formacaoService.addFormacao(Date.now().toString(), novoRegistro).subscribe(() => {        
        this.novoLink = '';
        this.codigoAcesso = '';
        this.data = '';
      });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }
}