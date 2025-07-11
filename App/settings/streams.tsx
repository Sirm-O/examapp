import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';
import { forms } from '@/constants/grading';
import { Stream } from '@/types';
import { Users, Plus, Edit, Trash, ChevronDown } from 'lucide-react-native';

export default function StreamsScreen() {
  const router = useRouter();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    formId: '1',
  });
  const [formSelectorVisible, setFormSelectorVisible] = useState(false);

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    try {
      const saved = await AsyncStorage.getItem('streams');
      if (saved) {
        setStreams(JSON.parse(saved));
      } else {
        // Initialize with default streams
        const defaultStreams: Stream[] = [
          { id: '1', name: 'East', formId: '4' },
          { id: '2', name: 'West', formId: '4' },
          { id: '3', name: 'North', formId: '3' },
          { id: '4', name: 'South', formId: '3' },
          { id: '5', name: 'Alpha', formId: '2' },
          { id: '6', name: 'Beta', formId: '2' },
          { id: '7', name: 'Gamma', formId: '1' },
          { id: '8', name: 'Delta', formId: '1' },
        ];
        setStreams(defaultStreams);
        await AsyncStorage.setItem('streams', JSON.stringify(defaultStreams));
      }
    } catch (error) {
      console.error('Error loading streams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStreams = async (newStreams: Stream[]) => {
    try {
      await AsyncStorage.setItem('streams', JSON.stringify(newStreams));
      setStreams(newStreams);
    } catch (error) {
      console.error('Error saving streams:', error);
      Alert.alert('Error', 'Failed to save streams');
    }
  };

  const addStream = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Stream name is required');
      return;
    }

    const newStream: Stream = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      formId: formData.formId,
    };

    const newStreams = [...streams, newStream];
    saveStreams(newStreams);
    
    setFormData({ name: '', formId: '1' });
    setShowAddForm(false);
    Alert.alert('Success', 'Stream added successfully');
  };

  const updateStream = () => {
    if (!editingStream || !formData.name.trim()) {
      Alert.alert('Error', 'Stream name is required');
      return;
    }

    const newStreams = streams.map(stream =>
      stream.id === editingStream.id
        ? { ...stream, name: formData.name.trim(), formId: formData.formId }
        : stream
    );

    saveStreams(newStreams);
    
    setEditingStream(null);
    setFormData({ name: '', formId: '1' });
    Alert.alert('Success', 'Stream updated successfully');
  };

  const deleteStream = (stream: Stream) => {
    Alert.alert(
      'Delete Stream',
      `Are you sure you want to delete "${stream.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newStreams = streams.filter(s => s.id !== stream.id);
            saveStreams(newStreams);
            Alert.alert('Success', 'Stream deleted successfully');
          },
        },
      ]
    );
  };

  const startEdit = (stream: Stream) => {
    setEditingStream(stream);
    setFormData({ name: stream.name, formId: stream.formId });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingStream(null);
    setFormData({ name: '', formId: '1' });
    setShowAddForm(false);
  };

  const selectedForm = forms.find(form => form.id === formData.formId) || forms[0];

  const renderStreamItem = ({ item }: { item: Stream }) => {
    const form = forms.find(f => f.id === item.formId);
    
    return (
      <View style={styles.streamItem}>
        <View style={styles.streamInfo}>
          <Text style={styles.streamName}>{item.name}</Text>
          <Text style={styles.streamForm}>{form?.name || 'Unknown Form'}</Text>
        </View>
        
        <View style={styles.streamActions}>
          <Pressable
            style={styles.actionButton}
            onPress={() => startEdit(item)}
          >
            <Edit size={16} color={colors.primary} />
          </Pressable>
          
          <Pressable
            style={[styles.actionButton, styles.deleteActionButton]}
            onPress={() => deleteStream(item)}
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
          title: 'Classes & Streams',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Users size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Classes & Streams</Text>
          <Text style={styles.headerSubtitle}>Manage your school's class streams</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{streams.length} Streams</Text>
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
                {editingStream ? 'Edit Stream' : 'Add New Stream'}
              </Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Stream Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter stream name"
                  placeholderTextColor={colors.placeholder}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
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
              
              <View style={styles.formActions}>
                <Pressable style={styles.cancelButton} onPress={cancelEdit}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.saveButton}
                  onPress={editingStream ? updateStream : addStream}
                >
                  <Text style={styles.saveButtonText}>
                    {editingStream ? 'Update' : 'Add'} Stream
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          
          <FlatList
            data={streams}
            keyExtractor={(item) => item.id}
            renderItem={renderStreamItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No streams found</Text>
                <Text style={styles.emptySubtext}>Add streams to organize your classes</Text>
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
  selector: {
    backgroundColor: colors.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selectorItemText: {
    fontSize: 16,
    color: colors.text,
  },
  selectorItemTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
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
  streamItem: {
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
  streamInfo: {
    flex: 1,
  },
  streamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  streamForm: {
    fontSize: 14,
    color: colors.placeholder,
    marginTop: 2,
  },
  streamActions: {
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