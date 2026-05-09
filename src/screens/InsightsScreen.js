import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, SafeAreaView, Image, TextInput } from 'react-native';
import { theme } from '../theme';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useStore } from '../store';

export default function InsightsScreen() {
  const [activeTab, setActiveTab] = useState('Overview');
  const screenWidth = Dimensions.get('window').width;
  const { transactions, fetchTransactions, budgetLimits, updateBudgetLimit } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState('Food & Dining');
  const [budgetAmount, setBudgetAmount] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const tabs = ['Overview', 'Trends', 'Patterns', 'Budget', 'Compare'];

  // Mock data for line chart
  const lineChartData = {
    labels: ['May 1', 'May 10', 'May 20', 'May 31'],
    datasets: [
      {
        data: [2000, 5000, 4000, 10000, 8000, 15000, 18420],
        color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`, // primary green
        strokeWidth: 3
      }
    ]
  };

  const calculateTrends = (txs) => {
    const categoryTotals = {};
    txs.forEach(tx => {
      if (tx.type === 'expense') {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });

    const categoryColors = {
      'Food & Dining': '#FF8A65',
      'Shopping': '#4FC3F7',
      'Travel': '#81C784',
      'Bills & Utilities': '#BA68C8',
      'Entertainment': '#FFD54F',
      'Groceries': '#AED581',
      'Subscription': '#E57373',
      'Transfer': '#90A4AE',
      'Credit Card': '#FFF176'
    };

    return Object.keys(categoryTotals).map(cat => ({
      category: cat,
      amount: `₹${categoryTotals[cat].toLocaleString('en-IN')}`,
      change: '↗ 5%', // Mocking the change percentage for now
      positive: false,
      color: categoryColors[cat] || '#B0BEC5'
    })).sort((a, b) => {
      const amtA = parseFloat(a.amount.replace('₹', '').replace(/,/g, ''));
      const amtB = parseFloat(b.amount.replace('₹', '').replace(/,/g, ''));
      return amtB - amtA;
    });
  };

  const trends = calculateTrends(transactions);

  // Mock data for patterns
  const patterns = [
    { title: 'Late night spender', desc: 'You spend most between 9PM - 11PM', icon: '🌙' },
    { title: 'Weekend spender', desc: 'Saturdays are your highest spending days', icon: '📅' },
    { title: 'Impulse shopper', desc: 'You make more small purchases on Fridays', icon: '⚡' },
  ];

  // Mock data for merchants
  const merchants = [
    { name: 'Swiggy', orders: '14 orders', amount: '₹4,200', icon: 'https://placeholder.com/40' },
    { name: 'Amazon', orders: '8 orders', amount: '₹3,800', icon: 'https://placeholder.com/40' },
    { name: 'Uber', orders: '12 rides', amount: '₹1,900', icon: 'https://placeholder.com/40' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>Understand your money better</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardLabel}>Spending Overview</Text>
                  <Text style={styles.amount}>₹18,420</Text>
                  <Text style={styles.subAmount}>Total spent this month</Text>
                </View>
                <View style={styles.rightHeader}>
                  <Text style={styles.periodText}>May 2025 ▾</Text>
                  <Text style={styles.trendUp}>↗ 12%</Text>
                  <Text style={styles.vsText}>vs Apr 2025</Text>
                </View>
              </View>

              <LineChart
                data={lineChartData}
                width={screenWidth - 32}
                height={150}
                chartConfig={{
                  backgroundColor: '#1C1E22',
                  backgroundGradientFrom: '#1C1E22',
                  backgroundGradientTo: '#1C1E22',
                  color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
                  labelColor: (opacity = 1) => `#64748B`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "0" },
                  propsForBackgroundLines: { strokeWidth: 0 }
                }}
                style={{ marginVertical: 8, borderRadius: 16, paddingRight: 0 }}
                withDots={false}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={true}
                withHorizontalLabels={false}
                bezier
              />
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Summary</Text>
              <Text style={styles.title}>You are spending well!</Text>
              <Text style={styles.subtitle}>Your spending is within limits for 4 out of 5 categories.</Text>
            </View>
          </View>
        )}

        {activeTab === 'Trends' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Spending Trends</Text>
              <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>This Month vs Last Month</Text>

            <View style={styles.trendsCard}>
              {trends.map((item, index) => (
                <View key={index} style={styles.trendItem}>
                  <View style={[styles.categoryIcon, { backgroundColor: item.color }]} />
                  <View style={styles.trendDetails}>
                    <Text style={styles.trendCategory}>{item.category}</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '60%', backgroundColor: item.color }]} />
                    </View>
                  </View>
                  <View style={styles.trendAmountContainer}>
                    <Text style={styles.trendAmount}>{item.amount}</Text>
                    <Text style={item.positive ? styles.trendPos : styles.trendNeg}>{item.change}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Top Insight */}
            <View style={styles.topInsightCard}>
              <View style={styles.insightHeader}>
                <Text style={styles.insightIcon}>💡</Text>
                <View>
                  <Text style={styles.insightLabel}>Top Insight</Text>
                  <Text style={styles.insightTitleText}>You spend most on weekends 🍕</Text>
                  <Text style={styles.insightSubText}>Weekend spending is 2.3x higher than weekdays.</Text>
                </View>
              </View>
              <BarChart
                data={{
                  labels: ['', '', '', '', 'Weekend'],
                  datasets: [{ data: [10, 20, 30, 40, 80] }]
                }}
                width={screenWidth - 64}
                height={100}
                chartConfig={{
                  backgroundColor: '#1C1E22',
                  backgroundGradientFrom: '#1C1E22',
                  backgroundGradientTo: '#1C1E22',
                  color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
                  barPercentage: 0.5,
                  propsForBackgroundLines: { strokeWidth: 0 },
                  labelColor: (opacity = 1) => `#A1A1AA`,
                }}
                style={{ marginTop: 10, borderRadius: 16 }}
                withHorizontalLabels={false}
                withInnerLines={false}
              />
            </View>
          </View>
        )}

        {activeTab === 'Patterns' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Spending Patterns</Text>
              <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
            </View>
            {patterns.map((item, index) => (
              <TouchableOpacity key={index} style={styles.patternCard}>
                <View style={styles.patternIconBg}>
                  <Text style={styles.patternIconText}>{item.icon}</Text>
                </View>
                <View style={styles.patternDetails}>
                  <Text style={styles.patternTitle}>{item.title}</Text>
                  <Text style={styles.patternDesc}>{item.desc}</Text>
                </View>
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'Budget' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Create Budget</Text>
            </View>
            
            {/* Budget Form */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Category</Text>
              <View style={styles.pillsContainer}>
                {['Food & Dining', 'Shopping', 'Travel', 'Bills & Utilities'].map(cat => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.pill, selectedCategory === cat && styles.activePill]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.pillText, selectedCategory === cat && styles.activePillText]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.cardLabel}>Limit Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount (e.g. 3000)"
                placeholderTextColor="#64748B"
                keyboardType="numeric"
                value={budgetAmount}
                onChangeText={setBudgetAmount}
              />

              <TouchableOpacity 
                style={styles.saveBtn}
                onPress={() => {
                  const amount = parseFloat(budgetAmount);
                  if (!isNaN(amount) && amount > 0) {
                    updateBudgetLimit(selectedCategory, amount);
                    setBudgetAmount('');
                    alert(`Budget set for ${selectedCategory}: ₹${amount}`);
                  }
                }}
              >
                <Text style={styles.saveBtnText}>Set Budget</Text>
              </TouchableOpacity>
            </View>

            {/* Current Budgets & Alerts */}
            <Text style={styles.sectionTitle}>Current Budgets</Text>
            <View style={styles.trendsCard}>
              {Object.keys(budgetLimits).map((cat, index) => {
                const limit = budgetLimits[cat];
                const spent = transactions
                  .filter(tx => tx.category === cat && tx.type === 'expense')
                  .reduce((sum, tx) => sum + tx.amount, 0);
                const isExceeded = spent > limit;
                const percentage = Math.min((spent / limit) * 100, 100);

                return (
                  <View key={index} style={styles.trendItem}>
                    <View style={styles.trendDetails}>
                      <Text style={styles.trendCategory}>{cat}</Text>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: isExceeded ? '#F87171' : '#4ADE80' }]} />
                      </View>
                      <Text style={styles.subAmount}>Spent: ₹{spent.toLocaleString('en-IN')} / ₹{limit.toLocaleString('en-IN')}</Text>
                    </View>
                    {isExceeded && (
                      <View style={styles.alertBadge}>
                        <Text style={styles.alertText}>Overlimit!</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 'Compare' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Top Merchants</Text>
              <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
            </View>
            <View style={styles.merchantsCard}>
              {merchants.map((item, index) => (
                <View key={index} style={styles.merchantItem}>
                  <View style={styles.merchantAvatar}>
                    <Text style={styles.merchantAvatarText}>{item.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.merchantDetails}>
                    <Text style={styles.merchantName}>{item.name}</Text>
                    <Text style={styles.merchantOrders}>{item.orders}</Text>
                  </View>
                  <Text style={styles.merchantAmount}>{item.amount}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090A0C', // matches dashboard
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#1C1E22',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4ADE80',
  },
  tabText: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#090A0C',
  },
  card: {
    backgroundColor: '#1C1E22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardLabel: {
    color: '#64748B',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subAmount: {
    color: '#64748B',
    fontSize: 12,
  },
  rightHeader: {
    alignItems: 'flex-end',
  },
  periodText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  trendUp: {
    color: '#4ADE80',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  vsText: {
    color: '#64748B',
    fontSize: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 10,
  },
  viewAllText: {
    color: '#4ADE80',
    fontSize: 14,
  },
  trendsCard: {
    backgroundColor: '#1C1E22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  trendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  trendDetails: {
    flex: 1,
    marginRight: 10,
  },
  trendCategory: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#2D3139',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  trendAmountContainer: {
    alignItems: 'flex-end',
  },
  trendAmount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendNeg: {
    color: '#F87171',
    fontSize: 12,
  },
  trendPos: {
    color: '#4ADE80',
    fontSize: 12,
  },
  topInsightCard: {
    backgroundColor: '#052E16', // dark green tint
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderColor: '#15803D',
    borderWidth: 1,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightLabel: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '600',
  },
  insightTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  insightSubText: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  patternCard: {
    backgroundColor: '#1C1E22',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  patternIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D3139',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patternIconText: {
    fontSize: 20,
  },
  patternDetails: {
    flex: 1,
  },
  patternTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  patternDesc: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  arrowText: {
    color: '#64748B',
    fontSize: 20,
  },
  merchantsCard: {
    backgroundColor: '#1C1E22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  merchantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  merchantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8A65', // fallback
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  merchantAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  merchantDetails: {
    flex: 1,
  },
  merchantName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  merchantOrders: {
    color: '#64748B',
    fontSize: 12,
  },
  merchantAmount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#2D3139',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#4ADE80',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#090A0C',
    fontSize: 14,
    fontWeight: '600',
  },
  alertBadge: {
    backgroundColor: '#F87171',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#2D3139',
  },
  activePill: {
    backgroundColor: '#4ADE80',
  },
  pillText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
  },
  activePillText: {
    color: '#090A0C',
  },
});
