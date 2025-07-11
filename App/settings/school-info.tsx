import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';
import { School, Save, MapPin, Phone, Mail, User } from 'lucide-react-native';

interface SchoolInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
  motto: string;
  established: string;
}

export default function SchoolInfoScreen() {
  const router = useRouter();
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    name: '',
    address: '',
    phone: '',
    email: '',
    principal: '',
    motto: '',
    established: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSchoolInfo();
  }, []);

  const loadSchoolInfo = async () => {
    try {
      const saved = await AsyncStorage.getItem('schoolInfo');
      if (saved) {
        setSchoolInfo(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading school info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSchoolInfo = async () => {
    if (!schoolInfo.name.trim()) {
      Alert.alert('Error', 'School name is required');
      return;
    }

    setIsSaving(true);
    try {
      await AsyncStorage.setItem('schoolInfo', JSON.stringify(schoolInfo));
      Alert.alert('Success', 'School information saved successfully');
    } catch (error) {
      console.error('Error saving school info:', error);
      Alert.alert('Error', 'Failed to save school information');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof SchoolInfo, value: string) => {
    setSchoolInfo(prev => ({ ...prev, [field]: value }));
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
          title: 'School Information',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerRight: () => (
            <Pressable 
              onPress={saveSchoolInfo} 
              style={styles.headerButton}
              disabled={isSaving}
            >
              <Save size={20} color={colors.white} />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <School size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>School Information</Text>
          <Text style={styles.headerSubtitle}>Configure your school details</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>School Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter school name"
              placeholderTextColor={colors.placeholder}
              value={schoolInfo.name}
              onChangeText={(text) => updateField('name', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter school address"
              placeholderTextColor={colors.placeholder}
              value={schoolInfo.address}
              onChangeText={(text) => updateField('address', text)}
              multiline
              numberOfLines={3}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor={colors.placeholder}
              value={schoolInfo.phone}
              onChangeText={(text) => updateField('phone', text)}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              placeholderTextColor={colors.placeholder}
              value={schoolInfo.email}
              onChangeText={(text) => updateField('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Principal Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter principal's name"
              placeholderTextColor={colors.placeholder}
              value={schoolInfo.principal}
              onChangeText={(text) => updateField('principal', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>School Motto</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter school motto"
              placeholderTextColor={colors.placeholder}
              value={schoolInfo.motto}
              onChangeText={(text) => updateField('motto', text)}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Year Established</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter year established"
              placeholderTextColor={colors.placeholder}
              value={schoolInfo.established}
              onChangeText={(text) => updateField('established', text)}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
          
          <Pressable 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={saveSchoolInfo}
            disabled={isSaving}
          >
            <Save size={20} color={colors.white} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Information'}
            </Text>
          </Pressable>
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  saveButtonDisabled: {
    backgroundColor: colors.placeholder,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});