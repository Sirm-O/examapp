import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import ExamCard from '@/components/ExamCard';
import { Search, Filter, ChevronDown, Plus } from 'lucide-react-native';

export default function ExamsScreen() {
  const router = useRouter();
  const { exams } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  
  // Get unique years from exams
  const years = [...new Set(exams.map(exam => exam.year))].sort((a, b) => b - a);
  
  // Filter exams by search query and year
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = yearFilter === null || exam.year === yearFilter;
    return (searchQuery === '' || matchesSearch) && matchesYear;
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Exams',
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
              placeholder="Search exams"
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <Pressable 
            style={styles.filterButton}
            onPress={() => setFilterVisible(!filterVisible)}
          >
            <Filter size={20} color={colors.white} />
            <Text style={styles.filterButtonText}>
              {yearFilter ? `Year ${yearFilter}` : 'All Years'}
            </Text>
            <ChevronDown size={16} color={colors.white} />
            
            {filterVisible && (
              <View style={styles.filterDropdown}>
                <Pressable
                  style={styles.filterItem}
                  onPress={() => {
                    setYearFilter(null);
                    setFilterVisible(false);
                  }}
                >
                  <Text style={[
                    styles.filterItemText,
                    yearFilter === null && styles.filterItemTextActive
                  ]}>
                    All Years
                  </Text>
                </Pressable>
                
                {years.map(year => (
                  <Pressable
                    key={year}
                    style={styles.filterItem}
                    onPress={() => {
                      setYearFilter(year);
                      setFilterVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.filterItemText,
                      year === yearFilter && styles.filterItemTextActive
                    ]}>
                      {year}
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
              {filteredExams.length} Exam{filteredExams.length !== 1 ? 's' : ''}
            </Text>
            <Pressable style={styles.addButton} onPress={() => router.push('/exam/new')}>
              <Plus size={20} color={colors.white} />
            </Pressable>
          </View>
          
          <FlatList
            data={filteredExams}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExamCard 
                exam={item} 
                onPress={() => router.push(`/exam/${item.id}`)}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No exams found</Text>
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
  filterDropdown: {
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
  filterItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterItemText: {
    color: colors.text,
  },
  filterItemTextActive: {
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
  },
});