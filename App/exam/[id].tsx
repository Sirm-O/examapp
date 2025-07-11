import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { forms, examTypes, terms, subjects } from '@/constants/grading';
import { generateStudentResults } from '@/mocks/data';
import ResultsTable from '@/components/ResultsTable';
import GradeDistributionChart from '@/components/GradeDistributionChart';
import { 
  Calendar, 
  FileText, 
  Users, 
  BookOpen, 
  Award, 
  ChevronDown,
  Download,
  Edit,
  Trash,
  PenTool
} from 'lucide-react-native';

export default function ExamDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { exams, selectedFormId, setSelectedFormId } = useAppStore();
  
  const [formSelectorVisible, setFormSelectorVisible] = useState(false);
  
  const exam = exams.find(e => e.id === id);
  if (!exam) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Exam not found</Text>
      </View>
    );
  }
  
  const examType = examTypes.find(type => type.id === exam.examTypeId)?.name || '';
  const term = terms.find(t => t.id === exam.termId)?.name || '';
  const selectedForm = forms.find(form => form.id === selectedFormId) || forms[3]; // Default to Form 4
  
  // Get results for the selected exam and form
  const results = generateStudentResults(exam.id, selectedFormId || '4');
  
  // Calculate grade distribution
  const gradeDistribution: { [grade: string]: number } = {};
  if (exam.gradingSystem === 'knec') {
    results.forEach(result => {
      if (result.meanGrade) {
        gradeDistribution[result.meanGrade] = (gradeDistribution[result.meanGrade] || 0) + 1;
      }
    });
  }
  
  // Calculate mean score
  const meanScore = results.length > 0
    ? results.reduce((sum, result) => sum + result.meanPercentage, 0) / results.length
    : 0;
  
  // Calculate subject statistics
  const subjectStats = exam.subjects.map(examSubject => {
    const subject = subjects.find(s => s.id === examSubject.subjectId);
    if (!subject) return null;
    
    const subjectResults = results.map(result => result.results[examSubject.subjectId]?.percentage || 0).filter(percentage => percentage > 0);
    const meanPercentage = subjectResults.length > 0
      ? subjectResults.reduce((sum, percentage) => sum + percentage, 0) / subjectResults.length
      : 0;
    
    return {
      id: subject.id,
      name: subject.name,
      code: subject.code,
      meanPercentage: meanPercentage.toFixed(2),
      maxMarks: examSubject.maxMarks,
      entries: subjectResults.length
    };
  }).filter(Boolean);

  return (
    <>
      <Stack.Screen 
        options={{
          title: exam.name,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.iconContainer}>
              <FileText size={32} color={colors.white} />
            </View>
            <View style={styles.headerActions}>
              <Pressable 
                style={styles.actionButton}
                onPress={() => router.push(`/exam/${id}/marks-entry`)}
              >
                <PenTool size={20} color={colors.white} />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Download size={20} color={colors.white} />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Edit size={20} color={colors.white} />
              </Pressable>
              <Pressable style={[styles.actionButton, styles.deleteButton]}>
                <Trash size={20} color={colors.white} />
              </Pressable>
            </View>
          </View>
          
          <Text style={styles.examName}>{exam.name}</Text>
          <Text style={styles.examType}>{examType} - {term} {exam.year}</Text>
          
          <View style={styles.examDetails}>
            <View style={styles.detailItem}>
              <Calendar size={16} color={colors.white} style={styles.detailIcon} />
              <Text style={styles.detailText}>
                {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {exam.gradingSystem === 'knec' ? 'KNEC' : 'CBC'}
                </Text>
              </View>
              <View style={styles.subjectsBadge}>
                <Text style={styles.badgeText}>
                  {exam.subjects.length} Subjects
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.formSelector}>
          <Text style={styles.formSelectorLabel}>Class:</Text>
          <Pressable 
            style={styles.formSelectorButton}
            onPress={() => setFormSelectorVisible(!formSelectorVisible)}
          >
            <Text style={styles.formSelectorText}>{selectedForm.name}</Text>
            <ChevronDown size={16} color={colors.primary} />
            
            {formSelectorVisible && (
              <View style={styles.formSelectorDropdown}>
                {forms.map(form => (
                  <Pressable
                    key={form.id}
                    style={styles.formSelectorItem}
                    onPress={() => {
                      setSelectedFormId(form.id);
                      setFormSelectorVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.formSelectorItemText,
                      form.id === selectedFormId && styles.formSelectorItemTextActive
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
              <View style={styles.statIconContainer}>
                <Users size={24} color={colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{results.length}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <BookOpen size={24} color={colors.secondary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{exam.subjects.length}</Text>
                <Text style={styles.statLabel}>Subjects</Text>
              </View>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Award size={24} color={colors.accent} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{meanScore.toFixed(2)}%</Text>
                <Text style={styles.statLabel}>Mean Score</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.actionCard}>
          <Text style={styles.actionCardTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <Pressable 
              style={styles.primaryActionButton}
              onPress={() => router.push(`/exam/${id}/marks-entry`)}
            >
              <PenTool size={20} color={colors.white} />
              <Text style={styles.primaryActionButtonText}>Enter Marks</Text>
            </Pressable>
            
            <Pressable style={styles.secondaryActionButton}>
              <Download size={20} color={colors.primary} />
              <Text style={styles.secondaryActionButtonText}>Export Results</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Results</Text>
          <ResultsTable results={results} gradingSystem={exam.gradingSystem} />
        </View>
        
        {exam.gradingSystem === 'knec' && Object.keys(gradeDistribution).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Grade Distribution</Text>
            <GradeDistributionChart 
              distribution={gradeDistribution} 
              total={results.length}
            />
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Performance</Text>
          
          <View style={styles.subjectStatsContainer}>
            {subjectStats.map((stat: any) => (
              <View key={stat.id} style={styles.subjectStatCard}>
                <Text style={styles.subjectName}>{stat.name}</Text>
                <Text style={styles.subjectCode}>{stat.code}</Text>
                <View style={styles.subjectStatDetails}>
                  <View style={styles.subjectStatItem}>
                    <Text style={styles.subjectStatValue}>{stat.meanPercentage}%</Text>
                    <Text style={styles.subjectStatLabel}>Mean</Text>
                  </View>
                  <View style={styles.subjectStatItem}>
                    <Text style={styles.subjectStatValue}>/{stat.maxMarks}</Text>
                    <Text style={styles.subjectStatLabel}>Max Marks</Text>
                  </View>
                  <View style={styles.subjectStatItem}>
                    <Text style={styles.subjectStatValue}>{stat.entries}</Text>
                    <Text style={styles.subjectStatLabel}>Entries</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        
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
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 64,
    height: 64,
    borderRadius: 32,
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
  examName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  examType: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  examDetails: {
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
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  subjectsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  formSelector: {
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
  formSelectorLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 16,
  },
  formSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    position: 'relative',
  },
  formSelectorText: {
    color: colors.primary,
    fontWeight: '500',
    marginRight: 8,
  },
  formSelectorDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
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
  formSelectorItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  formSelectorItemText: {
    color: colors.text,
  },
  formSelectorItemTextActive: {
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
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    backgroundColor: `${colors.primary}20`,
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.placeholder,
  },
  actionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  primaryActionButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: colors.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryActionButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  subjectStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectStatCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 12,
  },
  subjectStatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subjectStatItem: {
    alignItems: 'center',
  },
  subjectStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  subjectStatLabel: {
    fontSize: 10,
    color: colors.placeholder,
  },
  footer: {
    height: 40,
  },
});