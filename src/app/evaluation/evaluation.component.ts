import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import emailjs from "@emailjs/browser";
import { EmailJSResponseStatus } from "@emailjs/browser";
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonItem,
  IonImg,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonButton,
  IonSelectOption,
} from "@ionic/angular/standalone";

@Component({
  selector: "app-evaluation",
  standalone: true,
  imports: [
    IonButton,
    IonLabel,
    IonCardContent,
    IonCardTitle,
    IonImg,
    IonItem,
    IonCardHeader,
    IonCard,
    IonContent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    IonSelectOption,
  ],
  templateUrl: "./evaluation.component.html",
  styleUrls: ["./evaluation.component.scss"],
})
export class EvaluationComponent implements OnInit {
  evaluationForm!: FormGroup;
  currentStep: number = 0;
  totalSteps: number = 7;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.evaluationForm = this.fb.group({
      // Evaluation
      prenom: [""],
      nom: [""],
      telephone: [""],
      profession: [""],
      Formationsuivie: [""],
      Datesdelaformation: [""],
      // Formation et projet professionnel
      FormationPrincipale: [""],
      quellesort: [""],
      sinonPourquoi: [""],
      NomSociete: [""],
      VotreActivite: [""],
      VosProjetsActuels: [""],
      ouiCheckbox: [false],
      nonCheckbox: [false],
      LaFormationsuivieOui: [false],
      LaFormationsuivieNon: [false],
      LaFormationsuiviePasencore: [false],
      RechercheDemplois: [false],
      MandatsFreeLance: [false],
      Atelier: [false],
      Associe: [false],
      Indépendant: [false],
      Employe: [false],
      Aucune: [false],
      Reduite: [false],
      Moyenne: [false],
      Grande: [false],
      Majeure: [false],
      // Evaluation de la formation suivie
      VosAttentesOui: [false],
      VosAttentesNon: [false],
      VosConnaissancesOui: [false],
      VosConnaissancesNon: [false],
      JugerEnseignementNull: [false],
      JugerEnseignementBasique: [false],
      JugerEnseignementMoyen: [false],
      JugerEnseignementBon: [false],
      JugerEnseignementExcellent: [false],
      FaconGlobale: [""],
      NiveauConnaissances: [""],
      Durée: [""],
      Methodedidactique: [""],
      CompetancesProfessionelles: [""],
      ClarteDidactique: [""],
      Disponibilite: [""],
      Support: [""],
      Equipments: [""],
      locaux: [""],
      Ambiance: [""],
      ApprecieFormation: [""],
      // Les enseignants
      pasSouhaitable: [false],
      sansImportance: [false],
      souhaitable: [false],
      avantageux: [false],
      nicolasFazio: [""],
      camillePasche: [""],
      ramyElhany: [""],
      commentairesEnseignants: [""],
      commentaireEquipe: [""],
      faible: [false],
      moyenne: [false],
      bonne: [false],
      tresBonne: [false],
      // Le travail de projet
      moduleTravailpasUtile: [false],
      moduleTravailpeuUtile: [false],
      moduleTravailUtile: [false],
      moduleTravailtresUtile: [false],
      dureModuleOui: [false],
      dureModuleNon: [false],
      dureModulesouhaitable: [""],
      dossierProjetpasUtile: [false],
      dossierProjetpeuUtile: [false],
      dossierProjetUtile: [false],
      dossierProjettresUtile: [false],
      supportSuffisante: [false],
      supportInsuffisante: [false],
      jugezInefficace: [false],
      jugezpeuefficace: [false],
      jugezEfficace: [false],
      jugezTresefficace: [false],
      comm: [""],
      // L'encadrement
      compétences6: [""],
      Disponibilite6: [""],
      vosAttente6: [""],
      comm6: [""],

      // Le centre de formation
      autreFormation7: [""],
      siOui7: [""],
      centreDeFormation7: [""],
      dureeFormation7: [""],
      formationVosAttentes7: [""],
      classerNomadesNesaispas: [false],
      classerNomadesPire: [false],
      classerNomadesMoyen: [false],
      classerNomadesBon: [false],
      classerNomadesTresbon: [false],
      comm7: [""],
      uneAutreFormation7: [""],
      quelDomaine7: [""],
      autreCours7: [""],
      vosSuggestions7: [""],
      date7: [""],
    });

    this.loadFormData();
  }
  saveFormData() {
    if (typeof Storage !== "undefined") {
      const formData = this.evaluationForm.value;
      localStorage.setItem("evaluationFormData", JSON.stringify(formData));
    } else {
      console.error("localStorage is not supported in this browser.");
    }
  }

  loadFormData() {
    if (typeof Storage !== "undefined") {
      const savedFormData = localStorage.getItem("evaluationFormData");
      if (savedFormData) {
        try {
          const parsedFormData = JSON.parse(savedFormData);
          if (parsedFormData && Object.keys(parsedFormData).length > 0) {
            this.evaluationForm.patchValue(parsedFormData);
          } else {
            console.error("No valid data found in localStorage.");
          }
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
        }
      } else {
        console.error("No data found in localStorage.");
      }
    } else {
      console.error("localStorage is not supported in this browser.");
    }
  }
  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.saveFormData();
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.saveFormData();
      this.currentStep--;
    }
  }
  onSubmit() {
    // Kontrolloni nëse ka të dhëna në të paktën një fushë (opsional)
    const formValues = this.evaluationForm.value;

    // Kontrolloni nëse të paktën një fushë është plotësuar (opsionale)
    const atLeastOneFieldFilled = Object.values(formValues).some(
      (value) => value !== "" && value !== false
    );

    if (atLeastOneFieldFilled) {
      // Vazhdoni me dërgimin e email-it përmes EmailJS
      const templateParams = {
        // Evaluation
        prenom: formValues.prenom || "Non spécifié",
        nom: formValues.nom || "Non spécifié",
        telephone: formValues.telephone || "Non spécifié",
        profession: formValues.profession || "Non spécifié",
        Formationsuivie: formValues.Formationsuivie || "Non spécifié",
        Datesdelaformation: formValues.Datesdelaformation || "Non spécifié",
        // Formation et projet professionnel
        FormationPrincipale: formValues.FormationPrincipale || "Non spécifié",
        quellesort: formValues.quellesort || "Non spécifié",
        sinonPourquoi: formValues.sinonPourquoi || "Non spécifié",
        NomSociete: formValues.NomSociete || "Non spécifié",
        VotreActivite: formValues.VotreActivite || "Non spécifié",
        VosProjetsActuels: formValues.VosProjetsActuels || "Non spécifié",
        ouiCheckbox: formValues.ouiCheckbox ? "Oui" : "Non",
        nonCheckbox: formValues.nonCheckbox ? "Oui" : "Non",
        LaFormationsuivieOui: formValues.LaFormationsuivieOui ? "Oui" : "Non",
        LaFormationsuivieNon: formValues.LaFormationsuivieNon ? "Oui" : "Non",
        LaFormationsuiviePasencore: formValues.LaFormationsuiviePasencore
          ? "Oui"
          : "Non",
        RechercheDemplois: formValues.RechercheDemplois ? "Oui" : "Non",
        MandatsFreeLance: formValues.MandatsFreeLance ? "Oui" : "Non",
        Atelier: formValues.Atelier ? "Oui" : "Non",
        Associe: formValues.Associe ? "Oui" : "Non",
        Indépendant: formValues.Indépendant ? "Oui" : "Non",
        Employe: formValues.Employe ? "Oui" : "Non",
        // Utilité à l'avenir
        Aucune: formValues.Aucune ? "Oui" : "Non",
        Reduite: formValues.Reduite ? "Oui" : "Non",
        Moyenne: formValues.Moyenne ? "Oui" : "Non",
        Grande: formValues.Grande ? "Oui" : "Non",
        Majeure: formValues.Majeure ? "Oui" : "Non",
        // Evaluation de la formation suivie
        VosAttentesOui: formValues.VosAttentesOui ? "Oui" : "Non",
        VosAttentesNon: formValues.VosAttentesNon ? "Oui" : "Non",
        VosConnaissancesOui: formValues.VosConnaissancesOui ? "Oui" : "Non",
        VosConnaissancesNon: formValues.VosConnaissancesNon ? "Oui" : "Non",
        JugerEnseignementNull: formValues.JugerEnseignementNull ? "Oui" : "Non",
        JugerEnseignementBasique: formValues.JugerEnseignementBasique
          ? "Oui"
          : "Non",
        JugerEnseignementMoyen: formValues.JugerEnseignementMoyen
          ? "Oui"
          : "Non",
        JugerEnseignementBon: formValues.JugerEnseignementBon ? "Oui" : "Non",
        JugerEnseignementExcellent: formValues.JugerEnseignementExcellent
          ? "Oui"
          : "Non",
        FaconGlobale: formValues.FaconGlobale || "Non spécifié",
        NiveauConnaissances: formValues.NiveauConnaissances || "Non spécifié",
        Durée: formValues.Durée || "Non spécifié",
        Methodedidactique: formValues.Methodedidactique || "Non spécifié",
        CompetancesProfessionelles:
          formValues.CompetancesProfessionelles || "Non spécifié",
        ClarteDidactique: formValues.ClarteDidactique || "Non spécifié",
        Disponibilite: formValues.Disponibilite || "Non spécifié",
        Support: formValues.Support || "Non spécifié",
        Equipments: formValues.Equipments || "Non spécifié",
        locaux: formValues.locaux || "Non spécifié",
        Ambiance: formValues.Ambiance || "Non spécifié",
        ApprecieFormation: formValues.ApprecieFormation || "Non spécifié",
        // Les enseignants
        pasSouhaitable: formValues.pasSouhaitable ? "Oui" : "Non",
        sansImportance: formValues.sansImportance ? "Oui" : "Non",
        souhaitable: formValues.souhaitable ? "Oui" : "Non",
        avantageux: formValues.avantageux ? "Oui" : "Non",
        nicolasFazio: formValues.nicolasFazio || "Non spécifié",
        camillePasche: formValues.camillePasche || "Non spécifié",
        ramyElhany: formValues.ramyElhany || "Non spécifié",
        commentairesEnseignants:
          formValues.commentairesEnseignants || "Non spécifié",
        commentaireEquipe: formValues.commentaireEquipe || "Non spécifié",
        faible: formValues.faible ? "Oui" : "Non",
        moyenne: formValues.moyenne ? "Oui" : "Non",
        bonne: formValues.bonne ? "Oui" : "Non",
        tresBonne: formValues.tresBonne ? "Oui" : "Non",
        // Le travail de projet
        moduleTravailpasUtile: formValues.moduleTravailpasUtile ? "Oui" : "Non",
        moduleTravailpeuUtile: formValues.moduleTravailpeuUtile ? "Oui" : "Non",
        moduleTravailUtile: formValues.moduleTravailUtile ? "Oui" : "Non",
        moduleTravailtresUtile: formValues.moduleTravailtresUtile
          ? "Oui"
          : "Non",
        dureModuleOui: formValues.dureModuleOui ? "Oui" : "Non",
        dureModuleNon: formValues.dureModuleNon ? "Oui" : "Non",
        dureModulesouhaitable:
          formValues.dureModulesouhaitable || "Non spécifié",
        dossierProjetpasUtile: formValues.dossierProjetpasUtile ? "Oui" : "Non",
        dossierProjetpeuUtile: formValues.dossierProjetpeuUtile ? "Oui" : "Non",
        dossierProjetUtile: formValues.dossierProjetUtile ? "Oui" : "Non",
        dossierProjettresUtile: formValues.dossierProjettresUtile
          ? "Oui"
          : "Non",
        supportSuffisante: formValues.supportSuffisante ? "Oui" : "Non",
        supportInsuffisante: formValues.supportInsuffisante ? "Oui" : "Non",
        jugezInefficace: formValues.jugezInefficace ? "Oui" : "Non",
        jugezpeuefficace: formValues.jugezpeuefficace ? "Oui" : "Non",
        jugezEfficace: formValues.jugezEfficace ? "Oui" : "Non",
        jugezTresefficace: formValues.jugezTresefficace ? "Oui" : "Non",
        comm: formValues.comm || "Aucun commentaire",
        // L'encadrement
        compétences6: formValues.competences6 || "Non spécifié",
        Disponibilite6: formValues.Disponibilite6 || "Non spécifié",
        vosAttente6: formValues.vosAttente6 || "Non spécifié",
        comm6: formValues.comm6 || "Aucun commentaire",

        // Le centre de formation
        autreFormation7: formValues.autreFormation7 || "Non spécifié",
        siOui7: formValues.siOui7 || "Non spécifié",
        centreDeFormation7: formValues.centreDeFormation7 || "Non spécifié",
        dureeFormation7: formValues.dureeFormation7 || "Non spécifié",
        formationVosAttentes7:
          formValues.formationVosAttentes7 || "Non spécifié",
        classerNomadesNesaispas: formValues.classerNomadesNesaispas
          ? "Oui"
          : "Non",
        classerNomadesPire: formValues.classerNomadesPire ? "Oui" : "Non",
        classerNomadesMoyen: formValues.classerNomadesMoyen ? "Oui" : "Non",
        classerNomadesBon: formValues.classerNomadesBon ? "Oui" : "Non",
        classerNomadesTresbon: formValues.classerNomadesTresbon ? "Oui" : "Non",
        comm7: formValues.comm7 || "Non spécifié",
        uneAutreFormation7: formValues.uneAutreFormation7 || "Non spécifié",
        quelDomaine7: formValues.quelDomaine7 || "Non spécifié",
        autreCours7: formValues.autreCours7 || "Non spécifié",
        vosSuggestions7: formValues.vosSuggestions7 || "Non spécifié",
        date7: formValues.date7 || "Non spécifié",
      };
      emailjs
        .send(
          "service_kp6gkt5",
          "template_fc91b75",
          templateParams,
          "Zo5MFAabBvPWZ_u9t"
        )
        .then(
          (response: EmailJSResponseStatus) => {
            window.alert("Formulari u dërgua me sukses!");
            this.evaluationForm.reset();
            this.currentStep = 0;
            localStorage.removeItem("evaluationFormData");
          },
          (error: any) => {
            console.error("FAILED...", error);
            window.alert(
              "Dështoi dërgimi i formularit. Ju lutem provoni përsëri."
            );
          }
        );
    } else {
      // Trego një mesazh nëse nuk është plotësuar asnjë fushë
      window.alert(
        "Ju lutem plotësoni të paktën një fushë për të dërguar formularin."
      );
    }
  }
}
