import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";

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

  private aulasSubject = new BehaviorSubject<{ [formacaoId: string]: any[] }>({});
  aulas$ = this.aulasSubject.asObservable();

  constructor() {
    // Inicializar com dados de exemplo
    this.formacoesSubject.next([
      { id: "WD", nome: "Web Designer (WD)", enregistrements: [] },
      { id: "WPR", nome: "Web Programmer (WPr)", enregistrements: [] },
      {
        id: 'MWAD',
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
    return this.aulasSubject.asObservable().pipe(
      map(aulas => aulas[formacaoId] || [])
    );
  }
}