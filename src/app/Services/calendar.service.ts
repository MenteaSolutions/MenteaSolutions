import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import {
  Firestore,
  collection,
  collectionData,
  CollectionReference,
  where,
  query,
} from "@angular/fire/firestore";
import { Calendar } from "@fullcalendar/core/index.js";
import { getDocs, updateDoc } from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  private formacoesSubject = new BehaviorSubject<any[]>([]);
  formacoes$ = this.formacoesSubject.asObservable();

  private datesSubject = new BehaviorSubject<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  dates$ = this.datesSubject.asObservable();

  private aulasSubject = new BehaviorSubject<{ [formacaoId: string]: any[] }>(
    {}
  );
  aulas$ = this.aulasSubject.asObservable();

  private calendarCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.calendarCollection = collection(this.firestore, "calendar");
    // Inicializar com dados de exemplo
    this.formacoesSubject.next([
      { id: "WD", nome: "Web Designer (WD)", enregistrements: [] },
      { id: "WPR", nome: "Web Programmer (WPr)", enregistrements: [] },
      {
        id: "MWAD",
        nome: "Mobile Web Application Developer (MWAD)",
        enregistrements: [],
      },
      { id: "PSE", nome: "Python Software Engineer(PSE)", enregistrements: [] },
      { id: "PDA", nome: "Data Analysis (PDA)", enregistrements: [] },
      {
        id: "DAF",
        nome: "Data Science pour la Finance (DAF)",
        enregistrements: [],
      },
      { id: "DMM", nome: "Digital Marketing (DMM)", enregistrements: [] },
    ]);

    this.datesSubject.next({
      start: "",
      end: "",
    });
  }

  getFormacoes() {
    return this.formacoes$;
  }

  setFormacoes(formacoes: any[]) {
    this.formacoesSubject.next(formacoes);
  }

  getDates() {
    return this.dates$;
  }

  setDates(start: string, end: string) {
    this.datesSubject.next({ start, end });
  }

  addAulaToFormacao(formacaoId: string, aula: any) {
    const currentAulas = this.aulasSubject.value;
    if (!currentAulas[formacaoId]) {
      currentAulas[formacaoId] = [];
    }
    currentAulas[formacaoId].push(aula);
    this.aulasSubject.next(currentAulas);
  }

  getAulasByFormacao(formacaoId: string) {
    return this.aulasSubject
      .asObservable()
      .pipe(map((aulas) => aulas[formacaoId] || []));
  }

  getCalendars(): Observable<Calendar[]> {
    return collectionData(this.calendarCollection) as Observable<Calendar[]>;
  }

  async removeEventByTitle(
    formationId: string,
    eventTitle: string
  ): Promise<void> {
    try {
      const collectionRef = collection(this.firestore, "calendar");
      const q = query(collectionRef, where("idFormation", "==", formationId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref; // Assume que há um documento correspondente
        const calendar = querySnapshot.docs[0].data() as any;

        // Filtra os eventos para remover o item com o título especificado
        const updatedEvents = calendar.events.filter((event: any) => {
          return event.title !== eventTitle;
        });

        // Atualiza o documento no Firestore
        await updateDoc(docRef, { events: updatedEvents });
        console.log(`Evento com título "${eventTitle}" removido.`);
      } else {
        console.warn(
          "Nenhum documento encontrado com o idFormation especificado."
        );
      }
    } catch (error) {
      console.error("Erro ao remover evento:", error);
      throw error;
    }
  }
}
