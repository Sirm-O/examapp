import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { gradingColors } from '@/constants/colors';

interface GradeColorBoxProps {
  grade: string;
  size?: 'small' | 'medium' | 'large';
}

export default function GradeColorBox({ grade, size = 'medium' }: GradeColorBoxProps) {
  const backgroundColor = (gradingColors as Record<string, string>)[grade] || '#9CA3AF';
  
  const boxSize = {
    small: { width: 30, height: 30, fontSize: 12 },
    medium: { width: 40, height: 40, fontSize: 16 },
    large: { width: 50, height: 50, fontSize: 20 },
  }[size];
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor, 
          width: boxSize.width, 
          height: boxSize.height 
        }
      ]}
    >
      <Text style={[styles.text, { fontSize: boxSize.fontSize }]}>{grade}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});