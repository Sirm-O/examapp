import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, gradingColors } from '@/constants/colors';

interface GradeDistributionProps {
  distribution: { [grade: string]: number };
  total: number;
}

export default function GradeDistributionChart({ distribution, total }: GradeDistributionProps) {
  // Sort grades in order
  const gradeOrder = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
  const sortedGrades = Object.keys(distribution).sort(
    (a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grade Distribution</Text>
      
      <View style={styles.chartContainer}>
        {sortedGrades.map(grade => {
          const count = distribution[grade] || 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const barWidth = `${Math.max(percentage, 2)}%`;
          
          return (
            <View key={grade} style={styles.barContainer}>
              <Text style={styles.gradeLabel}>{grade}</Text>
              <View style={styles.barBackground}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      width: barWidth, 
                      backgroundColor: (gradingColors as Record<string, string>)[grade] || colors.placeholder 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.countLabel}>{count}</Text>
            </View>
          );
        })}
      </View>
    </View>
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  chartContainer: {
    marginTop: 8,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gradeLabel: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  barBackground: {
    flex: 1,
    height: 20,
    backgroundColor: colors.light,
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  bar: {
    height: '100%',
  },
  countLabel: {
    width: 30,
    fontSize: 14,
    textAlign: 'right',
    color: colors.text,
  },
});