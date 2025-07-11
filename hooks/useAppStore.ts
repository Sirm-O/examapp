import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student, Stream, Exam, ExamResult } from '@/types';
import { mockStudents, mockStreams, mockExams, mockExamResults } from '@/mocks/data';

interface AppState {
  students: Student[];
  streams: Stream[];
  exams: Exam[];
  examResults: ExamResult[];
  selectedExamId: string | null;
  selectedFormId: string | null;
  selectedStreamId: string | null;
  isLoading: boolean;
  
  // Actions
  setSelectedExamId: (id: string | null) => void;
  setSelectedFormId: (id: string | null) => void;
  setSelectedStreamId: (id: string | null) => void;
  
  // Data operations
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  
  addExam: (exam: Exam) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (id: string) => void;
  
  addExamResult: (result: ExamResult) => void;
  updateExamResult: (result: ExamResult) => void;
  deleteExamResult: (id: string) => void;
  
  // Save methods
  saveStudents: () => Promise<void>;
  saveExams: () => Promise<void>;
  saveExamResults: () => Promise<void>;
  saveStreams: () => Promise<void>;
  
  // Initialize with mock data
  initializeData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  students: [],
  streams: [],
  exams: [],
  examResults: [],
  selectedExamId: null,
  selectedFormId: null,
  selectedStreamId: null,
  isLoading: true,
  
  setSelectedExamId: (id) => set({ selectedExamId: id }),
  setSelectedFormId: (id) => set({ selectedFormId: id }),
  setSelectedStreamId: (id) => set({ selectedStreamId: id }),
  
  addStudent: (student) => {
    set((state) => ({
      students: [...state.students, student]
    }));
    get().saveStudents();
  },
  
  updateStudent: (student) => {
    set((state) => ({
      students: state.students.map(s => s.id === student.id ? student : s)
    }));
    get().saveStudents();
  },
  
  deleteStudent: (id) => {
    set((state) => ({
      students: state.students.filter(s => s.id !== id)
    }));
    get().saveStudents();
  },
  
  addExam: (exam) => {
    set((state) => ({
      exams: [...state.exams, exam]
    }));
    get().saveExams();
  },
  
  updateExam: (exam) => {
    set((state) => ({
      exams: state.exams.map(e => e.id === exam.id ? exam : e)
    }));
    get().saveExams();
  },
  
  deleteExam: (id) => {
    set((state) => ({
      exams: state.exams.filter(e => e.id !== id)
    }));
    get().saveExams();
  },
  
  addExamResult: (result) => {
    set((state) => ({
      examResults: [...state.examResults, result]
    }));
    get().saveExamResults();
  },
  
  updateExamResult: (result) => {
    set((state) => ({
      examResults: state.examResults.map(r => r.id === result.id ? result : r)
    }));
    get().saveExamResults();
  },
  
  deleteExamResult: (id) => {
    set((state) => ({
      examResults: state.examResults.filter(r => r.id !== id)
    }));
    get().saveExamResults();
  },
  
  saveStudents: async () => {
    try {
      await AsyncStorage.setItem('students', JSON.stringify(get().students));
    } catch (error) {
      console.error('Error saving students:', error);
    }
  },
  
  saveExams: async () => {
    try {
      await AsyncStorage.setItem('exams', JSON.stringify(get().exams));
    } catch (error) {
      console.error('Error saving exams:', error);
    }
  },
  
  saveExamResults: async () => {
    try {
      await AsyncStorage.setItem('examResults', JSON.stringify(get().examResults));
    } catch (error) {
      console.error('Error saving exam results:', error);
    }
  },
  
  saveStreams: async () => {
    try {
      await AsyncStorage.setItem('streams', JSON.stringify(get().streams));
    } catch (error) {
      console.error('Error saving streams:', error);
    }
  },
  
  initializeData: async () => {
    set({ isLoading: true });
    
    try {
      // Try to load data from AsyncStorage
      const studentsData = await AsyncStorage.getItem('students');
      const streamsData = await AsyncStorage.getItem('streams');
      const examsData = await AsyncStorage.getItem('exams');
      const resultsData = await AsyncStorage.getItem('examResults');
      
      // If no data exists, use mock data
      const students = studentsData ? JSON.parse(studentsData) : mockStudents;
      const streams = streamsData ? JSON.parse(streamsData) : mockStreams;
      const exams = examsData ? JSON.parse(examsData) : mockExams;
      const examResults = resultsData ? JSON.parse(resultsData) : mockExamResults;
      
      set({
        students,
        streams,
        exams,
        examResults,
        selectedExamId: exams.length > 0 ? exams[0].id : null,
        selectedFormId: '4', // Default to Form 4
        isLoading: false
      });
      
      // Save mock data to AsyncStorage if it wasn't there
      if (!studentsData) await AsyncStorage.setItem('students', JSON.stringify(students));
      if (!streamsData) await AsyncStorage.setItem('streams', JSON.stringify(streams));
      if (!examsData) await AsyncStorage.setItem('exams', JSON.stringify(exams));
      if (!resultsData) await AsyncStorage.setItem('examResults', JSON.stringify(examResults));
      
    } catch (error) {
      console.error('Error initializing data:', error);
      set({
        students: mockStudents,
        streams: mockStreams,
        exams: mockExams,
        examResults: mockExamResults,
        selectedExamId: mockExams.length > 0 ? mockExams[0].id : null,
        selectedFormId: '4', // Default to Form 4
        isLoading: false
      });
    }
  }
}));