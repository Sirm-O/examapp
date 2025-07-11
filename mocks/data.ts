import { Student, Stream, Exam, ExamResult } from '@/types';

export const mockStudents: Student[] = [
  { id: '1', admissionNumber: '1001', name: 'John Kamau', formId: '4', streamId: '1', gender: 'male', dateOfBirth: '2007-05-15', parentContact: '0712345678' },
  { id: '2', admissionNumber: '1002', name: 'Mary Wanjiku', formId: '4', streamId: '1', gender: 'female', dateOfBirth: '2007-03-22', parentContact: '0723456789' },
  { id: '3', admissionNumber: '1003', name: 'Peter Ochieng', formId: '4', streamId: '1', gender: 'male', dateOfBirth: '2007-07-10', parentContact: '0734567890' },
  { id: '4', admissionNumber: '1004', name: 'Faith Akinyi', formId: '4', streamId: '1', gender: 'female', dateOfBirth: '2007-11-05', parentContact: '0745678901' },
  { id: '5', admissionNumber: '1005', name: 'James Mwangi', formId: '4', streamId: '1', gender: 'male', dateOfBirth: '2007-09-18', parentContact: '0756789012' },
  { id: '6', admissionNumber: '1006', name: 'Grace Njeri', formId: '4', streamId: '2', gender: 'female', dateOfBirth: '2007-01-30', parentContact: '0767890123' },
  { id: '7', admissionNumber: '1007', name: 'David Kipchoge', formId: '4', streamId: '2', gender: 'male', dateOfBirth: '2007-04-12', parentContact: '0778901234' },
  { id: '8', admissionNumber: '1008', name: 'Sarah Atieno', formId: '4', streamId: '2', gender: 'female', dateOfBirth: '2007-08-25', parentContact: '0789012345' },
  { id: '9', admissionNumber: '1009', name: 'Michael Ndungu', formId: '4', streamId: '2', gender: 'male', dateOfBirth: '2007-12-03', parentContact: '0790123456' },
  { id: '10', admissionNumber: '1010', name: 'Elizabeth Wangari', formId: '4', streamId: '2', gender: 'female', dateOfBirth: '2007-06-20', parentContact: '0701234567' },
  { id: '11', admissionNumber: '2001', name: 'Joseph Mutua', formId: '3', streamId: '3', gender: 'male', dateOfBirth: '2008-02-14', parentContact: '0712345678' },
  { id: '12', admissionNumber: '2002', name: 'Catherine Muthoni', formId: '3', streamId: '3', gender: 'female', dateOfBirth: '2008-07-19', parentContact: '0723456789' },
];

export const mockStreams: Stream[] = [
  { id: '1', name: 'East', formId: '4' },
  { id: '2', name: 'West', formId: '4' },
  { id: '3', name: 'North', formId: '3' },
  { id: '4', name: 'South', formId: '3' },
  { id: '5', name: 'Alpha', formId: '2' },
  { id: '6', name: 'Beta', formId: '2' },
  { id: '7', name: 'Gamma', formId: '1' },
  { id: '8', name: 'Delta', formId: '1' },
];

export const mockExams: Exam[] = [
  { 
    id: '1', 
    name: 'Term 1 Mid Term Exam 2025', 
    examTypeId: '2', 
    termId: '1', 
    year: 2025, 
    startDate: '2025-02-15', 
    endDate: '2025-02-20', 
    subjects: [
      { subjectId: '1', maxMarks: 100 },
      { subjectId: '2', maxMarks: 100 },
      { subjectId: '3', maxMarks: 100 },
      { subjectId: '4', maxMarks: 80 },
      { subjectId: '5', maxMarks: 80 },
      { subjectId: '6', maxMarks: 80 },
      { subjectId: '7', maxMarks: 50 },
      { subjectId: '8', maxMarks: 50 }
    ], 
    gradingSystem: 'knec' 
  },
  { 
    id: '2', 
    name: 'Term 1 End Term Exam 2025', 
    examTypeId: '3', 
    termId: '1', 
    year: 2025, 
    startDate: '2025-04-10', 
    endDate: '2025-04-15', 
    subjects: [
      { subjectId: '1', maxMarks: 100 },
      { subjectId: '2', maxMarks: 100 },
      { subjectId: '3', maxMarks: 100 },
      { subjectId: '4', maxMarks: 100 },
      { subjectId: '5', maxMarks: 100 },
      { subjectId: '6', maxMarks: 100 },
      { subjectId: '7', maxMarks: 100 },
      { subjectId: '8', maxMarks: 100 },
      { subjectId: '9', maxMarks: 100 },
      { subjectId: '10', maxMarks: 100 }
    ], 
    gradingSystem: 'knec' 
  },
  { 
    id: '3', 
    name: 'CBC Assessment Term 2 2025', 
    examTypeId: '2', 
    termId: '2', 
    year: 2025, 
    startDate: '2025-06-20', 
    endDate: '2025-06-25', 
    subjects: [
      { subjectId: '1', maxMarks: 30 },
      { subjectId: '2', maxMarks: 30 },
      { subjectId: '3', maxMarks: 30 },
      { subjectId: '4', maxMarks: 40 },
      { subjectId: '5', maxMarks: 40 }
    ], 
    gradingSystem: 'cbc' 
  },
];

export const mockExamResults: ExamResult[] = [
  // Term 1 Mid Term Exam 2025 - Mathematics (out of 100)
  { id: '1', examId: '1', studentId: '1', subjectId: '1', marks: 78, maxMarks: 100, percentage: 78, grade: 'A-', points: 11 },
  { id: '2', examId: '1', studentId: '2', subjectId: '1', marks: 65, maxMarks: 100, percentage: 65, grade: 'B', points: 9 },
  { id: '3', examId: '1', studentId: '3', subjectId: '1', marks: 82, maxMarks: 100, percentage: 82, grade: 'A', points: 12 },
  { id: '4', examId: '1', studentId: '4', subjectId: '1', marks: 55, maxMarks: 100, percentage: 55, grade: 'C+', points: 7 },
  { id: '5', examId: '1', studentId: '5', subjectId: '1', marks: 70, maxMarks: 100, percentage: 70, grade: 'B+', points: 10 },
  
  // Term 1 Mid Term Exam 2025 - English (out of 100)
  { id: '6', examId: '1', studentId: '1', subjectId: '2', marks: 72, maxMarks: 100, percentage: 72, grade: 'B+', points: 10 },
  { id: '7', examId: '1', studentId: '2', subjectId: '2', marks: 80, maxMarks: 100, percentage: 80, grade: 'A', points: 12 },
  { id: '8', examId: '1', studentId: '3', subjectId: '2', marks: 68, maxMarks: 100, percentage: 68, grade: 'B', points: 9 },
  { id: '9', examId: '1', studentId: '4', subjectId: '2', marks: 75, maxMarks: 100, percentage: 75, grade: 'A-', points: 11 },
  { id: '10', examId: '1', studentId: '5', subjectId: '2', marks: 62, maxMarks: 100, percentage: 62, grade: 'B-', points: 8 },
  
  // Term 1 Mid Term Exam 2025 - Biology (out of 80)
  { id: '11', examId: '1', studentId: '1', subjectId: '4', marks: 52, maxMarks: 80, percentage: 65, grade: 'B', points: 9 },
  { id: '12', examId: '1', studentId: '2', subjectId: '4', marks: 56, maxMarks: 80, percentage: 70, grade: 'B+', points: 10 },
  { id: '13', examId: '1', studentId: '3', subjectId: '4', marks: 48, maxMarks: 80, percentage: 60, grade: 'B-', points: 8 },
  { id: '14', examId: '1', studentId: '4', subjectId: '4', marks: 44, maxMarks: 80, percentage: 55, grade: 'C+', points: 7 },
  { id: '15', examId: '1', studentId: '5', subjectId: '4', marks: 60, maxMarks: 80, percentage: 75, grade: 'A-', points: 11 },
  
  // CBC Assessment Term 2 2025 - Mathematics (out of 30)
  { id: '16', examId: '3', studentId: '1', subjectId: '1', marks: 26, maxMarks: 30, percentage: 86.67, level: 4 },
  { id: '17', examId: '3', studentId: '2', subjectId: '1', marks: 22, maxMarks: 30, percentage: 73.33, level: 3 },
  { id: '18', examId: '3', studentId: '3', subjectId: '1', marks: 27, maxMarks: 30, percentage: 90, level: 4 },
  { id: '19', examId: '3', studentId: '4', subjectId: '1', marks: 18, maxMarks: 30, percentage: 60, level: 2 },
  { id: '20', examId: '3', studentId: '5', subjectId: '1', marks: 23, maxMarks: 30, percentage: 76.67, level: 3 },
];

// Generate student results for analysis
export const generateStudentResults = (examId: string, formId: string, streamId?: string) => {
  const filteredStudents = mockStudents.filter(student => 
    student.formId === formId && (!streamId || student.streamId === streamId)
  );
  
  const exam = mockExams.find(e => e.id === examId);
  if (!exam) return [];
  
  const studentResults = filteredStudents.map(student => {
    const studentExamResults = mockExamResults.filter(
      result => result.examId === examId && result.studentId === student.id
    );
    
    const results: { [subjectId: string]: any } = {};
    let totalMarks = 0;
    let totalMaxMarks = 0;
    let totalPercentage = 0;
    let totalSubjects = 0;
    
    studentExamResults.forEach(result => {
      results[result.subjectId] = {
        marks: result.marks,
        maxMarks: result.maxMarks,
        percentage: result.percentage,
        grade: result.grade,
        points: result.points,
        level: result.level
      };
      totalMarks += result.marks;
      totalMaxMarks += result.maxMarks;
      totalPercentage += result.percentage;
      totalSubjects++;
    });
    
    const meanPercentage = totalSubjects > 0 ? totalPercentage / totalSubjects : 0;
    let meanGrade;
    
    if (exam.gradingSystem === 'knec' && totalSubjects > 0) {
      const totalPoints = studentExamResults.reduce((sum, result) => sum + (result.points || 0), 0);
      const meanPoints = totalPoints / totalSubjects;
      meanGrade = calculateMeanGrade(meanPoints);
    }
    
    return {
      studentId: student.id,
      studentName: student.name,
      admissionNumber: student.admissionNumber,
      results,
      totalMarks,
      totalMaxMarks,
      meanPercentage: parseFloat(meanPercentage.toFixed(2)),
      meanGrade,
    };
  });
  
  // Sort by mean percentage and assign positions
  return studentResults
    .sort((a, b) => b.meanPercentage - a.meanPercentage)
    .map((result, index) => ({
      ...result,
      position: index + 1
    }));
};

// Helper function to calculate mean grade
function calculateMeanGrade(points: number): string {
  if (points >= 11.5) return "A";
  if (points >= 10.5) return "A-";
  if (points >= 9.5) return "B+";
  if (points >= 8.5) return "B";
  if (points >= 7.5) return "B-";
  if (points >= 6.5) return "C+";
  if (points >= 5.5) return "C";
  if (points >= 4.5) return "C-";
  if (points >= 3.5) return "D+";
  if (points >= 2.5) return "D";
  if (points >= 1.5) return "D-";
  return "E";
}