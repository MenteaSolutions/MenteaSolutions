import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CalendarService } from "../../Services/calendar.service";
import { CommonModule, JsonPipe } from "@angular/common";
import {
  FullCalendarComponent,
  FullCalendarModule,
} from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  IonLabel,
  IonItem,
  IonSelectOption,
  IonContent,
  IonSelect,
} from "@ionic/angular/standalone";
import { consumerPollProducersForChange } from "@angular/core/primitives/signals";
import { FireCalendarService } from "../create-calendar/fireCalendar.service";
import { Auth, User } from "@angular/fire/auth"; // Import Firebase Auth
import { ChatService } from "../chat/chat.service";

@Component({
  standalone: true,
  selector: "app-student-view",
  imports: [
    IonContent,
    IonItem,
    IonLabel,
    ReactiveFormsModule,
    CommonModule,
    FullCalendarModule,
    IonSelectOption,
    IonSelect,
  ],
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.css"],
})
export class CalendarComponent implements OnInit {
  roomId: string = ""; // Dynamiser le roomId
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;
  formacaoForm: FormGroup;
  formacoes: any[] = [];
  aulas: any[] = [];
  calendarOptions: CalendarOptions | undefined = {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin, interactionPlugin],
  };
  constructor(
    private chatService: ChatService,
    private auth: Auth,
    private fb: FormBuilder,
    private calendarService: CalendarService,
    private fireCalendarService: FireCalendarService
  ) {
    this.formacaoForm = this.fb.group({
      formacao: [""],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.calendarComponent.getApi().render();
    }, 250);

    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.chatService.getUserRoom(user.uid).subscribe(
          (userInfo: any) => {
            if (userInfo) {
              this.roomId = userInfo.room;
              this.loadAulas(this.roomId);
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


    this.calendarService
      .getFormacoes()
      .subscribe((formacoes) => (this.formacoes = formacoes));
      console.log(this.formacoes);
      
    // Recupera os eventos do localStorage
    const events = JSON.parse(localStorage.getItem("events") || "[]");

    this.formacaoForm.get("formacao")?.valueChanges.subscribe((formacaoId) => {
      this.loadAulas(formacaoId);
    });
  }

  async loadAulas(formacaoId: string) {
    this.calendarService
      .getAulasByFormacao(formacaoId)
      .subscribe(async (aulas) => {
        this.aulas = aulas;
        // Recupera as opções do calendário do fireCalendarService

        const { config, events } =
          await this.fireCalendarService.getCalendarByFormationId(formacaoId);

        this.calendarOptions = {
          initialView: "dayGridMonth",
          plugins: [dayGridPlugin, interactionPlugin],
          ...config,
        };

        const calendarApi = this.calendarComponent.getApi();
        setTimeout(() => {
          events.forEach((event: any) => {
            calendarApi.addEvent(event);
          });
        }, 250);
      });
  }
}
