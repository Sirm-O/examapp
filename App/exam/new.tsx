import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { forms, terms, examTypes, subjects } from '@/constants/grading';
import { Exam, ExamSubject } from '@/types';
import { FileText, Save, X, ChevronDown, Plus, Minus } from 'lucide-react-native';

export default function NewExamScreen() {
  const router = useRouter();
  const { addExam } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    examTypeId: '2', // Mid Term
    termId: '1', // Term 1
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
    gradingSystem: 'knec' as 'knec' | 'cbc',
  });
  
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([
    { subjectId: '1', maxMarks: 100 }, // Mathematics
    { subjectId: '2', maxMarks: 100 }, // English
  ]);
  
  const [examTypeSelectorVisible, setExamTypeSelectorVisible] = useState(false);
  const [termSelectorVisible, setTermSelectorVisible] = useState(false);
  const [gradingSelectorVisible, setGradingSelectorVisible] = useState(false);
  
  const selectedExamType = examTypes.find(type => type.id === formData.examTypeId) || examTypes[0];
  const selectedTerm = terms.find(term => term.id === formData.termId) || terms[0];
  
  const addSubject = () => {
    const availableSubjects = subjects.filter(
      subject => !examSubjects.some(es => es.subjectId === subject.id)
    );
    
    if (availableSubjects.length === 0) {
      Alert.alert('Info', 'All subjects have been added');
      return;
    }
    
    setExamSubjects(prev => [
      ...prev,
      { subjectId: availableSubjects[0].id, maxMarks: 100 }
    ]);
  };
  
  const removeSubject = (index: number) => {
    if (examSubjects.length <= 1) {
      Alert.alert('Error', 'At least one subject is required');
      return;
    }
    
    setExamSubjects(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateSubject = (index: number, field: keyof ExamSubject, value: string) => {
    setExamSubjects(prev => prev.map((subject, i) => 
      i === index ? { ...subject, [field]: field === 'maxMarks' ? parseInt(value) || 0 : value } : subject
    ));
  };
  
  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Exam name is required');
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      Alert.alert('Error', 'Start and end dates are required');
      return;
    }
    
    if (examSubjects.length === 0) {
      Alert.alert('Error', 'At least one subject is required');
      return;
    }
    
    const newExam: Exam = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      examTypeId: formData.examTypeId,
      termId: formData.termId,
      year: formData.year,
      startDate: formData.startDate,
      endDate: formData.endDate,
      subjects: examSubjects,
      gradingSystem: formData.gradingSystem,
    };
    
    addExam(newExam);
    Alert.alert('Success', 'Exam created successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Create Exam',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerRight: () => (
            <Pressable onPress={handleSave} style={styles.headerButton}>
              <Save size={20} color={colors.white} />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FileText size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>New Exam</Text>
          <Text style={styles.headerSubtitle}>Create a new examination</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Exam Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter exam name"
              placeholderTextColor={colors.placeholder}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Exam Type</Text>
              <Pressable 
                style={styles.selector}
                onPress={() => setExamTypeSelectorVisible(!examTypeSelectorVisible)}
              >
                <Text style={styles.selectorText}>{selectedExamType.name}</Text>
                <ChevronDown size={20} color={colors.placeholder} />
                
                {examTypeSelectorVisible && (
                  <View style={styles.selectorDropdown}>
                    {examTypes.map(type => (
                      <Pressable
                        key={type.id}
                        style={styles.selectorItem}
                        onPress={() => {
                          setFormData(prev => ({ ...prev, examTypeId: type.id }));
                          setExamTypeSelectorVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.selectorItemText,
                          type.id === formData.examTypeId && styles.selectorItemTextActive
                        ]}>
                          {type.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </Pressable>
            </View>
            
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Term</Text>
              <Pressable 
                style={styles.selector}
                onPress={() => setTermSelectorVisible(!termSelectorVisible)}
              >
                <Text style={styles.selectorText}>{selectedTerm.name}</Text>
                <ChevronDown size={20} color={colors.placeholder} />
                
                {termSelectorVisible && (
                  <View style={styles.selectorDropdown}>
                    {terms.map(term => (
                      <Pressable
                        key={term.id}
                        style={styles.selectorItem}
                        onPress={() => {
                          setFormData(prev => ({ ...prev, termId: term.id }));
                          setTermSelectorVisible(false);
                        }}
                      >
                        <Text style={[
                          styles.selectorItemText,
                          term.id === formData.termId && styles.selectorItemTextActive
                        ]}>
                          {term.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </Pressable>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter year"
              placeholderTextColor={colors.placeholder}
              value={formData.year.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, year: parseInt(text) || new Date().getFullYear() }))}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Start Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.placeholder}
                value={formData.startDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
              />
            </View>
            
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>End Date *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.placeholder}
                value={formData.endDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, endDate: text }))}
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Grading System</Text>
            <Pressable 
              style={styles.selector}
              onPress={() => setGradingSelectorVisible(!gradingSelectorVisible)}
            >
              <Text style={styles.selectorText}>
                {formData.gradingSystem === 'knec' ? 'KNEC Grading' : 'CBC Rubrics'}
              </Text>
              <ChevronDown size={20} color={colors.placeholder} />
              
              {gradingSelectorVisible && (
                <View style={styles.selectorDropdown}>
                  <Pressable
                    style={styles.selectorItem}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, gradingSystem: 'knec' }));
                      setGradingSelectorVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.selectorItemText,
                      formData.gradingSystem === 'knec' && styles.selectorItemTextActive
                    ]}>
                      KNEC Grading
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.selectorItem}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, gradingSystem: 'cbc' }));
                      setGradingSelectorVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.selectorItemText,
                      formData.gradingSystem === 'cbc' && styles.selectorItemTextActive
                    ]}>
                      CBC Rubrics
                    </Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          </View>
          
          <View style={styles.subjectsSection}>
            <View style={styles.subjectsSectionHeader}>
              <Text style={styles.label}>Subjects</Text>
              <Pressable style={styles.addSubjectButton} onPress={addSubject}>
                <Plus size={16} color={colors.white} />
                <Text style={styles.addSubjectButtonText}>Add Subject</Text>
              </Pressable>
            </View>
            
            {examSubjects.map((examSubject, index) => {
              const subject = subjects.find(s => s.id === examSubject.subjectId);
              
              return (
                <View key={index} style={styles.subjectItem}>
                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>{subject?.name || 'Unknown Subject'}</Text>
                    <Text style={styles.subjectCode}>{subject?.code || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.subjectControls}>
                    <TextInput
                      style={styles.marksInput}
                      placeholder="Max"
                      placeholderTextColor={colors.placeholder}
                      value={examSubject.maxMarks.toString()}
                      onChangeText={(text) => updateSubject(index, 'maxMarks', text)}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                    
                    <Pressable
                      style={styles.removeSubjectButton}
                      onPress={() => removeSubject(index)}
                    >
                      <Minus size={16} color={colors.danger} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
          
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <X size={20} color={colors.text} />
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Save size={20} color={colors.white} />
              <Text style={[styles.buttonText, styles.saveButtonText]}>Create Exam</Text>
            </Pressable>
          </View>
        </View>
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
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerButton: {
    padding: 8,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selector: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  selectorText: {
    fontSize: 16,
    color: colors.text,
  },
  selectorDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  selectorItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectorItemText: {
    fontSize: 16,
    color: colors.text,
  },
  selectorItemTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  subjectsSection: {
    marginBottom: 20,
  },
  subjectsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addSubjectButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addSubjectButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  subjectCode: {
    fontSize: 14,
    color: colors.placeholder,
    marginTop: 2,
  },
  subjectControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marksInput: {
    backgroundColor: colors.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.text,
    width: 60,
    textAlign: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  removeSubjectButton: {
    backgroundColor: `${colors.danger}20`,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: colors.text,
  },
  saveButtonText: {
    color: colors.white,
  },
});