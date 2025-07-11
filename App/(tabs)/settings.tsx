import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { 
  Settings, 
  School, 
  BookOpen, 
  Users, 
  FileText, 
  Database, 
  HelpCircle, 
  Info, 
  ChevronRight 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Settings size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Configure your exam management system</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>School Management</Text>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => router.push('/settings/school-info')}
          >
            <View style={styles.menuItemIcon}>
              <School size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>School Information</Text>
            <ChevronRight size={20} color={colors.placeholder} />
          </Pressable>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => router.push('/settings/subjects')}
          >
            <View style={styles.menuItemIcon}>
              <BookOpen size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Subjects</Text>
            <ChevronRight size={20} color={colors.placeholder} />
          </Pressable>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => router.push('/settings/streams')}
          >
            <View style={styles.menuItemIcon}>
              <Users size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Classes & Streams</Text>
            <ChevronRight size={20} color={colors.placeholder} />
          </Pressable>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => router.push('/settings/exam-types')}
          >
            <View style={styles.menuItemIcon}>
              <FileText size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Exam Types</Text>
            <ChevronRight size={20} color={colors.placeholder} />
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => router.push('/settings/backup')}
          >
            <View style={styles.menuItemIcon}>
              <Database size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Backup & Restore</Text>
            <ChevronRight size={20} color={colors.placeholder} />
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => router.push('/settings/help')}
          >
            <View style={styles.menuItemIcon}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <ChevronRight size={20} color={colors.placeholder} />
          </Pressable>
          
          <Pressable 
            style={styles.menuItem}
            onPress={() => router.push('/settings/about')}
          >
            <View style={styles.menuItemIcon}>
              <Info size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>About This App</Text>
            <ChevronRight size={20} color={colors.placeholder} />
          </Pressable>
          
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
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
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemIcon: {
    backgroundColor: `${colors.primary}20`,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  versionText: {
    fontSize: 14,
    color: colors.placeholder,
  },
});