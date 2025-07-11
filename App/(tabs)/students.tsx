import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { forms } from '@/constants/grading';
import StudentCard from '@/components/StudentCard';
import { Search, Filter, ChevronDown, Plus, Upload } from 'lucide-react-native';

export default function StudentsScreen() {
  const router = useRouter();
  const { students, selectedFormId, setSelectedFormId } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [formSelectorVisible, setFormSelectorVisible] = useState(false);
  const [addMenuVisible, setAddMenuVisible] = useState(false);
  
  const selectedForm = forms.find(form => form.id === selectedFormId) || forms[3]; // Default to Form 4
  
  // Filter students by form and search query
  const filteredStudents = students.filter(student => {
    const matchesForm = student.formId === selectedFormId;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.admissionNumber.includes(searchQuery);
    return matchesForm && (searchQuery === '' || matchesSearch);
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Students',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.placeholder} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or admission number"
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <Pressable 
            style={styles.filterButton}
            onPress={() => setFormSelectorVisible(!formSelectorVisible)}
          >
            <Filter size={20} color={colors.white} />
            <Text style={styles.filterButtonText}>{selectedForm.name}</Text>
            <ChevronDown size={16} color={colors.white} />
            
            {formSelectorVisible && (
              <View style={styles.formSelectorDropdown}>
                {forms.map(form => (
                  <Pressable
                    key={form.id}
                    style={styles.formSelectorItem}
                    onPress={() => {
                      setSelectedFormId(form.id);
                      setFormSelectorVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.formSelectorItemText,
                      form.id === selectedFormId && styles.formSelectorItemTextActive
                    ]}>
                      {form.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Pressable>
        </View>
        
        <View style={styles.content}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {filteredStudents.length} Student{filteredStudents.length !== 1 ? 's' : ''}
            </Text>
            <View style={styles.addButtonContainer}>
              <Pressable 
                style={styles.addButton} 
                onPress={() => setAddMenuVisible(!addMenuVisible)}
              >
                <Plus size={20} color={colors.white} />
                
                {addMenuVisible && (
                  <View style={styles.addMenuDropdown}>
                    <Pressable
                      style={styles.addMenuItem}
                      onPress={() => {
                        setAddMenuVisible(false);
                        router.push('/student/new');
                      }}
                    >
                      <Plus size={16} color={colors.primary} />
                      <Text style={styles.addMenuItemText}>Add Manually</Text>
                    </Pressable>
                    <Pressable
                      style={styles.addMenuItem}
                      onPress={() => {
                        setAddMenuVisible(false);
                        router.push('/student/bulk-upload');
                      }}
                    >
                      <Upload size={16} color={colors.primary} />
                      <Text style={styles.addMenuItemText}>Upload Excel/CSV</Text>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
          
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StudentCard 
                student={item} 
                onPress={() => router.push(`/student/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No students found</Text>
                <Text style={styles.emptySubtext}>
                  Add students manually or upload from Excel/CSV
                </Text>
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
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: colors.text,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    position: 'relative',
  },
  filterButtonText: {
    color: colors.white,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  formSelectorDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
    width: 120,
  },
  formSelectorItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  formSelectorItemText: {
    color: colors.text,
  },
  formSelectorItemTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
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
  addButtonContainer: {
    position: 'relative',
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addMenuDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
    width: 180,
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addMenuItemText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  list: {
    paddingBottom: 16,
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