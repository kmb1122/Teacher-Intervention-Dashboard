export interface StudentGrades {
  math: number;
  reading: number;
  writing: number;
  "social studies": number;
  science: number;
  PE: number;
  FACS: number;
  UA: number;
}

export interface Student {
  id: number;
  name: string;
  homeroom: string;
  grades: StudentGrades;
  GPA: number;
}
