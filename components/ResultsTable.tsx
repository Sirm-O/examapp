import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { StudentResult } from '@/types';
import { subjects } from '@/constants/grading';
import GradeColorBox from './GradeColorBox';

interface ResultsTableProps {
  results: StudentResult[];
  gradingSystem: 'knec' | 'cbc';
}

export default function ResultsTable({ results, gradingSystem }: ResultsTableProps) {
  const renderHeader = () => {
    return (
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.rankCell]}>Rank</Text>
        <Text style={[styles.headerCell, styles.nameCell]}>Student</Text>
        {subjects.map(subject => (
          <Text key={subject.id} style={[styles.headerCell, styles.subjectCell]}>
            {subject.code}
          </Text>
        ))}
        <Text style={[styles.headerCell, styles.totalCell]}>Total%</Text>
        <Text style={[styles.headerCell, styles.meanCell]}>Mean%</Text>
        {gradingSystem === 'knec' && (
          <Text style={[styles.headerCell, styles.gradeCell]}>Grade</Text>
        )}
      </View>
    );
  };

  const renderRow = (result: StudentResult, index: number) => {
    return (
      <View key={result.studentId} style={[
        styles.dataRow,
        index % 2 === 0 ? styles.evenRow : styles.oddRow
      ]}>
        <Text style={[styles.dataCell, styles.rankCell]}>{result.position}</Text>
        <View style={[styles.dataCell, styles.nameCell]}>
          <Text style={styles.studentName}>{result.studentName}</Text>
          <Text style={styles.admNumber}>{result.admissionNumber}</Text>
        </View>
        
        {subjects.map(subject => {
          const subjectResult = result.results[subject.id];
          if (!subjectResult) {
            return <Text key={subject.id} style={[styles.dataCell, styles.subjectCell]}>-</Text>;
          }
          
          return (
            <View key={subject.id} style={[styles.dataCell, styles.subjectCell]}>
              <Text style={styles.marks}>{subjectResult.marks}</Text>
              <Text style={styles.maxMarks}>/{subjectResult.maxMarks}</Text>
              <Text style={styles.percentage}>{subjectResult.percentage}%</Text>
              {gradingSystem === 'knec' && subjectResult.grade && (
                <Text style={styles.subjectGrade}>{subjectResult.grade}</Text>
              )}
              {gradingSystem === 'cbc' && subjectResult.level && (
                <Text style={styles.subjectLevel}>L{subjectResult.level}</Text>
              )}
            </View>
          );
        })}
        
        <Text style={[styles.dataCell, styles.totalCell]}>
          {((result.totalMarks / result.totalMaxMarks) * 100).toFixed(1)}%
        </Text>
        <Text style={[styles.dataCell, styles.meanCell]}>{result.meanPercentage}%</Text>
        
        {gradingSystem === 'knec' && result.meanGrade && (
          <View style={[styles.dataCell, styles.gradeCell]}>
            <GradeColorBox grade={result.meanGrade} size="small" />
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator={true}>
      <View>
        {renderHeader()}
        <ScrollView style={styles.tableBody}>
          {results.map((result, index) => renderRow(result, index))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  rankCell: {
    width: 50,
  },
  nameCell: {
    width: 150,
  },
  subjectCell: {
    width: 80,
  },
  totalCell: {
    width: 70,
  },
  meanCell: {
    width: 70,
  },
  gradeCell: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  evenRow: {
    backgroundColor: colors.white,
  },
  oddRow: {
    backgroundColor: colors.light,
  },
  dataCell: {
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  admNumber: {
    fontSize: 12,
    color: colors.placeholder,
  },
  marks: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.text,
  },
  maxMarks: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.placeholder,
  },
  percentage: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: 'bold',
  },
  subjectGrade: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.secondary,
    fontWeight: 'bold',
  },
  subjectLevel: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.accent,
    fontWeight: 'bold',
  },
  tableBody: {
    maxHeight: 400,
  },
});