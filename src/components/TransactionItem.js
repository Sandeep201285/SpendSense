import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function TransactionItem({ transaction, variant = 'dark' }) {
  const isIncome = transaction.type === 'income';
  
  // Format the date slightly
  const dateObj = new Date(transaction.date);
  const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

  const isLight = variant === 'light';

  return (
    <View style={[styles.container, isLight && styles.containerLight]}>
      <View style={styles.leftSection}>
        <View style={[styles.iconPlaceholder, isLight && styles.iconPlaceholderLight]}>
          <Text style={[styles.iconText, isLight && styles.iconTextLight]}>{transaction.merchant.charAt(0)}</Text>
        </View>
        <View style={styles.details}>
          <Text style={[styles.merchant, isLight && styles.merchantLight]}>{transaction.merchant}</Text>
          <Text style={[styles.categoryAndDate, isLight && styles.categoryAndDateLight]}>{transaction.category} • {formattedDate}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: isIncome ? theme.colors.primary : (isLight ? '#000000' : theme.colors.text.primary) }]}>
          {isIncome ? '+' : '-'}₹{transaction.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  details: {
    justifyContent: 'center',
  },
  merchant: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    marginBottom: 2,
  },
  categoryAndDate: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.xs,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  iconPlaceholderLight: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  iconTextLight: {
    color: '#374151',
  },
  merchantLight: {
    color: '#111827',
  },
  categoryAndDateLight: {
    color: '#6B7280',
  },
});
