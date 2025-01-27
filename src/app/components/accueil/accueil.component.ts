import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { IonImg, IonCardHeader, IonContent, IonCard, IonCardTitle, IonCardContent, IonButton, IonGrid, IonRow, IonCol } from "@ionic/angular/standalone";

@Component({
  selector: 'app-accueil',
  standalone: true,
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
  imports: [ IonCol, IonRow, IonGrid, IonImg, IonButton, IonCardContent, IonCardTitle, IonCard, IonContent, IonCardHeader, RouterModule , NgFor],
})
export class AccueilComponent implements OnInit {

  cards = [
    {
      title: 'Profil',
      description: 'Accédez à votre espace personnel pour consulter vos informations, mettre à jour vos détails, et personnaliser votre expérience sur la plateforme. Votre profil est le cœur de vos interactions avec Nomades.',
      link: '/user',
      buttonText: 'Accéder à mon profil',
    },
    {
      title: 'Chat',
      description: 'Entrez en contact avec les autres utilisateurs via notre système de chat intuitif. Participez à des discussions de groupe pour échanger vos idées et collaborer efficacement.',
      link: '/chat',
      buttonText: 'Ouvrir le chat',
    },
    {
      title: 'Zoom',
      description: 'Rejoignez vos réunions Zoom directement depuis la plateforme. Configurez vos paramètres de visioconférence pour optimiser vos échanges et profiter d’une expérience fluide lors de vos sessions en ligne.',
      link: '/zoom',
      buttonText: 'Accéder aux réunions',
    },
    {
      title: 'Calendrier',
      description: 'Organisez votre emploi du temps avec notre calendrier intégré. Consultez vos événements à venir, et ne manquez jamais un rendez-vous important grâce à une vue claire et intuitive.',
      link: '/calendar',
      buttonText: 'Voir mon calendrier',
    },
  ];
  
  

  constructor() { }

  ngOnInit() {}
}
