import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { Info, Heart, Star, ExternalLink, Shield, Users } from 'lucide-react-native';

export default function AboutScreen() {
  const openWebsite = () => {
    Linking.openURL('https://exammanager.com');
  };

  const openPrivacy = () => {
    Linking.openURL('https://exammanager.com/privacy');
  };

  const openTerms = () => {
    Linking.openURL('https://exammanager.com/terms');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'About This App',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Info size={32} color={colors.white} />
          </View>
          <Text style={styles.headerTitle}>Exam Manager</Text>
          <Text style={styles.headerSubtitle}>Version 1.0.0</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              Exam Manager is a comprehensive solution for managing examination systems in Kenyan secondary schools. 
              It supports both KNEC grading system and CBC rubrics, making it perfect for modern educational institutions.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Users size={16} color={colors.primary} />
                <Text style={styles.featureText}>Student Management</Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={16} color={colors.primary} />
                <Text style={styles.featureText}>KNEC & CBC Grading</Text>
              </View>
              <View style={styles.featureItem}>
                <Heart size={16} color={colors.primary} />
                <Text style={styles.featureText}>Results Analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <Shield size={16} color={colors.primary} />
                <Text style={styles.featureText}>Data Backup & Security</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developer</Text>
            <Text style={styles.description}>
              Built with ❤️ for Kenyan educators. This app is designed to simplify exam management and help teachers 
              focus on what matters most - educating students.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links</Text>
            
            <Pressable style={styles.linkItem} onPress={openWebsite}>
              <Text style={styles.linkText}>Visit Website</Text>
              <ExternalLink size={16} color={colors.primary} />
            </Pressable>
            
            <Pressable style={styles.linkItem} onPress={openPrivacy}>
              <Text style={styles.linkText}>Privacy Policy</Text>
              <ExternalLink size={16} color={colors.primary} />
            </Pressable>
            
            <Pressable style={styles.linkItem} onPress={openTerms}>
              <Text style={styles.linkText}>Terms of Service</Text>
              <ExternalLink size={16} color={colors.primary} />
            </Pressable>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Information</Text>
            <View style={styles.techInfo}>
              <View style={styles.techItem}>
                <Text style={styles.techLabel}>Version:</Text>
                <Text style={styles.techValue}>1.0.0</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techLabel}>Build:</Text>
                <Text style={styles.techValue}>2025.01.001</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techLabel}>Platform:</Text>
                <Text style={styles.techValue}>React Native</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={styles.techLabel}>Framework:</Text>
                <Text style={styles.techValue}>Expo</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 Exam Manager. All rights reserved.
            </Text>
            <Text style={styles.footerSubtext}>
              Made for Kenyan Schools
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
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  techInfo: {
    marginTop: 8,
  },
  techItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  techLabel: {
    fontSize: 14,
    color: colors.placeholder,
  },
  techValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.placeholder,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.placeholder,
    textAlign: 'center',
    marginTop: 4,
  },
});