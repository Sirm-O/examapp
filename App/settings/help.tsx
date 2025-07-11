import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { HelpCircle, Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react-native';

export default function HelpScreen() {
  const openEmail = () => {
    Linking.openURL('mailto:support@exammanager.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:+254700000000');
  };

  const openWebsite = () => {
    Linking.openURL('https://exammanager.com/help');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Help & Support',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <HelpCircle size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <Text style={styles.headerSubtitle}>Get help with using the app</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I add students?</Text>
              <Text style={styles.faqAnswer}>
                Go to the Students tab and tap the + button. You can add students manually or upload from Excel/CSV.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I enter exam marks?</Text>
              <Text style={styles.faqAnswer}>
                Create an exam first, then go to the exam details and tap "Enter Marks". Select a subject and enter marks for each student.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>What's the difference between KNEC and CBC grading?</Text>
              <Text style={styles.faqAnswer}>
                KNEC uses letter grades (A, B, C, etc.) with points, while CBC uses levels (1-4) based on competency.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I backup my data?</Text>
              <Text style={styles.faqAnswer}>
                Go to Settings &gt; Backup &amp; Restore to export your data or import from a backup file.
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Support</Text>
            
            <Pressable style={styles.contactItem} onPress={openEmail}>
              <View style={styles.contactIcon}>
                <Mail size={20} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Email Support</Text>
                <Text style={styles.contactDetail}>support@exammanager.com</Text>
              </View>
              <ExternalLink size={16} color={colors.placeholder} />
            </Pressable>
            
            <Pressable style={styles.contactItem} onPress={openPhone}>
              <View style={styles.contactIcon}>
                <Phone size={20} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Phone Support</Text>
                <Text style={styles.contactDetail}>+254 700 000 000</Text>
              </View>
              <ExternalLink size={16} color={colors.placeholder} />
            </Pressable>
            
            <Pressable style={styles.contactItem} onPress={openWebsite}>
              <View style={styles.contactIcon}>
                <MessageCircle size={20} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Online Help</Text>
                <Text style={styles.contactDetail}>Visit our help center</Text>
              </View>
              <ExternalLink size={16} color={colors.placeholder} />
            </Pressable>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Getting Started</Text>
            <Text style={styles.guideText}>
              1. Set up your school information in Settings{'\n'}
              2. Add your subjects and exam types{'\n'}
              3. Create class streams{'\n'}
              4. Add students manually or via Excel upload{'\n'}
              5. Create exams and enter marks{'\n'}
              6. View results and generate reports
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips & Tricks</Text>
            <Text style={styles.guideText}>
              • Use the bulk upload feature to add many students at once{'\n'}
              • Regularly backup your data to prevent loss{'\n'}
              • Use the grade distribution chart to analyze performance{'\n'}
              • Filter results by class or stream for better organization{'\n'}
              • Export results for sharing with other teachers or parents
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactIcon: {
    backgroundColor: `${colors.primary}20`,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  contactDetail: {
    fontSize: 14,
    color: colors.placeholder,
    marginTop: 2,
  },
  guideText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});