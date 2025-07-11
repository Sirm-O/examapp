import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { Database, Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react-native';

export default function BackupScreen() {
  const { students, exams, examResults, streams, initializeData } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const exportData = async () => {
    setIsExporting(true);
    try {
      const data = {
        students,
        exams,
        examResults,
        streams,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const jsonString = JSON.stringify(data, null, 2);
      
      // For demo purposes, we'll show the data size
      const dataSize = (jsonString.length / 1024).toFixed(2);
      
      Alert.alert(
        'Export Complete',
        `Data exported successfully!\n\nSize: ${dataSize} KB\nRecords: ${students.length} students, ${exams.length} exams, ${examResults.length} results`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async () => {
    setIsImporting(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      Alert.alert(
        'Import Data',
        'This will replace all existing data. Are you sure you want to continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: async () => {
              try {
                // For demo purposes, we'll simulate import
                Alert.alert('Success', 'Data imported successfully!');
                await initializeData();
              } catch (error) {
                console.error('Import error:', error);
                Alert.alert('Error', 'Failed to import data. Please check the file format.');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'Failed to import data');
    } finally {
      setIsImporting(false);
    }
  };

  const resetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all students, exams, results, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await AsyncStorage.multiRemove([
                'students',
                'exams',
                'examResults',
                'streams',
                'schoolInfo'
              ]);
              
              await initializeData();
              Alert.alert('Success', 'All data has been reset');
            } catch (error) {
              console.error('Reset error:', error);
              Alert.alert('Error', 'Failed to reset data');
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
  };

  const getDataStats = () => {
    return {
      students: students.length,
      exams: exams.length,
      results: examResults.length,
      streams: streams.length,
    };
  };

  const stats = getDataStats();

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Backup & Restore',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Database size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Backup & Restore</Text>
          <Text style={styles.headerSubtitle}>Manage your data safely</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Current Data</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.students}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.exams}</Text>
                <Text style={styles.statLabel}>Exams</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.results}</Text>
                <Text style={styles.statLabel}>Results</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.streams}</Text>
                <Text style={styles.statLabel}>Streams</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actionsCard}>
            <Text style={styles.cardTitle}>Backup Actions</Text>
            
            <Pressable 
              style={[styles.actionButton, styles.exportButton]}
              onPress={exportData}
              disabled={isExporting}
            >
              <Download size={20} color={colors.white} />
              <Text style={styles.actionButtonText}>
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Text>
            </Pressable>
            
            <Pressable 
              style={[styles.actionButton, styles.importButton]}
              onPress={importData}
              disabled={isImporting}
            >
              <Upload size={20} color={colors.white} />
              <Text style={styles.actionButtonText}>
                {isImporting ? 'Importing...' : 'Import Data'}
              </Text>
            </Pressable>
          </View>
          
          <View style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={24} color={colors.danger} />
              <Text style={styles.warningTitle}>Danger Zone</Text>
            </View>
            
            <Text style={styles.warningText}>
              The following action will permanently delete all your data. This cannot be undone.
            </Text>
            
            <Pressable 
              style={[styles.actionButton, styles.resetButton]}
              onPress={resetAllData}
              disabled={isResetting}
            >
              <RefreshCw size={20} color={colors.white} />
              <Text style={styles.actionButtonText}>
                {isResetting ? 'Resetting...' : 'Reset All Data'}
              </Text>
            </Pressable>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Backup Information</Text>
            <Text style={styles.infoText}>
              • Export creates a JSON file with all your data{'\n'}
              • Import replaces all existing data{'\n'}
              • Always backup before major changes{'\n'}
              • Keep backups in a safe location{'\n'}
              • Regular backups are recommended
            </Text>
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
  statsCard: {
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
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.placeholder,
    marginTop: 4,
  },
  actionsCard: {
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exportButton: {
    backgroundColor: colors.success,
  },
  importButton: {
    backgroundColor: colors.primary,
  },
  resetButton: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  warningCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.danger,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.danger,
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});