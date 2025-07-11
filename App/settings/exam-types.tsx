import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';
import { examTypes as defaultExamTypes } from '@/constants/grading';
import { ExamType } from '@/types';
import { FileText, Plus, Edit, Trash } from 'lucide-react-native';

export default function ExamTypesScreen() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExamType, setEditingExamType] = useState<ExamType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    loadExamTypes();
  }, []);

  const loadExamTypes = async () => {
    try {
      const saved = await AsyncStorage.getItem('customExamTypes');
      if (saved) {
        setExamTypes(JSON.parse(saved));
      } else {
        setExamTypes(defaultExamTypes);
        await AsyncStorage.setItem('customExamTypes', JSON.stringify(defaultExamTypes));
      }
    } catch (error) {
      console.error('Error loading exam types:', error);
      setExamTypes(defaultExamTypes);
    } finally {
      setIsLoading(false);
    }
  };

  const saveExamTypes = async (newExamTypes: ExamType[]) => {
    try {
      await AsyncStorage.setItem('customExamTypes', JSON.stringify(newExamTypes));
      setExamTypes(newExamTypes);
    } catch (error) {
      console.error('Error saving exam types:', error);
      Alert.alert('Error', 'Failed to save exam types');
    }
  };

  const addExamType = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Exam type name is required');
      return;
    }

    const newExamType: ExamType = {
      id: Date.now().toString(),
      name: formData.name.trim(),
    };

    const newExamTypes = [...examTypes, newExamType];
    saveExamTypes(newExamTypes);
    
    setFormData({ name: '' });
    setShowAddForm(false);
    Alert.alert('Success', 'Exam type added successfully');
  };

  const updateExamType = () => {
    if (!editingExamType || !formData.name.trim()) {
      Alert.alert('Error', 'Exam type name is required');
      return;
    }

    const newExamTypes = examTypes.map(examType =>
      examType.id === editingExamType.id
        ? { ...examType, name: formData.name.trim() }
        : examType
    );

    saveExamTypes(newExamTypes);
    
    setEditingExamType(null);
    setFormData({ name: '' });
    Alert.alert('Success', 'Exam type updated successfully');
  };

  const deleteExamType = (examType: ExamType) => {
    Alert.alert(
      'Delete Exam Type',
      `Are you sure you want to delete "${examType.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newExamTypes = examTypes.filter(et => et.id !== examType.id);
            saveExamTypes(newExamTypes);
            Alert.alert('Success', 'Exam type deleted successfully');
          },
        },
      ]
    );
  };

  const startEdit = (examType: ExamType) => {
    setEditingExamType(examType);
    setFormData({ name: examType.name });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingExamType(null);
    setFormData({ name: '' });
    setShowAddForm(false);
  };

  const renderExamTypeItem = ({ item }: { item: ExamType }) => {
    return (
      <View style={styles.examTypeItem}>
        <View style={styles.examTypeInfo}>
          <Text style={styles.examTypeName}>{item.name}</Text>
        </View>
        
        <View style={styles.examTypeActions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => startEdit(item)}
          >
            <Edit size={16} color={colors.primary} />
          </Pressable>
          
          <Pressable
            style={[styles.actionButton, styles.deleteActionButton]}
            onPress={() => deleteExamType(item)}
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
          title: 'Exam Types',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FileText size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Exam Types</Text>
          <Text style={styles.headerSubtitle}>Manage your exam categories</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{examTypes.length} Exam Types</Text>
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
                {editingExamType ? 'Edit Exam Type' : 'Add New Exam Type'}
              </Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Exam Type Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter exam type name"
                  placeholderTextColor={colors.placeholder}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                />
              </View>
              
              <View style={styles.formActions}>
                <Pressable style={styles.cancelButton} onPress={cancelEdit}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.saveButton}
                  onPress={editingExamType ? updateExamType : addExamType}
                >
                  <Text style={styles.saveButtonText}>
                    {editingExamType ? 'Update' : 'Add'} Exam Type
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          
          <FlatList
            data={examTypes}
            keyExtractor={(item) => item.id}
            renderItem={renderExamTypeItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No exam types found</Text>
                <Text style={styles.emptySubtext}>Add exam types to categorize your exams</Text>
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
  examTypeItem: {
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
  examTypeInfo: {
    flex: 1,
  },
  examTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  examTypeActions: {
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