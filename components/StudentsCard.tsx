import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@/constants/colors';
import { User } from 'lucide-react-native';
import { Student } from '@/types';
import { forms } from '@/constants/grading';

interface StudentCardProps {
  student: Student;
  onPress?: () => void;
}

export default function StudentCard({ student, onPress }: StudentCardProps) {
  const form = forms.find(f => f.id === student.formId)?.name || '';
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <User size={24} color={colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{student.name}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.admNumber}>Adm: {student.admissionNumber}</Text>
          <Text style={styles.form}>{form}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  admNumber: {
    fontSize: 14,
    color: colors.placeholder,
  },
  form: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
});