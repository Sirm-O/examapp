export interface Student {
    id: string;
    admissionNumber: string;
    name: string;
    formId: string;
    streamId?: string;
    gender: 'male' | 'female';
    dateOfBirth?: string;
    parentContact?: string;
  }
  
  export interface Stream {
    id: string;
    name: string;
    formId: string;
  }
  
  export interface ExamSubject {
    subjectId: string;
    maxMarks: number;
  }
  
  export interface Exam {
    id: string;
    name: string;
    examTypeId: string;
    termId: string;
    year: number;
    startDate: string;
    endDate: string;
    subjects: ExamSubject[];
    gradingSystem: 'knec' | 'cbc';
  }
  
  export interface ExamResult {
    id: string;
    examId: string;
    studentId: string;
    subjectId: string;
    marks: number;
    maxMarks: number;
    percentage: number;
    grade?: string;
    points?: number;
    level?: number;
    comment?: string;
  }
  
  export interface Subject {
    id: string;
    name: string;
    code: string;
  }
  
  export interface Form {
    id: string;
    name: string;
  }
  
  export interface Term {
    id: string;
    name: string;
  }
  
  export interface ExamType {
    id: string;
    name: string;
  }
  
  export interface StudentResult {
    studentId: string;
    studentName: string;
    admissionNumber: string;
    results: {
      [subjectId: string]: {
        marks: number;
        maxMarks: number;
        percentage: number;
        grade?: string;
        points?: number;
        level?: number;
      }
    };
    totalMarks: number;
    totalMaxMarks: number;
    meanPercentage: number;
    meanGrade?: string;
    position?: number;
  }
  
  export interface ClassResult {
    examId: string;
    formId: string;
    streamId?: string;
    studentResults: StudentResult[];
  }
  
  export interface SubjectAnalysis {
    subjectId: string;
    subjectName: string;
    entries: number;
    meanScore: number;
    meanPercentage: number;
    meanGrade?: string;
    gradeDistribution: {
      [grade: string]: number;
    };
  }