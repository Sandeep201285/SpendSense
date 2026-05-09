import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { theme } from '../theme';
import TransactionItem from '../components/TransactionItem';
import { useStore } from '../store';
import AddTransactionModal from '../components/AddTransactionModal';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';

export default function DashboardScreen() {
  const { transactions, loading, fetchTransactions, addTransaction } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (data) => {
    await addTransaction(data);
  };
  if (loading && transactions.length === 0) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  // Calculate dynamic spend totals
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getTime();

  let dailySpend = 0;
  let weeklySpend = 0;
  let monthlySpend = 0;
  let lastMonthSpend = 0;
  
  const categoryTotals = {};
  let weekendSpend = 0;
  let weekdaySpend = 0;
  
  // For streak calculation
  const datesWithExpenses = new Set();

  const safeTransactions = transactions || [];

  safeTransactions.forEach(t => {
    if (t.type === 'expense') {
      const amount = parseFloat(t.amount);
      const tDate = new Date(t.date);
      const tTime = tDate.getTime();
      
      // Monthly totals
      if (tTime >= startOfMonth) {
        monthlySpend += amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
        
        const day = tDate.getDay();
        if (day === 0 || day === 6) {
          weekendSpend += amount;
        } else {
          weekdaySpend += amount;
        }
      }
      
      // Daily & Weekly
      if (tTime >= startOfDay) dailySpend += amount;
      if (tTime >= startOfWeek) weeklySpend += amount;
      
      // Last Month
      if (tTime >= startOfLastMonth && tTime <= endOfLastMonth) {
        lastMonthSpend += amount;
      }
      
      // Store date string for streak (YYYY-MM-DD)
      datesWithExpenses.add(tDate.toISOString().split('T')[0]);
    }
  });

  // Calculate comparison percentage
  const percentageDiff = lastMonthSpend > 0 
    ? ((monthlySpend - lastMonthSpend) / lastMonthSpend * 100).toFixed(0)
    : 0;
  const isHigher = monthlySpend > lastMonthSpend;

  // Calculate Streak
  let streak = 0;
  const tempDate = new Date(now);
  let lookback = 0;
  while (lookback < 30) { // Limit to 30 days to avoid infinite loop
    const dateStr = tempDate.toISOString().split('T')[0];
    if (!datesWithExpenses.has(dateStr)) {
      streak++;
      tempDate.setDate(tempDate.getDate() - 1);
    } else {
      break;
    }
    lookback++;
  }

  // Calculate SpendScore (0-100 scale now based on mockup)
  // Assume a limit of 50000 for full score, score decreases as you spend
  const baseLimit = 50000;
  const score = Math.max(0, Math.min(100, Math.floor((1 - (monthlySpend / baseLimit)) * 100))) || 0;

  // Mock savings based on budget limits vs actual
  const potentialSavings = Math.max(0, 5000 - monthlySpend * 0.1) || 0;

  // Sort by date descending and take top 5 for recent transactions
  const filteredTransactions = [...safeTransactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const screenWidth = Dimensions.get('window').width;

  const rawPieData = Object.keys(categoryTotals).map((cat, index) => ({
    name: cat,
    population: categoryTotals[cat],
    color: ['#FF8A65', '#4FC3F7', '#81C784', '#BA68C8', '#FFD54F'][index % 5],
    legendFontColor: '#FFFFFF',
    legendFontSize: 12
  }));

  const pieData = rawPieData.length > 0 ? rawPieData : [{
    name: "No Expenses",
    population: 1,
    color: '#374151',
    legendFontColor: '#FFFFFF',
    legendFontSize: 12
  }];

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>📈</Text>
          <Text style={styles.logoText}>SpendSense</Text>
        </View>
        <View style={styles.topIcons}>
          <Text style={styles.iconButton}>🔔</Text>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>S</Text>
          </View>
        </View>
      </View>

      {/* Hero & Score Row */}
      <View style={styles.heroRow}>
        <View style={styles.heroLeft}>
          <Text style={styles.greeting}>Good Evening, Sandeep 👋</Text>
          <Text style={styles.totalLabel}>You spent</Text>
          <Text style={styles.totalAmount}>₹{monthlySpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
          <Text style={styles.comparisonText}>
            <Text style={{ color: isHigher ? theme.colors.danger : theme.colors.primary }}>
              {isHigher ? '↗' : '↘'} {Math.abs(percentageDiff)}%
            </Text> vs last month
          </Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.cardLabel}>SpendScore</Text>
          <Text style={styles.scoreValue}>{score}<Text style={styles.scoreMax}>/100</Text></Text>
          <Text style={styles.scoreText}>Great! Keep it up</Text>
          <LineChart
            data={{ datasets: [{ data: [60, 65, 62, 68, 70, score] }] }}
            width={120}
            height={50}
            chartConfig={{
              backgroundColor: '#1C1E22',
              backgroundGradientFrom: '#1C1E22',
              backgroundGradientTo: '#1C1E22',
              color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
              strokeWidth: 2,
              propsForDots: { r: "0" },
              propsForBackgroundLines: { strokeWidth: 0 }
            }}
            style={{ paddingRight: 0, paddingLeft: 0, marginTop: 10 }}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels={false}
            withHorizontalLabels={false}
          />
        </View>
      </View>

      {/* Grid Layout for Middle Section */}
      <View style={styles.gridRow}>
        {/* Monthly Spending */}
        <View style={[styles.gridCard, { flex: 1.5 }]}>
          <Text style={styles.cardTitle}>Monthly Spending</Text>
          <PieChart
            data={pieData}
            width={screenWidth * 0.5}
            height={150}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            hasLegend={false}
          />
          <View style={styles.chartCenterText}>
            <Text style={styles.centerValue}>₹{monthlySpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
            <Text style={styles.centerLabel}>May 2025</Text>
          </View>
          <View style={styles.legendContainer}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendAmount}>₹{item.population.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Insight */}
        <View style={[styles.gridCard, { flex: 1 }]}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>💡</Text>
            <Text style={styles.insightTitle}>Top Insight</Text>
          </View>
          <Text style={styles.insightMainText}>You spend most on weekends 🍕</Text>
          <Text style={styles.insightSubText}>Weekend spending is 2.3x higher than weekdays.</Text>
          <BarChart
            data={{
              labels: ['W', 'W'],
              datasets: [{ data: [weekdaySpend, weekendSpend] }]
            }}
            width={120}
            height={80}
            chartConfig={{
              backgroundColor: '#1C1E22',
              backgroundGradientFrom: '#1C1E22',
              backgroundGradientTo: '#1C1E22',
              color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
              barPercentage: 0.5,
              propsForBackgroundLines: { strokeWidth: 0 }
            }}
            style={{ marginTop: 10 }}
            withHorizontalLabels={false}
            withInnerLines={false}
          />
        </View>
      </View>

      {/* Row of Category Quick View */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickViewRow}>
        {pieData.map((item, index) => (
          <View key={index} style={styles.quickViewCard}>
            <View style={[styles.quickIconBg, { backgroundColor: item.color }]}>
              <Text style={styles.quickIconText}>{item.name.charAt(0)}</Text>
            </View>
            <Text style={styles.quickCategory}>{item.name}</Text>
            <Text style={styles.quickAmount}>₹{item.population.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Streak & Savings Row */}
      <View style={styles.gridRow}>
        {/* Streak */}
        <View style={[styles.gridCard, { flex: 1 }]}>
          <Text style={styles.cardTitle}>No Spend Day Streak 🔥</Text>
          <Text style={styles.streakValue}>{streak} <Text style={styles.streakLabel}>Days</Text></Text>
          <Text style={styles.streakSubText}>Keep it going!</Text>
          <View style={styles.daysRow}>
            {['M', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={index} style={[styles.dayDot, index < streak && styles.dayDotActive]}>
                <Text style={styles.dayDotText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Savings */}
        <View style={[styles.gridCard, { flex: 1, backgroundColor: '#2C1A4D' }]}>
          <Text style={styles.cardTitle}>You can save</Text>
          <Text style={styles.savingsValue}>₹{potentialSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
          <Text style={styles.savingsSubText}>this month</Text>
          <Text style={styles.savingsTip}>Check personalized savings & offers for you.</Text>
          <TouchableOpacity style={styles.exploreBtn}>
            <Text style={styles.exploreBtnText}>Explore Savings →</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Text style={styles.viewAllText}>View all</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} variant="dark" />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <AddTransactionModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTransaction}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090A0C', // Dark background
  },
  list: {
    backgroundColor: '#090A0C',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  headerContainer: {
    marginBottom: theme.spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4D96FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  heroLeft: {
    flex: 1,
  },
  greeting: {
    color: '#A1A1AA',
    fontSize: 14,
    marginBottom: 5,
  },
  totalLabel: {
    color: '#64748B',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  comparisonText: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  scoreCard: {
    backgroundColor: '#1C1E22',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    width: 140,
    alignItems: 'flex-start',
  },
  cardLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  scoreValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreMax: {
    color: '#64748B',
    fontSize: 14,
  },
  scoreText: {
    color: '#4ADE80',
    fontSize: 12,
    marginTop: 2,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    gap: 10,
  },
  gridCard: {
    backgroundColor: '#1C1E22',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    position: 'relative',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartCenterText: {
    position: 'absolute',
    top: 60,
    left: '25%',
    alignItems: 'center',
  },
  centerValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centerLabel: {
    color: '#64748B',
    fontSize: 10,
  },
  legendContainer: {
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    color: '#A1A1AA',
    fontSize: 12,
    flex: 1,
  },
  legendAmount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  insightTitle: {
    color: '#64748B',
    fontSize: 12,
  },
  insightMainText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  insightSubText: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  quickViewRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  quickViewCard: {
    backgroundColor: '#1C1E22',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginRight: 10,
    width: 100,
  },
  quickIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  quickIconText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  quickCategory: {
    color: '#64748B',
    fontSize: 10,
    marginBottom: 2,
  },
  quickAmount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 16,
    color: '#64748B',
  },
  streakSubText: {
    color: '#A1A1AA',
    fontSize: 12,
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2D3139',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayDotActive: {
    backgroundColor: '#4ADE80',
  },
  dayDotText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  savingsValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  savingsSubText: {
    color: '#BA68C8',
    fontSize: 12,
    marginBottom: 10,
  },
  savingsTip: {
    color: '#A1A1AA',
    fontSize: 10,
    marginBottom: 15,
  },
  exploreBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  exploreBtnText: {
    color: '#090A0C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#4ADE80',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#000000',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -4,
  },
});
