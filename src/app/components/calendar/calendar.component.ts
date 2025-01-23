import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CalendarService } from "../../Services/calendar.service";
import { CommonModule } from "@angular/common";
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
import { FireCalendarService } from "../create-calendar/fireCalendar.service";
import { UserService } from "../../Services/user.service";

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
  formationUserLogged: any;
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;
  formacaoForm: FormGroup;
  formacoes: any[] = [];
  aulas: any[] = [];
  calendarOptions: CalendarOptions | undefined = {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin, interactionPlugin],
  };

  constructor(
    private userService: UserService,
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

    this.userService
      .getUserFormation()
      .then((formation) => {
        if (formation) {
          this.formationUserLogged = formation;
          this.loadAulas(formation.id);
        }
      })
      .catch((error) => {
        console.error("Erro ao obter a formação:", error);
      });
  }

  async loadAulas(formacaoId: string) {
    this.calendarService
      .getAulasByFormacao(formacaoId)
      .subscribe(async (aulas) => {
        if (aulas) {
          this.aulas = aulas;
          // Recupera as opções do calendário do fireCalendarService

          const { config, events } =
            await this.fireCalendarService.getCalendarByFormationId(formacaoId);

          if (config && events) {
            this.calendarOptions = {
              initialView: "dayGridMonth",
              plugins: [dayGridPlugin, interactionPlugin],
              ...config,
              editable: false,
              eventResizableFromStart: false,
              eventDurationEditable: false,
            };

            const calendarApi = this.calendarComponent.getApi();
            setTimeout(() => {
              events.forEach((event: any) => {
                calendarApi.addEvent(event);
              });
            }, 250);
          }
        }
      });
  }
}
