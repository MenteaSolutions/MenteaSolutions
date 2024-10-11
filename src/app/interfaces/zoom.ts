import { Enregistrements } from "./enregistrements";

export interface Zoom {
    lien?: string; // Link opcional para a formação
    date?: string; // Data opcional da aula
    code?: string; // Código de acesso opcional para a formação
    idFormation?: string; // ID da formação
    formationStr?: string;
    enregistrements?: Enregistrements; // Array opcional de gravações da formação
}