import { Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  doc,
  setDoc,
  collectionData,
  CollectionReference,
  getDoc,
  getDocs,
  docData,
  where,
  query,
} from "@angular/fire/firestore";
import { Observable, firstValueFrom, from, map } from "rxjs";
import { Formation } from "../../interfaces/formation";

@Injectable({
  providedIn: "root",
})
export class FireCalendarService {
  private formationCollection: CollectionReference;
  private calendarCollection: CollectionReference;
  private eventsCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.formationCollection = collection(this.firestore, "formation");
    this.calendarCollection = collection(this.firestore, "calendar");
    this.eventsCollection = collection(this.firestore, "events");
  }

  getFormation(): Observable<Formation[]> {
    return collectionData(this.formationCollection, {
      idField: "id",
    }) as Observable<Formation[]>;
  }

  async addCalendar(data: any): Promise<void> {
    const existingCalendar = await this.getCalendarByFormationId(
      data.idFormation
    );
    if (existingCalendar) {
      const calendarDoc = doc(this.calendarCollection, existingCalendar.id);
      await setDoc(calendarDoc, data);
    } else {
      const calendarDoc = doc(this.calendarCollection, Date.now().toString());
      await setDoc(calendarDoc, data);
    }
  }

  async getCalendarByFormationId(formacaoId: string): Promise<any> {
    const querySnapshot = await getDocs(
      query(this.calendarCollection, where("idFormation", "==", formacaoId))
    );

    // Verifica se existe algum documento que corresponda à consulta
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]; // Pega o primeiro documento correspondente
      return { id: doc.id, ...doc.data() }; // Retorna o ID do documento
    } else {
      return { config: null, events: null }; // Se nenhum documento for encontrado
    }
  }

  async getCalendarOptions(formacaoId: string): Promise<any> {
    let calendar = await this.getCalendarByFormationId(formacaoId);
    if (!calendar) {
      throw new Error("Calendar not found");
    }

    return calendar?.config;
  }

  async addEvent(event: any): Promise<void> {
    const eventDoc = doc(this.eventsCollection, Date.now().toString());
    await setDoc(eventDoc, event);
  }
}
