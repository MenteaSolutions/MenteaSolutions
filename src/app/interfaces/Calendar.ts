// Calendario de Aulas
export interface Aula {
  id: number;
  titulo: string;
  descricao: string;
  data: Date;
  hora: string;
  professor: string;
  alunosPresentes: number[]; // IDs dos alunos presentes
}

// Presença do Aluno
export interface Presenca {
  id: number;
  alunoId: number;
  aulaId: number;
  presente: boolean;
}
