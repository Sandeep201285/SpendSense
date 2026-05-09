import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { useStore } from '../store';

export default function AddTransactionModal({ visible, onClose, onAdd }) {
  const [mode, setMode] = useState('manual'); // 'manual' or 'ai'
  const [pasteText, setPasteText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const { parseMessage } = useStore();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  
  // Default type is expense for manual entry in MVP
  const type = 'expense';

  const handleAdd = () => {
    if (!merchant || !amount || !category) return;
    
    onAdd({
      merchant,
      amount: parseFloat(amount),
      date: new Date().toISOString(),
      category,
      type
    });
    
    // Reset form
    setMerchant('');
    setAmount('');
    setCategory('');
    setPasteText('');
    setMode('manual');
    onClose();
  };

  const openFilePicker = () => {
    if (Platform.OS !== 'web') {
      alert("File picking is only supported on Web in this demo.");
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Simulate extraction delay after file selection
        setIsParsing(true);
        setTimeout(async () => {
          const fileType = file.type.includes('pdf') ? 'pdf' : 'image';
          const mockText = fileType === 'image' 
            ? "Swiggy Order. Amount: Rs. 420. Paid on 08-05-2026." 
            : "Invoice from Amazon. Total: INR 1299.00. Date: 08-05-2026.";
          
          setPasteText(mockText);
          
          const success = await parseMessage(mockText);
          setIsParsing(false);
          if (success) {
            onClose();
          } else {
            alert("Failed to parse message");
          }
        }, 1500);
      }
    };
    input.click();
  };

  const handleParse = async () => {
    if (!pasteText) return;
    setIsParsing(true);
    const success = await parseMessage(pasteText);
    setIsParsing(false);
    if (success) {
      onClose();
    } else {
      alert("Failed to parse message");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        style={styles.modalOverlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContent}>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, mode === 'manual' && styles.activeTab]} 
              onPress={() => setMode('manual')}
            >
              <Text style={[styles.tabText, mode === 'manual' && styles.activeTabText]}>Manual Entry</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, mode === 'ai' && styles.activeTab]} 
              onPress={() => setMode('ai')}
            >
              <Text style={[styles.tabText, mode === 'ai' && styles.activeTabText]}>✨ AI Paste</Text>
            </TouchableOpacity>
          </View>

          {mode === 'manual' ? (
            <>
              <Text style={styles.label}>Merchant</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g., Amazon, Starbucks"
                placeholderTextColor={theme.colors.text.muted}
                value={merchant}
                onChangeText={setMerchant}
              />
              
              <Text style={styles.label}>Amount (₹)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g., 500"
                placeholderTextColor={theme.colors.text.muted}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={styles.label}>Category</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g., Food & Dining, Shopping"
                placeholderTextColor={theme.colors.text.muted}
                value={category}
                onChangeText={setCategory}
              />
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAdd}>
                  <Text style={styles.addButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>Upload Bill</Text>
              <TouchableOpacity style={styles.input} onPress={openFilePicker}>
                <Text style={{ color: theme.colors.text.secondary }}>📁 Choose Screenshot or PDF</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Or Paste Bank SMS or Email text</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="e.g. Sent Rs.450.00 to Swiggy on 05-06-24..."
                placeholderTextColor={theme.colors.text.muted}
                multiline
                numberOfLines={4}
                value={pasteText}
                onChangeText={setPasteText}
              />
              
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.addButton, (!pasteText || isParsing) && styles.disabledButton]} 
                  onPress={handleParse}
                  disabled={!pasteText || isParsing}
                >
                  {isParsing ? (
                    <ActivityIndicator color={theme.colors.background} />
                  ) : (
                    <Text style={styles.addButtonText}>Auto-Extract</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    color: theme.colors.background, // Dark text on primary button
    fontWeight: theme.typography.weights.bold,
  },
  disabledButton: {
    opacity: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.surface,
  },
  tabText: {
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    gap: 10,
  },
  uploadBtn: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  uploadBtnText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
    fontSize: 12,
  },
});
