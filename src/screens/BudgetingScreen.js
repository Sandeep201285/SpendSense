import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme';
import { useStore } from '../store';

export default function BudgetingScreen() {
  const { transactions, loading, fetchTransactions, budgetLimits, updateBudgetLimit } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newLimit, setNewLimit] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading && transactions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Group transactions by category to calculate dynamic budgets
  const categoryTotals = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const cat = t.category || 'Misc';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(t.amount);
    }
  });

  // Calculate dynamic budgets ensuring all keys in budgetLimits show up
  const dynamicBudgets = Object.keys(budgetLimits).map((cat, index) => ({
    id: String(index),
    category: cat,
    spent: categoryTotals[cat] || 0,
    limit: budgetLimits[cat],
  }));

  const handleEditBudget = (category, currentLimit) => {
    setSelectedCategory(category);
    setNewLimit(String(currentLimit));
    setModalVisible(true);
  };

  const handleSaveBudget = () => {
    if (selectedCategory && newLimit) {
      updateBudgetLimit(selectedCategory, parseFloat(newLimit));
    }
    setModalVisible(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Budgets</Text>
          <Text style={styles.subtitle}>Tap any category to setup its budget limit.</Text>
        </View>

        <View style={styles.budgetList}>
          {dynamicBudgets.map(budget => {
            const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
            const isDanger = percentage > 90;
            const isWarning = percentage > 75 && !isDanger;
            
            let barColor = theme.colors.primary;
            if (isDanger) barColor = theme.colors.danger;
            else if (isWarning) barColor = '#FBBF24';

            return (
              <TouchableOpacity 
                key={budget.id} 
                style={styles.budgetCard}
                onPress={() => handleEditBudget(budget.category, budget.limit)}
              >
                <View style={styles.budgetHeader}>
                  <Text style={styles.budgetCategory}>{budget.category}</Text>
                  <Text style={styles.budgetAmounts}>
                    ₹{budget.spent.toLocaleString('en-IN', { maximumFractionDigits: 0 })} 
                    <Text style={styles.budgetLimit}> / ₹{budget.limit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
                  </Text>
                </View>
                
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${Math.min(percentage, 100)}%`, backgroundColor: barColor }
                    ]} 
                  />
                </View>
                {isDanger && <Text style={styles.dangerText}>Approaching limit!</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Edit Budget Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView 
          style={styles.modalOverlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Budget for {selectedCategory}</Text>
            
            <Text style={styles.label}>Monthly Limit (₹)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., 5000"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="numeric"
              value={newLimit}
              onChangeText={setNewLimit}
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleSaveBudget}>
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
  },
  budgetList: {
    paddingBottom: theme.spacing.xl,
  },
  budgetCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  budgetCategory: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  budgetAmounts: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  budgetLimit: {
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.regular,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.round,
  },
  dangerText: {
    color: theme.colors.danger,
    fontSize: theme.typography.sizes.xs,
    marginTop: theme.spacing.sm,
    fontWeight: theme.typography.weights.medium,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.lg,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.background,
    color: theme.colors.text.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  button: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.bold,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  addButtonText: {
    color: theme.colors.background,
    fontWeight: theme.typography.weights.bold,
  },
});
