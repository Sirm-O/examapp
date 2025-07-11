import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { forms } from '@/constants/grading';
import { Student } from '@/types';
import { User, Save, X, ChevronDown } from 'lucide-react-native';

export default function NewStudentScreen() {
  const router = useRouter();
  const { addStudent } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    admissionNumber: '',
    formId: '4',
    gender: 'male' as 'male' | 'female',
    dateOfBirth: '',
    parentContact: '',
  });
  
  const [formSelectorVisible, setFormSelectorVisible] = useState(false);
  const [genderSelectorVisible, setGenderSelectorVisible] = useState(false);
  
  const selectedForm = forms.find(form => form.id === formData.formId) || forms[3];
  
  const handleSave = () => {
    if (!formData.name.trim() || !formData.admissionNumber.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      admissionNumber: formData.admissionNumber.trim(),
      formId: formData.formId,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth || undefined,
      parentContact: formData.parentContact || undefined,
    };
    
    addStudent(newStudent);
    Alert.alert('Success', 'Student added successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Add Student',
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
            <User size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>New Student</Text>
          <Text style={styles.headerSubtitle}>Add a new student to the system</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Student Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              placeholderTextColor={colors.placeholder}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Admission Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter admission number"
              placeholderTextColor={colors.placeholder}
              value={formData.admissionNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, admissionNumber: text }))}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Class</Text>
            <Pressable 
              style={styles.selector}
              onPress={() => setFormSelectorVisible(!formSelectorVisible)}
            >
              <Text style={styles.selectorText}>{selectedForm.name}</Text>
              <ChevronDown size={20} color={colors.placeholder} />
              
              {formSelectorVisible && (
                <View style={styles.selectorDropdown}>
                  {forms.map(form => (
                    <Pressable
                      key={form.id}
                      style={styles.selectorItem}
                      onPress={() => {
                        setFormData(prev => ({ ...prev, formId: form.id }));
                        setFormSelectorVisible(false);
                      }}
                    >
                      <Text style={[
                        styles.selectorItemText,
                        form.id === formData.formId && styles.selectorItemTextActive
                      ]}>
                        {form.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </Pressable>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <Pressable 
              style={styles.selector}
              onPress={() => setGenderSelectorVisible(!genderSelectorVisible)}
            >
              <Text style={styles.selectorText}>
                {formData.gender === 'male' ? 'Male' : 'Female'}
              </Text>
              <ChevronDown size={20} color={colors.placeholder} />
              
              {genderSelectorVisible && (
                <View style={styles.selectorDropdown}>
                  <Pressable
                    style={styles.selectorItem}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, gender: 'male' }));
                      setGenderSelectorVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.selectorItemText,
                      formData.gender === 'male' && styles.selectorItemTextActive
                    ]}>
                      Male
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.selectorItem}
                    onPress={() => {
                      setFormData(prev => ({ ...prev, gender: 'female' }));
                      setGenderSelectorVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.selectorItemText,
                      formData.gender === 'female' && styles.selectorItemTextActive
                    ]}>
                      Female
                    </Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.placeholder}
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData(prev => ({ ...prev, dateOfBirth: text }))}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Parent Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor={colors.placeholder}
              value={formData.parentContact}
              keyboardType="phone-pad"
              onChangeText={(text) => setFormData(prev => ({ ...prev, parentContact: text }))}
            />
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
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save Student</Text>
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