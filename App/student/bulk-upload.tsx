import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { Student } from '@/types';
import { Upload, FileSpreadsheet, Download, Users, CheckCircle, AlertCircle } from 'lucide-react-native';

export default function BulkUploadScreen() {
  const router = useRouter();
  const { addStudent } = useAppStore();
  
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const downloadTemplate = () => {
    Alert.alert(
      'Download Template',
      'The Excel template should have the following columns:\n\n• Name (required)\n• Admission Number (required)\n• Form ID (1-4)\n• Gender (male/female)\n• Date of Birth (YYYY-MM-DD)\n• Parent Contact',
      [{ text: 'OK' }]
    );
  };

  const parseExcelData = (data: string): Student[] => {
    const lines = data.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('File must contain header and at least one data row');
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const students: Student[] = [];
    
    // Expected headers
    const nameIndex = headers.findIndex(h => h.includes('name'));
    const admissionIndex = headers.findIndex(h => h.includes('admission'));
    const formIndex = headers.findIndex(h => h.includes('form') || h.includes('class'));
    const genderIndex = headers.findIndex(h => h.includes('gender'));
    const dobIndex = headers.findIndex(h => h.includes('birth') || h.includes('dob'));
    const contactIndex = headers.findIndex(h => h.includes('contact') || h.includes('phone'));
    
    if (nameIndex === -1 || admissionIndex === -1) {
      throw new Error('Required columns "Name" and "Admission Number" not found');
    }
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < 2) continue;
      
      const name = values[nameIndex]?.trim();
      const admissionNumber = values[admissionIndex]?.trim();
      
      if (!name || !admissionNumber) continue;
      
      const student: Student = {
        id: `${Date.now()}_${i}`,
        name,
        admissionNumber,
        formId: values[formIndex]?.trim() || '4',
        gender: (values[genderIndex]?.toLowerCase().trim() === 'female' ? 'female' : 'male') as 'male' | 'female',
        dateOfBirth: values[dobIndex]?.trim() || undefined,
        parentContact: values[contactIndex]?.trim() || undefined,
      };
      
      students.push(student);
    }
    
    return students;
  };

  const handleFileUpload = async () => {
    try {
      setUploadStatus('processing');
      setErrorMessage('');
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        setUploadStatus('idle');
        return;
      }
      
      const file = result.assets[0];
      
      // For demo purposes, we'll simulate CSV parsing
      // In a real app, you'd use a library like xlsx to parse Excel files
      if (!file.name.toLowerCase().includes('.csv')) {
        throw new Error('Please upload a CSV file. Excel files require additional processing.');
      }
      
      // Read file content (this is a simplified version)
      const response = await fetch(file.uri);
      const text = await response.text();
      
      const students = parseExcelData(text);
      
      if (students.length === 0) {
        throw new Error('No valid student data found in the file');
      }
      
      // Add students to store
      students.forEach(student => addStudent(student));
      
      setUploadedCount(students.length);
      setUploadStatus('success');
      
      Alert.alert(
        'Success',
        `Successfully uploaded ${students.length} students!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
      
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while uploading');
      Alert.alert('Upload Error', errorMessage);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Bulk Upload Students',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Upload size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Bulk Upload</Text>
          <Text style={styles.headerSubtitle}>Upload multiple students from Excel/CSV</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.instructionsCard}>
            <Text style={styles.cardTitle}>Instructions</Text>
            <Text style={styles.instructionText}>
              1. Download the template file{'\n'}
              2. Fill in student information{'\n'}
              3. Save as CSV format{'\n'}
              4. Upload the completed file
            </Text>
          </View>
          
          <Pressable style={styles.templateButton} onPress={downloadTemplate}>
            <Download size={20} color={colors.primary} />
            <Text style={styles.templateButtonText}>Download Template</Text>
          </Pressable>
          
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>Upload File</Text>
            
            <Pressable 
              style={[
                styles.uploadArea,
                uploadStatus === 'processing' && styles.uploadAreaProcessing,
                uploadStatus === 'success' && styles.uploadAreaSuccess,
                uploadStatus === 'error' && styles.uploadAreaError,
              ]}
              onPress={handleFileUpload}
              disabled={uploadStatus === 'processing'}
            >
              <View style={styles.uploadContent}>
                {uploadStatus === 'idle' && (
                  <>
                    <FileSpreadsheet size={48} color={colors.primary} />
                    <Text style={styles.uploadText}>Tap to select CSV file</Text>
                    <Text style={styles.uploadSubtext}>Supports CSV format</Text>
                  </>
                )}
                
                {uploadStatus === 'processing' && (
                  <>
                    <Upload size={48} color={colors.accent} />
                    <Text style={styles.uploadText}>Processing...</Text>
                    <Text style={styles.uploadSubtext}>Please wait</Text>
                  </>
                )}
                
                {uploadStatus === 'success' && (
                  <>
                    <CheckCircle size={48} color={colors.success} />
                    <Text style={[styles.uploadText, { color: colors.success }]}>
                      Upload Successful!
                    </Text>
                    <Text style={styles.uploadSubtext}>
                      {uploadedCount} students added
                    </Text>
                  </>
                )}
                
                {uploadStatus === 'error' && (
                  <>
                    <AlertCircle size={48} color={colors.danger} />
                    <Text style={[styles.uploadText, { color: colors.danger }]}>
                      Upload Failed
                    </Text>
                    <Text style={styles.uploadSubtext}>Tap to try again</Text>
                  </>
                )}
              </View>
            </Pressable>
            
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.formatCard}>
            <Text style={styles.cardTitle}>Required Columns</Text>
            <View style={styles.columnList}>
              <View style={styles.columnItem}>
                <Text style={styles.columnName}>Name</Text>
                <Text style={styles.columnRequired}>Required</Text>
              </View>
              <View style={styles.columnItem}>
                <Text style={styles.columnName}>Admission Number</Text>
                <Text style={styles.columnRequired}>Required</Text>
              </View>
              <View style={styles.columnItem}>
                <Text style={styles.columnName}>Form ID</Text>
                <Text style={styles.columnOptional}>Optional (1-4)</Text>
              </View>
              <View style={styles.columnItem}>
                <Text style={styles.columnName}>Gender</Text>
                <Text style={styles.columnOptional}>Optional (male/female)</Text>
              </View>
              <View style={styles.columnItem}>
                <Text style={styles.columnName}>Date of Birth</Text>
                <Text style={styles.columnOptional}>Optional (YYYY-MM-DD)</Text>
              </View>
              <View style={styles.columnItem}>
                <Text style={styles.columnName}>Parent Contact</Text>
                <Text style={styles.columnOptional}>Optional</Text>
              </View>
            </View>
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
  content: {
    padding: 16,
  },
  instructionsCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  templateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 8,
  },
  uploadSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  uploadArea: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadAreaProcessing: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}10`,
  },
  uploadAreaSuccess: {
    borderColor: colors.success,
    backgroundColor: `${colors.success}10`,
  },
  uploadAreaError: {
    borderColor: colors.danger,
    backgroundColor: `${colors.danger}10`,
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    color: colors.placeholder,
  },
  errorContainer: {
    backgroundColor: `${colors.danger}20`,
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  formatCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  columnList: {
    marginTop: 8,
  },
  columnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  columnName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  columnRequired: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: 'bold',
  },
  columnOptional: {
    fontSize: 12,
    color: colors.placeholder,
  },
});