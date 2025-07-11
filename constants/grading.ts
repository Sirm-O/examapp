// KNEC Grading System
export const knecGrading = [
    { grade: "A", minMark: 80, maxMark: 100, points: 12, comment: "Excellent" },
    { grade: "A-", minMark: 75, maxMark: 79, points: 11, comment: "Very Good" },
    { grade: "B+", minMark: 70, maxMark: 74, points: 10, comment: "Good" },
    { grade: "B", minMark: 65, maxMark: 69, points: 9, comment: "Fairly Good" },
    { grade: "B-", minMark: 60, maxMark: 64, points: 8, comment: "Above Average" },
    { grade: "C+", minMark: 55, maxMark: 59, points: 7, comment: "Average" },
    { grade: "C", minMark: 50, maxMark: 54, points: 6, comment: "Average" },
    { grade: "C-", minMark: 45, maxMark: 49, points: 5, comment: "Below Average" },
    { grade: "D+", minMark: 40, maxMark: 44, points: 4, comment: "Weak" },
    { grade: "D", minMark: 35, maxMark: 39, points: 3, comment: "Weak" },
    { grade: "D-", minMark: 30, maxMark: 34, points: 2, comment: "Very Weak" },
    { grade: "E", minMark: 0, maxMark: 29, points: 1, comment: "Poor" },
  ];
  
  // CBC Rubrics
  export const cbcRubrics = [
    { level: 4, description: "Exceeding Expectations", minMark: 80, maxMark: 100 },
    { level: 3, description: "Meeting Expectations", minMark: 65, maxMark: 79 },
    { level: 2, description: "Approaching Expectations", minMark: 50, maxMark: 64 },
    { level: 1, description: "Below Expectations", minMark: 0, maxMark: 49 },
  ];
  
  // Get KNEC grade from percentage
  export const getKnecGrade = (percentage: number) => {
    if (percentage < 0 || percentage > 100) return null;
    return knecGrading.find(
      (grade) => percentage >= grade.minMark && percentage <= grade.maxMark
    );
  };
  
  // Get CBC level from percentage
  export const getCbcLevel = (percentage: number) => {
    if (percentage < 0 || percentage > 100) return null;
    return cbcRubrics.find(
      (rubric) => percentage >= rubric.minMark && percentage <= rubric.maxMark
    );
  };
  
  // Calculate percentage from marks
  export const calculatePercentage = (marks: number, maxMarks: number): number => {
    if (maxMarks === 0) return 0;
    return Math.round((marks / maxMarks) * 100 * 100) / 100; // Round to 2 decimal places
  };
  
  // Calculate mean grade from points
  export const calculateMeanGrade = (points: number) => {
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
  };
  
  // Subjects
  export const subjects = [
    { id: "1", name: "Mathematics", code: "MAT" },
    { id: "2", name: "English", code: "ENG" },
    { id: "3", name: "Kiswahili", code: "KIS" },
    { id: "4", name: "Biology", code: "BIO" },
    { id: "5", name: "Chemistry", code: "CHE" },
    { id: "6", name: "Physics", code: "PHY" },
    { id: "7", name: "History", code: "HIS" },
    { id: "8", name: "Geography", code: "GEO" },
    { id: "9", name: "Religious Education", code: "CRE" },
    { id: "10", name: "Business Studies", code: "BST" },
    { id: "11", name: "Agriculture", code: "AGR" },
    { id: "12", name: "Computer Studies", code: "CST" },
  ];
  
  // Forms/Classes
  export const forms = [
    { id: "1", name: "Form 1" },
    { id: "2", name: "Form 2" },
    { id: "3", name: "Form 3" },
    { id: "4", name: "Form 4" },
  ];
  
  // Terms
  export const terms = [
    { id: "1", name: "Term 1" },
    { id: "2", name: "Term 2" },
    { id: "3", name: "Term 3" },
  ];
  
  // Exam types
  export const examTypes = [
    { id: "1", name: "Opening Exam" },
    { id: "2", name: "Mid Term" },
    { id: "3", name: "End Term" },
    { id: "4", name: "Mock" },
    { id: "5", name: "KCSE" },
  ];