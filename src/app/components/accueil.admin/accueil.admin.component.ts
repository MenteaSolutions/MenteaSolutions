import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { IonImg, IonCardHeader, IonContent, IonCard, IonCardTitle, IonCardContent, IonButton, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";

@Component({
  selector: 'app-accueil',
  standalone: true,
  templateUrl: './accueil.admin.component.html',
  styleUrls: ['./accueil.admin.component.scss'],
  imports: [ IonCol, IonRow, IonGrid, IonImg, IonButton, IonCardContent, IonCardTitle, IonCard, IonContent, IonCardHeader, RouterModule , NgFor],
})
export class AccueilAdminComponent implements OnInit {

  cards = [
    {
      title: 'Nouvelle classe',
      description: 'Créez de nouveaux élèves, attribuez-les à une formation, et donnez-leur accès à l’application.',

      link: '/createUser',
      buttonText: 'Accès aux nouveaux élèves',
    },
    {
      title: 'Salle de chat',
      description: 'Accédez aux salles de chat des formations pour interagir avec tous les élèves et surveiller leurs discussions.',
      link: '/createChat',
      buttonText: 'Ouvrir les salles',
    },
    {
      title: 'Lien Zoom',
      description: 'Ajoutez les liens des enregistrements Zoom aux formations correspondantes pour que les élèves puissent y accéder.',
      link: '/createZoom',
      buttonText: 'Accéder aux réunions',
    },
    {
      title: 'Calendrier',
      description: 'Mettez à jour le calendrier des formations pour que les élèves aient une vue claire des événements et des sessions.',
      link: '/createCalendar',
      buttonText: 'Accéder aux calendrier',
    },
  ];
  
  
  

  constructor() { }

  ngOnInit() {}
}
