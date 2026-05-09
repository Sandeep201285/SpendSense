import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { theme } from '../theme';
import { useStore } from '../store';

export default function ActivityScreen() {
  const { transactions, loading, fetchTransactions } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filters = ['All', 'Expenses', 'Income', 'Filter ▾'];

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Food & Dining': return '🍔';
      case 'Travel': return '🚗';
      case 'Shopping': return '📦';
      case 'Transfer': return '📱';
      case 'Groceries': return '🥦';
      case 'Subscription': return '🎬';
      case 'Bills & Utilities': return '💡';
      case 'Income': return '💰';
      case 'Credit Card': return '💳';
      default: return '🛍️';
    }
  };

  const groupTransactionsByDate = (txs) => {
    const groups = {};
    txs.forEach(tx => {
      const dateObj = new Date(tx.date);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let groupTitle = '';
      if (dateObj.toDateString() === today.toDateString()) {
        groupTitle = 'Today';
      } else if (dateObj.toDateString() === yesterday.toDateString()) {
        groupTitle = 'Yesterday';
      } else {
        groupTitle = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }

      if (!groups[groupTitle]) {
        groups[groupTitle] = [];
      }
      groups[groupTitle].push({
        id: tx.id.toString(),
        merchant: tx.merchant,
        time: dateObj.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }),
        category: tx.category,
        amount: `₹${tx.amount.toLocaleString('en-IN')}`,
        type: tx.type,
        icon: getIconForCategory(tx.category)
      });
    });

    // Sort groups so Today and Yesterday are first, or sort by date
    // For simplicity, we just return the array. If the DB returns sorted by date, this will be sorted.
    return Object.keys(groups).map(title => ({
      title,
      data: groups[title]
    }));
  };

  const displayData = groupTransactionsByDate(transactions);

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.merchantName}>{item.merchant}</Text>
        <Text style={styles.subText}>{item.time} • {item.category}</Text>
      </View>
      <Text style={[styles.amountText, item.type === 'income' && styles.incomeAmount]}>
        {item.type === 'income' ? '+' : ''}{item.amount}
      </Text>
    </View>
  );

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Activity</Text>
          <Text style={styles.subtitle}>All your transactions in one place</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions"
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterBtnText}>≡</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.pillsContainer}>
          {filters.map(filter => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.pill, activeFilter === filter && styles.activePill]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.pillText, activeFilter === filter && styles.activePillText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Grouped List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {displayData.map((group, index) => (
            <View key={index}>
              {renderSectionHeader(group.title)}
              {group.data.map(item => (
                <View key={item.id}>
                  {renderItem({ item })}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090A0C',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 14,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1E22',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
    color: '#64748B',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#1C1E22',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  pillsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1C1E22',
  },
  activePill: {
    backgroundColor: '#4ADE80',
  },
  pillText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
  },
  activePillText: {
    color: '#090A0C',
  },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1E22',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D3139',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  detailsContainer: {
    flex: 1,
  },
  merchantName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  subText: {
    color: '#64748B',
    fontSize: 12,
  },
  amountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#4ADE80',
  },
});
