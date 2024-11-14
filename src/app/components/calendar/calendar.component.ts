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
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;
  formacaoForm: FormGroup;
  formacoes: any[] = [];
  aulas: any[] = [];
  calendarOptions: CalendarOptions | undefined = {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin, interactionPlugin],
  };
  constructor(
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

    this.calendarService
      .getFormacoes()
      .subscribe((formacoes) => (this.formacoes = formacoes));
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
