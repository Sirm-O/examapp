import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { forms, subjects, getKnecGrade, getCbcLevel, calculatePercentage } from '@/constants/grading';
import { ExamResult } from '@/types';
import { Save, Calculator, Users, BookOpen } from 'lucide-react-native';

interface StudentMarks {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  marks: { [subjectId: string]: string };
}

export default function MarksEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { exams, students, examResults, selectedFormId, addExamResult, updateExamResult } = useAppStore();
  
  const [studentMarks, setStudentMarks] = useState<StudentMarks[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const exam = exams.find(e => e.id === id);
  const selectedForm = forms.find(form => form.id === selectedFormId) || forms[3];
  
  if (!exam) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Exam not found</Text>
      </View>
    );
  }
  
  const filteredStudents = students.filter(student => student.formId === selectedFormId);
  const selectedSubject = selectedSubjectId ? subjects.find(s => s.id === selectedSubjectId) : null;
  const subjectMaxMarks = exam.subjects.find(s => s.subjectId === selectedSubjectId)?.maxMarks || 100;
  
  // Initialize student marks when component mounts
  useEffect(() => {
    if (!initialized && filteredStudents.length > 0 && exam.subjects.length > 0) {
      const initialMarks: StudentMarks[] = filteredStudents.map(student => {
        const marks: { [subjectId: string]: string } = {};
        
        exam.subjects.forEach(examSubject => {
          const existingResult = examResults.find(
            result => result.examId === exam.id && 
                     result.studentId === student.id && 
                     result.subjectId === examSubject.subjectId
          );
          marks[examSubject.subjectId] = existingResult ? existingResult.marks.toString() : '';
        });
        
        return {
          studentId: student.id,
          studentName: student.name,
          admissionNumber: student.admissionNumber,
          marks
        };
      });
      
      setStudentMarks(initialMarks);
      
      // Set default subject
      if (exam.subjects.length > 0 && !selectedSubjectId) {
        setSelectedSubjectId(exam.subjects[0].subjectId);
      }
      
      setInitialized(true);
    }
  }, [exam.id, filteredStudents.length, examResults.length, initialized, selectedSubjectId]);
  
  const updateStudentMark = (studentId: string, subjectId: string, value: string) => {
    setStudentMarks(prev => prev.map(student => 
      student.studentId === studentId 
        ? {
            ...student,
            marks: { ...student.marks, [subjectId]: value }
          }
        : student
    ));
  };
  
  const calculateGradeAndPoints = (marks: number, maxMarks: number) => {
    const percentage = calculatePercentage(marks, maxMarks);
    
    if (exam.gradingSystem === 'knec') {
      const gradeInfo = getKnecGrade(percentage);
      return {
        percentage,
        grade: gradeInfo?.grade,
        points: gradeInfo?.points,
        level: undefined
      };
    } else {
      const levelInfo = getCbcLevel(percentage);
      return {
        percentage,
        grade: undefined,
        points: undefined,
        level: levelInfo?.level
      };
    }
  };
  
  const saveMarks = async () => {
    if (!selectedSubjectId) {
      Alert.alert('Error', 'Please select a subject');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const subjectInfo = exam.subjects.find(s => s.subjectId === selectedSubjectId);
      if (!subjectInfo) {
        throw new Error('Subject not found in exam');
      }
      
      let savedCount = 0;
      
      for (const student of studentMarks) {
        const marksValue = student.marks[selectedSubjectId];
        if (marksValue && marksValue.trim() !== '') {
          const marks = parseFloat(marksValue);
          
          if (isNaN(marks) || marks < 0 || marks > subjectInfo.maxMarks) {
            Alert.alert('Error', `Invalid marks for ${student.studentName}. Marks should be between 0 and ${subjectInfo.maxMarks}`);
            setIsSaving(false);
            return;
          }
          
          const gradeData = calculateGradeAndPoints(marks, subjectInfo.maxMarks);
          
          // Check if result already exists
          const existingResult = examResults.find(
            result => result.examId === exam.id && 
                     result.studentId === student.studentId && 
                     result.subjectId === selectedSubjectId
          );
          
          const resultData: ExamResult = {
            id: existingResult?.id || `${exam.id}_${student.studentId}_${selectedSubjectId}_${Date.now()}`,
            examId: exam.id,
            studentId: student.studentId,
            subjectId: selectedSubjectId,
            marks,
            maxMarks: subjectInfo.maxMarks,
            percentage: gradeData.percentage,
            grade: gradeData.grade,
            points: gradeData.points,
            level: gradeData.level
          };
          
          if (existingResult) {
            updateExamResult(resultData);
          } else {
            addExamResult(resultData);
          }
          
          savedCount++;
        }
      }
      
      Alert.alert('Success', `Marks saved successfully for ${savedCount} students!`);
    } catch (error) {
      console.error('Error saving marks:', error);
      Alert.alert('Error', 'Failed to save marks. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const calculateStats = () => {
    if (!selectedSubjectId) return { entries: 0, mean: 0, highest: 0, lowest: 0 };
    
    const validMarks = studentMarks
      .map(student => {
        const mark = student.marks[selectedSubjectId];
        return mark && mark.trim() !== '' ? parseFloat(mark) : null;
      })
      .filter(mark => mark !== null && !isNaN(mark)) as number[];
    
    if (validMarks.length === 0) return { entries: 0, mean: 0, highest: 0, lowest: 0 };
    
    const mean = validMarks.reduce((sum, mark) => sum + mark, 0) / validMarks.length;
    const highest = Math.max(...validMarks);
    const lowest = Math.min(...validMarks);
    
    return {
      entries: validMarks.length,
      mean: Math.round(mean * 100) / 100,
      highest,
      lowest
    };
  };
  
  const stats = calculateStats();

  if (!initialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Enter Marks',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerRight: () => (
            <Pressable 
              onPress={saveMarks} 
              style={styles.headerButton}
              disabled={isSaving}
            >
              <Save size={20} color={colors.white} />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.examName}>{exam.name}</Text>
          <Text style={styles.formName}>{selectedForm.name}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Users size={16} color={colors.white} />
              <Text style={styles.statText}>{filteredStudents.length} Students</Text>
            </View>
            <View style={styles.statItem}>
              <BookOpen size={16} color={colors.white} />
              <Text style={styles.statText}>{exam.subjects.length} Subjects</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.subjectSelector}>
          <Text style={styles.selectorLabel}>Subject:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectTabs}>
            {exam.subjects.map(examSubject => {
              const subject = subjects.find(s => s.id === examSubject.subjectId);
              if (!subject) return null;
              
              return (
                <Pressable
                  key={subject.id}
                  style={[
                    styles.subjectTab,
                    selectedSubjectId === subject.id && styles.subjectTabActive
                  ]}
                  onPress={() => setSelectedSubjectId(subject.id)}
                >
                  <Text style={[
                    styles.subjectTabText,
                    selectedSubjectId === subject.id && styles.subjectTabTextActive
                  ]}>
                    {subject.code}
                  </Text>
                  <Text style={[
                    styles.subjectMaxMarks,
                    selectedSubjectId === subject.id && styles.subjectMaxMarksActive
                  ]}>
                    /{examSubject.maxMarks}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
        
        {selectedSubject && (
          <View style={styles.subjectInfo}>
            <View style={styles.subjectHeader}>
              <Text style={styles.subjectName}>{selectedSubject.name}</Text>
              <Text style={styles.maxMarksInfo}>Max: {subjectMaxMarks} marks</Text>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.entries}</Text>
                <Text style={styles.statLabel}>Entries</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.mean}</Text>
                <Text style={styles.statLabel}>Mean</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.highest}</Text>
                <Text style={styles.statLabel}>Highest</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.lowest}</Text>
                <Text style={styles.statLabel}>Lowest</Text>
              </View>
            </View>
          </View>
        )}
        
        <ScrollView style={styles.marksContainer}>
          {studentMarks.map((student) => {
            const marks = student.marks[selectedSubjectId] || '';
            const numericMarks = marks ? parseFloat(marks) : 0;
            const gradeData = marks && !isNaN(numericMarks) 
              ? calculateGradeAndPoints(numericMarks, subjectMaxMarks)
              : null;
            
            return (
              <View key={student.studentId} style={styles.studentRow}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.studentName}</Text>
                  <Text style={styles.admissionNumber}>{student.admissionNumber}</Text>
                </View>
                
                <View style={styles.marksInput}>
                  <TextInput
                    style={styles.marksField}
                    value={marks}
                    onChangeText={(value) => updateStudentMark(student.studentId, selectedSubjectId, value)}
                    placeholder="0"
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <Text style={styles.maxMarksLabel}>/{subjectMaxMarks}</Text>
                </View>
                
                <View style={styles.gradeInfo}>
                  {gradeData && (
                    <>
                      <Text style={styles.percentage}>{gradeData.percentage}%</Text>
                      {exam.gradingSystem === 'knec' && gradeData.grade && (
                        <Text style={[styles.grade, { color: colors.primary }]}>
                          {gradeData.grade}
                        </Text>
                      )}
                      {exam.gradingSystem === 'cbc' && gradeData.level && (
                        <Text style={[styles.grade, { color: colors.accent }]}>
                          L{gradeData.level}
                        </Text>
                      )}
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
        
        <View style={styles.footer}>
          <Pressable 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={saveMarks}
            disabled={isSaving}
          >
            <Calculator size={20} color={colors.white} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save & Calculate Grades'}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  examName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  formName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: colors.white,
    marginLeft: 8,
    fontSize: 14,
  },
  headerButton: {
    padding: 8,
  },
  subjectSelector: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  subjectTabs: {
    paddingHorizontal: 16,
  },
  subjectTab: {
    backgroundColor: colors.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
  },
  subjectTabActive: {
    backgroundColor: colors.primary,
  },
  subjectTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  subjectTabTextActive: {
    color: colors.white,
  },
  subjectMaxMarks: {
    fontSize: 12,
    color: colors.placeholder,
  },
  subjectMaxMarksActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  subjectInfo: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  maxMarksInfo: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.placeholder,
    marginTop: 4,
  },
  marksContainer: {
    flex: 1,
    padding: 16,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  admissionNumber: {
    fontSize: 14,
    color: colors.placeholder,
    marginTop: 2,
  },
  marksInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  marksField: {
    backgroundColor: colors.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 60,
    borderWidth: 1,
    borderColor: colors.border,
  },
  maxMarksLabel: {
    fontSize: 14,
    color: colors.placeholder,
    marginLeft: 4,
  },
  gradeInfo: {
    alignItems: 'center',
    minWidth: 60,
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  grade: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonDisabled: {
    backgroundColor: colors.placeholder,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});