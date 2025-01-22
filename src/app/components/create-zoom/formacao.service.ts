import { Injectable } from "@angular/core";
import {
  Firestore,
  collection,
  doc,
  setDoc,
  collectionData,
  CollectionReference,
  where,
  query,
  docData,
} from "@angular/fire/firestore";
import { Observable, from } from "rxjs";
import { Zoom } from "../../interfaces/zoom";
import { Formation } from "../../interfaces/formation";

// Interface que define a estrutura de um objeto Formacao

@Injectable({
  providedIn: "root", // O serviço é fornecido na raiz da aplicação
})
export class FormacaoService {
  // Referências para as coleções do Firestore
  private zoomCollection: CollectionReference;
  private formationCollection: CollectionReference;

  // Construtor do serviço, injeta Firestore
  constructor(private firestore: Firestore) {
    // Inicialização das referências para as coleções do Firestore
    this.zoomCollection = collection(this.firestore, "zoom");
    this.formationCollection = collection(this.firestore, "formation");
  }

  // Método para obter todas as formações da coleção 'formation'
  getZooms(): Observable<Zoom[]> {
    // Utilização de collectionData para obter os dados da coleção
    return collectionData(this.zoomCollection, {
      idField: "id",
    }) as Observable<Zoom[]>;
  }

  getFormation(): Observable<Formation[]> {
    // Utilização de collectionData para obter os dados da coleção
    return collectionData(this.formationCollection, {
      idField: "id",
    }) as Observable<Formation[]>;
  }

  getFormationById(id: string): Observable<Formation | null> {
    const docRef = doc(this.firestore, `formation/${id}`);
    return docData(docRef) as Observable<Formation | null>;
  }

  getZoomByIdFormation(id?: string): Observable<Zoom[]> {
    const q = query(this.zoomCollection, where("idFormation", "==", id));
    return collectionData(q, { idField: "id" }) as Observable<Zoom[]>;
  }

  getFormationByName(name?: string): Observable<Zoom[]> {
    const q = query(this.formationCollection, where("name", "==", name));
    return collectionData(q, { idField: "id" }) as Observable<Zoom[]>;
  }

  // Método para adicionar os links, codigos de acesso e data da aula à coleção 'zoom' ligada ao ID da formação
  addFormacao(id: string, formacao: Zoom): Observable<void> {
    // Cria um documento com o ID da formação na coleção 'zoom', com o nome da formação
    const zoomDoc = doc(this.zoomCollection, id);
    // Adiciona os dados da formação ao documento criado
    return from(setDoc(zoomDoc, formacao));
  }
}
