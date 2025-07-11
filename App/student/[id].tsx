import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { forms, subjects } from '@/constants/grading';
import { generateStudentResults } from '@/mocks/data';
import GradeColorBox from '@/components/GradeColorBox';
import { 
  User, 
  Phone, 
  Calendar, 
  School, 
  ChevronDown,
  Edit,
  Trash,
  FileText
} from 'lucide-react-native';

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { students, exams, selectedExamId, setSelectedExamId } = useAppStore();
  
  const [examSelectorVisible, setExamSelectorVisible] = useState(false);
  
  const student = students.find(s => s.id === id);
  if (!student) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Student not found</Text>
      </View>
    );
  }
  
  const form = forms.find(f => f.id === student.formId)?.name || '';
  const selectedExam = exams.find(exam => exam.id === selectedExamId) || exams[0];
  
  // Get student results for the selected exam
  const examResults = selectedExam 
    ? generateStudentResults(selectedExam.id, student.formId)
    : [];
  
  const studentResult = examResults.find(result => result.studentId === student.id);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: student.name,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.avatarContainer}>
              <User size={40} color={colors.white} />
            </View>
            <View style={styles.headerActions}>
              <Pressable style={styles.actionButton}>
                <Edit size={20} color={colors.white} />
              </Pressable>
              <Pressable style={[styles.actionButton, styles.deleteButton]}>
                <Trash size={20} color={colors.white} />
              </Pressable>
            </View>
          </View>
          
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.admNumber}>Admission: {student.admissionNumber}</Text>
          
          <View style={styles.studentDetails}>
            <View style={styles.detailItem}>
              <School size={16} color={colors.white} style={styles.detailIcon} />
              <Text style={styles.detailText}>{form}</Text>
            </View>
            
            {student.dateOfBirth && (
              <View style={styles.detailItem}>
                <Calendar size={16} color={colors.white} style={styles.detailIcon} />
                <Text style={styles.detailText}>
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            {student.parentContact && (
              <View style={styles.detailItem}>
                <Phone size={16} color={colors.white} style={styles.detailIcon} />
                <Text style={styles.detailText}>{student.parentContact}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.examSelector}>
          <Text style={styles.examSelectorLabel}>Exam:</Text>
          <Pressable 
            style={styles.examSelectorButton}
            onPress={() => setExamSelectorVisible(!examSelectorVisible)}
          >
            <FileText size={16} color={colors.primary} style={styles.examSelectorIcon} />
            <Text style={styles.examSelectorText}>
              {selectedExam ? selectedExam.name : 'Select Exam'}
            </Text>
            <ChevronDown size={16} color={colors.primary} />
            
            {examSelectorVisible && (
              <View style={styles.examSelectorDropdown}>
                {exams.map(exam => (
                  <Pressable
                    key={exam.id}
                    style={styles.examSelectorItem}
                    onPress={() => {
                      setSelectedExamId(exam.id);
                      setExamSelectorVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.examSelectorItemText,
                      exam.id === selectedExamId && styles.examSelectorItemTextActive
                    ]}>
                      {exam.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Pressable>
        </View>
        
        {studentResult ? (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Mean Score</Text>
                <Text style={styles.summaryValue}>{studentResult.meanMarks.toFixed(2)}</Text>
              </View>
              
              {studentResult.meanGrade && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Mean Grade</Text>
                  <GradeColorBox grade={studentResult.meanGrade} size="medium" />
                </View>
              )}
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Position</Text>
                <Text style={styles.summaryValue}>{studentResult.position}</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Subject Results</Text>
            
            <View style={styles.subjectsContainer}>
              {selectedExam.subjects.map(subjectId => {
                const subject = subjects.find(s => s.id === subjectId);
                if (!subject) return null;
                
                const result = studentResult.results[subjectId];
                if (!result) return null;
                
                return (
                  <View key={subjectId} style={styles.subjectCard}>
                    <View style={styles.subjectHeader}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={styles.subjectCode}>{subject.code}</Text>
                    </View>
                    
                    <View style={styles.subjectResults}>
                      <View style={styles.subjectResultItem}>
                        <Text style={styles.subjectResultLabel}>Marks</Text>
                        <Text style={styles.subjectResultValue}>{result.marks}</Text>
                      </View>
                      
                      {selectedExam.gradingSystem === 'knec' && result.grade && (
                        <View style={styles.subjectResultItem}>
                          <Text style={styles.subjectResultLabel}>Grade</Text>
                          <GradeColorBox grade={result.grade} size="small" />
                        </View>
                      )}
                      
                      {selectedExam.gradingSystem === 'knec' && result.points !== undefined && (
                        <View style={styles.subjectResultItem}>
                          <Text style={styles.subjectResultLabel}>Points</Text>
                          <Text style={styles.subjectResultValue}>{result.points}</Text>
                        </View>
                      )}
                      
                      {selectedExam.gradingSystem === 'cbc' && result.level !== undefined && (
                        <View style={styles.subjectResultItem}>
                          <Text style={styles.subjectResultLabel}>Level</Text>
                          <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>{result.level}</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found for this exam</Text>
          </View>
        )}
        
        <View style={styles.footer} />
      </ScrollView>
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
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  admNumber: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  studentDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.white,
  },
  examSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  examSelectorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 16,
  },
  examSelectorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    position: 'relative',
  },
  examSelectorIcon: {
    marginRight: 8,
  },
  examSelectorText: {
    flex: 1,
    color: colors.primary,
    fontWeight: '500',
  },
  examSelectorDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  examSelectorItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  examSelectorItemText: {
    color: colors.text,
  },
  examSelectorItemTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  resultsContainer: {
    padding: 16,
  },
  resultsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  subjectsContainer: {
    marginBottom: 16,
  },
  subjectCard: {
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
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  subjectCode: {
    fontSize: 14,
    color: colors.placeholder,
    backgroundColor: colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  subjectResults: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subjectResultItem: {
    alignItems: 'center',
  },
  subjectResultLabel: {
    fontSize: 12,
    color: colors.placeholder,
    marginBottom: 4,
  },
  subjectResultValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  levelBadge: {
    backgroundColor: colors.accent,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  noResultsContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: colors.placeholder,
    textAlign: 'center',
  },
  footer: {
    height: 40,
  },
});