import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { forms, examTypes, subjects } from '@/constants/grading';
import { generateStudentResults } from '@/mocks/data';
import StatCard from '@/components/StatCard';
import ExamCard from '@/components/ExamCard';
import GradeDistributionChart from '@/components/GradeDistributionChart';
import { Users, BookOpen, FileText, Award, ChevronDown } from 'lucide-react-native';

export default function DashboardScreen() {
  const { 
    students, 
    exams, 
    examResults, 
    selectedExamId, 
    selectedFormId,
    setSelectedExamId,
    setSelectedFormId
  } = useAppStore();
  
  const [formSelectorVisible, setFormSelectorVisible] = useState(false);
  const [examSelectorVisible, setExamSelectorVisible] = useState(false);
  
  const selectedExam = exams.find(exam => exam.id === selectedExamId) || exams[0];
  const selectedForm = forms.find(form => form.id === selectedFormId) || forms[3]; // Default to Form 4
  
  // Calculate statistics
  const totalStudents = students.filter(student => student.formId === selectedFormId).length;
  const totalExams = exams.length;
  const totalSubjects = subjects.length;
  
  // Get results for the selected exam and form
  const results = selectedExam 
    ? generateStudentResults(selectedExam.id, selectedFormId || '4')
    : [];
  
  // Calculate grade distribution
  const gradeDistribution: { [grade: string]: number } = {};
  if (selectedExam?.gradingSystem === 'knec') {
    results.forEach(result => {
      if (result.meanGrade) {
        gradeDistribution[result.meanGrade] = (gradeDistribution[result.meanGrade] || 0) + 1;
      }
    });
  }
  
  // Calculate mean score (now using percentage)
  const meanScore = results.length > 0
    ? results.reduce((sum, result) => sum + result.meanPercentage, 0) / results.length
    : 0;
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'School Exam Manager',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          
          <Pressable 
            style={styles.formSelector}
            onPress={() => setFormSelectorVisible(!formSelectorVisible)}
          >
            <Text style={styles.formSelectorText}>{selectedForm.name}</Text>
            <ChevronDown size={16} color={colors.white} />
            
            {formSelectorVisible && (
              <View style={styles.selectorDropdown}>
                {forms.map(form => (
                  <Pressable
                    key={form.id}
                    style={styles.selectorItem}
                    onPress={() => {
                      setSelectedFormId(form.id);
                      setFormSelectorVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.selectorItemText,
                      form.id === selectedFormId && styles.selectorItemTextActive
                    ]}>
                      {form.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Pressable>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <StatCard 
                title="Students" 
                value={totalStudents} 
                icon={<Users size={24} color={colors.primary} />}
                subtitle={selectedForm.name}
              />
            </View>
            <View style={styles.statCard}>
              <StatCard 
                title="Subjects" 
                value={totalSubjects} 
                icon={<BookOpen size={24} color={colors.secondary} />}
                color={colors.secondary}
              />
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <StatCard 
                title="Exams" 
                value={totalExams} 
                icon={<FileText size={24} color={colors.accent} />}
                color={colors.accent}
              />
            </View>
            <View style={styles.statCard}>
              <StatCard 
                title="Mean Score" 
                value={`${meanScore.toFixed(1)}%`} 
                icon={<Award size={24} color={colors.success} />}
                color={colors.success}
                subtitle={selectedExam?.name}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Exams</Text>
          <Pressable 
            style={styles.examSelector}
            onPress={() => setExamSelectorVisible(!examSelectorVisible)}
          >
            <Text style={styles.examSelectorText}>
              {selectedExam ? selectedExam.name : 'Select Exam'}
            </Text>
            <ChevronDown size={16} color={colors.primary} />
            
            {examSelectorVisible && (
              <View style={styles.examSelectorDropdown}>
                {exams.map(exam => (
                  <Pressable
                    key={exam.id}
                    style={styles.selectorItem}
                    onPress={() => {
                      setSelectedExamId(exam.id);
                      setExamSelectorVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.selectorItemText,
                      exam.id === selectedExamId && styles.selectorItemTextActive
                    ]}>
                      {exam.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Pressable>
        </View>
        
        <View style={styles.examsList}>
          {exams.slice(0, 3).map(exam => (
            <ExamCard 
              key={exam.id} 
              exam={exam} 
              onPress={() => setSelectedExamId(exam.id)}
            />
          ))}
        </View>
        
        {selectedExam?.gradingSystem === 'knec' && Object.keys(gradeDistribution).length > 0 && (
          <GradeDistributionChart 
            distribution={gradeDistribution} 
            total={results.length}
          />
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
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  formSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    position: 'relative',
  },
  formSelectorText: {
    color: colors.white,
    fontWeight: '500',
    marginRight: 4,
  },
  selectorDropdown: {
    position: 'absolute',
    top: '100%',
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
    width: 120,
  },
  selectorItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selectorItemText: {
    color: colors.text,
  },
  selectorItemTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    maxWidth: '48%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  examSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  examSelectorText: {
    color: colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  examSelectorDropdown: {
    position: 'absolute',
    top: '100%',
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
    width: 200,
  },
  examsList: {
    padding: 16,
  },
  footer: {
    height: 40,
  },
});