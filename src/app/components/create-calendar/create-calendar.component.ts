import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, ReactiveFormsModule } from "@angular/forms";
import {
  FullCalendarComponent,
  FullCalendarModule,
} from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Swal from "sweetalert2"; // Adicione esta linha
import { CalendarService } from "../../Services/calendar.service";
import { FireCalendarService } from "./fireCalendar.service";
import {
  IonContent,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonDatetimeButton,
  IonModal,
} from "@ionic/angular/standalone";
import { CommonModule } from "@angular/common";
import { FormacaoService } from "../create-zoom/formacao.service";
import { firstValueFrom } from "rxjs";
@Component({
  selector: "app-create-calendar",
  standalone: true,
  imports: [
    IonModal,
    IonDatetimeButton,
    IonDatetime,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonContent,
    FullCalendarModule,
    CommonModule,
    IonSelect,
    IonSelectOption,
    ReactiveFormsModule,
  ],
  templateUrl: "./create-calendar.component.html",
  styleUrls: ["./create-calendar.component.css"],
})
export class CreateCalendarComponent implements OnInit {
  @ViewChild("calendar") calendarComponent!: FullCalendarComponent;
  aulaForm: FormGroup;
  formacaoSelected: any;
  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    validRange: {
      start: "2024-10-01",
      end: "2024-10-20",
    },
    weekends: false,
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    unselectAuto: true,
    selectMirror: true,
    longPressDelay: 100,
    height: "auto",
    locale: "fr",
    timeZone: "UTC",
    eventResizableFromStart: true,
    editable: false, // Permitir que outros eventos sejam editáveis
    eventDurationEditable: false,
    droppable: false,
    // Adicionando eventos de feriados
    events: [], // Inicialmente vazio, será preenchido no ngOnInit

    // Função para criação de eventos
    select: this.onSelect.bind(this),

    // Função para deletar eventos
    eventClick: this.onEventClick.bind(this),
  };

  sendButtonDisabled: boolean = true;
  formacoes: any[] = [];

  // Lista de feriados na Suíça para 2024
  feriados = [
    { title: "Nouvel An", date: "2024-01-01" },
    { title: "Vendredi Saint", date: "2024-03-29" },
    { title: "Pâques", date: "2024-03-31" },
    { title: "Lundi de Pâques", date: "2024-04-01" },
    { title: "Fête du Travail", date: "2024-05-01" },
    { title: "Ascension", date: "2024-05-09" },
    { title: "Pentecôte", date: "2024-05-19" },
    { title: "Lundi de Pentecôte", date: "2024-05-20" },
    { title: "Fête Nationale Suisse", date: "2024-08-01" },
    { title: "Assomption", date: "2024-08-15" },
    { title: "Journée de la Réforme", date: "2024-10-31" },
    { title: "Toussaint", date: "2024-11-01" },
    { title: "Noël", date: "2024-12-25" },
    { title: "Boxing Day", date: "2024-12-26" },
  ];

  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService,
    private fireCalendarService: FireCalendarService,
    private formacaoService: FormacaoService
  ) {
    this.aulaForm = this.fb.group({
      titulo: [""],
      descricao: [""],
      dataInicio: [],
      dataFim: [],
      horaInicio: [],
      horaFim: [],
      professor: [""],
      formacao: [""],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.calendarComponent.getApi().render();
    }, 500);

    this.calendarService
      .getFormacoes()
      .subscribe((formacoes) => (this.formacoes = formacoes));

    this.calendarService.getDates().subscribe((dates) => {
      this.calendarOptions.validRange = {
        start: dates.start,
        end: dates.end,
      };
    });

    const formacaoSelecionada = localStorage.getItem("formacaoSelecionada");
    if (formacaoSelecionada) {
      this.aulaForm.patchValue({ formacao: formacaoSelecionada });
      this.loadAulas(formacaoSelecionada);
    }

    // Adiciona os feriados ao calendário
    this.calendarOptions.events = [
      ...this.feriados.map((feriado) => ({
        title: feriado.title,
        date: feriado.date,
        editable: false, // Define os feriados como não editáveis
        allDay: true, // Assume que todos os feriados são eventos de dia inteiro
      })),
    ]; // Adiciona os feriados à lista de eventos

    this.initializeCalendar();
  }

  initializeCalendar() {
    this.calendarService.getCalendars().subscribe((calendars: any[]) => {
      if (calendars) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.removeAllEvents();
        calendars.forEach((calendarios) => {
          if (calendarios.events && calendarios.events.length) {
            calendarios.events.forEach((event: any) => {
              const title =
                event.title +
                (calendarios.idFormation
                  ? " - (" + calendarios.idFormation + ")"
                  : "");
              const color = calendarios.color;
              calendarApi.addEvent({
                title: title,
                start: event.start,
                end: event.end,
                allDay: event.allDay,
                color: color,
              });
            });
          }
        });
      }
    });
  }

  // Método de criação de eventos
  onSelect(info: any) {
    if (!this.validFields() && !this.sendButtonDisabled) {
      Swal.fire({
        title: "Créer un nouvel événement?",
        html: `
          <div style="margin-bottom: 10px;">Nom de l'événement :</div>
          <input type="text" id="event_name" class="form-control" />
        `,
        showCancelButton: true,
        confirmButtonText: "Oui, créez-le!",
        heightAuto: false,
        cancelButtonText: "Non, retour",
        width: "400px", // Ajuste o tamanho da largura conforme necessário
        padding: "1em", // Ajuste o padding para evitar áreas em branco
        customClass: {
          popup: "my-swal-popup", // Classe CSS para estilizar o popup, se necessário
        },
      }).then((result) => {
        if (result.value) {
          const title = (
            document.getElementById("event_name") as HTMLInputElement
          ).value;
          if (title) {
            const calendarApi = this.calendarComponent.getApi();
            calendarApi.addEvent({
              title: title,
              start: info.startStr,
              end: info.endStr,
              allDay: info.allDay,
            });
          }
        }
      });
    }
  }

  // Método de exclusão de eventos
  onEventClick(info: any) {
    // Verifica se o evento é um feriado
    if (this.feriados.some((feriado) => feriado.date === info.event.startStr)) {
      Swal.fire({
        text: "C'est un jour férié et il ne peut pas être supprimé.",
        icon: "warning",
        heightAuto: false,
      });
      return; // Não permite a exclusão
    }

    Swal.fire({
      text: "Êtes-vous sûr de vouloir supprimer cet événement?",
      icon: "warning",
      showCancelButton: true,
      heightAuto: false,
      confirmButtonText: "Oui, supprimez-le!",
      cancelButtonText: "Non, retour",
    }).then((result) => {
      if (result.value) {
        console.log(result);
        console.log(info);
        this.calendarService
          .removeEventByTitle(
            this.getFormationByTitle(info.event._def.title),
            this.removeFormationFromTitle(info.event._def.title)
          )
          .then((data) => {
            this.initializeCalendar();
          });
      }
    });
  }

  getFormationByTitle(title: string): string {
    const regex = /\(([^)]+)\)/;
    const match = title.match(regex);

    if (match) {
      return match[1];
    }
    return "";
  }

  removeFormationFromTitle(title: string): string {
    return title.replace(/ - \(.*\)/, "");
  }

  adicionarAula() {
    const novaAula = this.aulaForm.value;

    // Atualizar o validRange do FullCalendar com base nos valores do formulário
    const calendarApi = this.calendarComponent.getApi();
    this.calendarOptions.validRange = {
      start: novaAula.horaInicio,
      end: novaAula.horaFim,
    };

    // Atualizar o calendário para aplicar as mudanças
    calendarApi.setOption("validRange", this.calendarOptions.validRange);
    calendarApi.render();
    this.sendButtonDisabled = false;
    this.calendarOptions.editable = true;
    this.calendarOptions.eventDurationEditable = true;
    this.calendarOptions.droppable = true;
  }

  loadAulas(formacaoId: any) {
    this.formacaoSelected = formacaoId.id;
    this.calendarService.getAulasByFormacao(formacaoId).subscribe((aulas) => {
      this.calendarOptions.events = aulas;
    });
  }

  // Método para enviar todas as aulas para o localStorage e redirecionar para a página de visualização
  async send() {
    const calendarApi = this.calendarComponent.getApi();
    const events = calendarApi.getEvents();
    if (events && events.length > 0) {
      const calendarEvents = JSON.parse(JSON.stringify(events));

      const { plugins, select, eventClick, editable, selectable, ...config } =
        this.calendarOptions;

      const color = await this.getColorFormation(
        this.aulaForm.value.formacao.id
      );

      const data = {
        config,
        idFormation: this.aulaForm.value.formacao.id,
        events: calendarEvents,
        nameFormation: this.aulaForm.value.formacao.nome,
        color: color,
      };

      await this.fireCalendarService.addCalendar(data);

      this.calendarOptions.events = [];
      this.initializeCalendar();
      this.sendButtonDisabled = true;

      this.aulaForm.patchValue({
        formacao: null,
        professor: null,
        horaInicio: null,
        horaFim: null,
      });
      this.calendarOptions.editable = false;
      this.calendarOptions.eventDurationEditable = false;
      this.calendarOptions.droppable = false;
      calendarApi.setOption("validRange", undefined);
    }
  }

  loadEventsFromLocalStorage() {
    const storedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    const calendarApi = this.calendarComponent.getApi();
    storedEvents.forEach((event: any) => {
      calendarApi.addEvent(event);
    });
  }

  async getColorFormation(id: string): Promise<any> {
    const formation = await firstValueFrom(
      this.formacaoService.getFormationById(id)
    );
    if (formation) {
      return formation.color;
    }
    return null;
  }

  validFields(): boolean {
    if (
      !this.aulaForm.value.formacao ||
      !this.aulaForm.value.professor ||
      !this.aulaForm.value.horaInicio ||
      !this.aulaForm.value.horaFim
    ) {
      return true;
    }
    return false;
  }
}
