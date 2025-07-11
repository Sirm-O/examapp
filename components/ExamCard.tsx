import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { FileText, Calendar } from 'lucide-react-native';
import { Exam } from '@/types';
import { examTypes, terms } from '@/constants/grading';

interface ExamCardProps {
  exam: Exam;
  onPress?: () => void;
}

export default function ExamCard({ exam, onPress }: ExamCardProps) {
  const examType = examTypes.find(type => type.id === exam.examTypeId)?.name || '';
  const term = terms.find(t => t.id === exam.termId)?.name || '';
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <FileText size={24} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{exam.name}</Text>
          <Text style={styles.type}>{examType} - {term}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Calendar size={16} color={colors.secondary} />
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  type: {
    fontSize: 14,
    color: colors.placeholder,
    marginTop: 2,
  },
  details: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  subjectsBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});