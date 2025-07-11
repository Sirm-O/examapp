import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';
import { subjects as defaultSubjects } from '@/constants/grading';
import { Subject } from '@/types';
import { BookOpen, Plus, Edit, Trash } from 'lucide-react-native';

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const saved = await AsyncStorage.getItem('customSubjects');
      if (saved) {
        setSubjects(JSON.parse(saved));
      } else {
        setSubjects(defaultSubjects);
        await AsyncStorage.setItem('customSubjects', JSON.stringify(defaultSubjects));
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects(defaultSubjects);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSubjects = async (newSubjects: Subject[]) => {
    try {
      await AsyncStorage.setItem('customSubjects', JSON.stringify(newSubjects));
      setSubjects(newSubjects);
    } catch (error) {
      console.error('Error saving subjects:', error);
      Alert.alert('Error', 'Failed to save subjects');
    }
  };

  const addSubject = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      Alert.alert('Error', 'Subject name and code are required');
      return;
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
    };

    const newSubjects = [...subjects, newSubject];
    saveSubjects(newSubjects);
    
    setFormData({ name: '', code: '' });
    setShowAddForm(false);
    Alert.alert('Success', 'Subject added successfully');
  };

  const updateSubject = () => {
    if (!editingSubject || !formData.name.trim() || !formData.code.trim()) {
      Alert.alert('Error', 'Subject name and code are required');
      return;
    }

    const newSubjects = subjects.map(subject =>
      subject.id === editingSubject.id
        ? { ...subject, name: formData.name.trim(), code: formData.code.trim().toUpperCase() }
        : subject
    );

    saveSubjects(newSubjects);
    
    setEditingSubject(null);
    setFormData({ name: '', code: '' });
    Alert.alert('Success', 'Subject updated successfully');
  };

  const deleteSubject = (subject: Subject) => {
    Alert.alert(
      'Delete Subject',
      `Are you sure you want to delete "${subject.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newSubjects = subjects.filter(s => s.id !== subject.id);
            saveSubjects(newSubjects);
            Alert.alert('Success', 'Subject deleted successfully');
          },
        },
      ]
    );
  };

  const startEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name, code: subject.code });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingSubject(null);
    setFormData({ name: '', code: '' });
    setShowAddForm(false);
  };

  const renderSubjectItem = ({ item }: { item: Subject }) => {
    return (
      <View style={styles.subjectItem}>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectName}>{item.name}</Text>
          <Text style={styles.subjectCode}>{item.code}</Text>
        </View>
        
        <View style={styles.subjectActions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => startEdit(item)}
          >
            <Edit size={16} color={colors.primary} />
          </Pressable>
          
          <Pressable
            style={[styles.actionButton, styles.deleteActionButton]}
            onPress={() => deleteSubject(item)}
          >
            <Trash size={16} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Subjects',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <BookOpen size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Subjects</Text>
          <Text style={styles.headerSubtitle}>Manage your school subjects</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{subjects.length} Subjects</Text>
            <Pressable 
              style={styles.addButton}
              onPress={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={20} color={colors.white} />
            </Pressable>
          </View>
          
          {showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Subject Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter subject name"
                  placeholderTextColor={colors.placeholder}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Subject Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter subject code (e.g., MAT)"
                  placeholderTextColor={colors.placeholder}
                  value={formData.code}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, code: text }))}
                  maxLength={5}
                  autoCapitalize="characters"
                />
              </View>
              
              <View style={styles.formActions}>
                <Pressable style={styles.cancelButton} onPress={cancelEdit}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.saveButton}
                  onPress={editingSubject ? updateSubject : addSubject}
                >
                  <Text style={styles.saveButtonText}>
                    {editingSubject ? 'Update' : 'Add'} Subject
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          
          <FlatList
            data={subjects}
            keyExtractor={(item) => item.id}
            renderItem={renderSubjectItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No subjects found</Text>
                <Text style={styles.emptySubtext}>Add subjects to get started</Text>
              </View>
            }
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
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
    flex: 1,
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addForm: {
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
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.light,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 16,
  },
  subjectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: colors.light,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  subjectActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: colors.light,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteActionButton: {
    backgroundColor: `${colors.danger}20`,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.placeholder,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.placeholder,
    textAlign: 'center',
  },
});