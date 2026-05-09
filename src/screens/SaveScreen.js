import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../theme';
import { useStore } from '../store';

export default function SaveScreen() {
  const screenWidth = Dimensions.get('window').width;
  const { transactions, fetchTransactions } = useStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getSubscriptions = (txs) => {
    const subs = [];
    txs.forEach(tx => {
      if (tx.category === 'Subscription' || tx.merchant === 'Netflix' || tx.merchant === 'Spotify') {
        subs.push({
          name: tx.merchant,
          amount: `₹${tx.amount.toLocaleString('en-IN')} / month`,
          date: 'Renews on 15 Jun', // Mocking renewal date
          icon: tx.merchant === 'Netflix' ? '🎬' : (tx.merchant === 'Spotify' ? '🎵' : '☁️')
        });
      }
    });
    
    // If no subscriptions found in transactions, use a fallback to keep it looking good
    if (subs.length === 0) {
      return [
        { name: 'Netflix', amount: '₹649 / month', date: 'Renews on 15 Jun', icon: '🎬' },
        { name: 'Spotify', amount: '₹119 / month', date: 'Renews on 20 Jun', icon: '🎵' },
        { name: 'Google One', amount: '₹130 / month', date: 'Renews on 25 Jun', icon: '☁️' },
      ];
    }
    return subs;
  };

  const subscriptions = getSubscriptions(transactions);

  const saveMoreItems = [
    { title: 'Unused Subscriptions', desc: 'You can save ₹899/month', icon: '♻️' },
    { title: 'Cashback Opportunities', desc: 'You missed ₹650 cashback', icon: '💸' },
    { title: 'Bill Negotiation', desc: 'Reduce your bills & save more', icon: '🧮' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Save</Text>
          <Text style={styles.subtitle}>Save more, spend smarter</Text>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>You can save up to</Text>
            <Text style={styles.heroAmount}>₹2,450</Text>
            <Text style={styles.heroSubText}>this month</Text>
            
            <TouchableOpacity style={styles.exploreBtn}>
              <Text style={styles.exploreBtnText}>Explore Savings ›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroIllustration}>
            <Text style={styles.illustrationText}>💜</Text>
          </View>
        </View>

        {/* Recommended For You */}
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        
        {/* Credit Card Offer */}
        <View style={styles.offerCard}>
          <Text style={styles.offerLabel}>Best Credit Card for You</Text>
          <Text style={styles.offerTitle}>Save up to ₹1,800/yr</Text>
          <Text style={styles.offerDesc}>on your spending</Text>
          <View style={styles.cardVisual}>
            <View style={styles.mockCard}>
              <Text style={styles.mockCardText}>VISA</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.applyBtn}>
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </TouchableOpacity>
        </View>

        {/* Swiggy Offer */}
        <View style={styles.smallOfferCard}>
          <View style={styles.offerRow}>
            <View style={styles.offerDetails}>
              <Text style={styles.smallOfferLabel}>Swiggy Offer</Text>
              <Text style={styles.smallOfferTitle}>Get 15% instant discount</Text>
              <Text style={styles.smallOfferDesc}>up to ₹150 on Swiggy</Text>
              <TouchableOpacity style={styles.viewOfferBtn}>
                <Text style={styles.viewOfferText}>View Offer</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.offerIconBg}>
              <Text style={styles.offerIconText}>🍔</Text>
            </View>
          </View>
        </View>

        {/* Uber Offer */}
        <View style={styles.smallOfferCard}>
          <View style={styles.offerRow}>
            <View style={styles.offerDetails}>
              <Text style={styles.smallOfferLabel}>Uber Offer</Text>
              <Text style={styles.smallOfferTitle}>Flat 10% off up to ₹75</Text>
              <Text style={styles.smallOfferDesc}>on Uber rides</Text>
              <TouchableOpacity style={styles.viewOfferBtn}>
                <Text style={styles.viewOfferText}>View Offer</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.offerIconBg}>
              <Text style={styles.offerIconText}>🚗</Text>
            </View>
          </View>
        </View>

        {/* Subscription Manager */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Subscription Manager</Text>
          <TouchableOpacity><Text style={styles.viewAllText}>View all</Text></TouchableOpacity>
        </View>

        <View style={styles.subsCard}>
          {subscriptions.map((sub, index) => (
            <View key={index} style={styles.subItem}>
              <View style={styles.subIconBg}>
                <Text style={styles.subIconText}>{sub.icon}</Text>
              </View>
              <View style={styles.subDetails}>
                <Text style={styles.subName}>{sub.name}</Text>
                <Text style={styles.subAmount}>{sub.amount}</Text>
              </View>
              <Text style={styles.subDate}>{sub.date}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.manageBtn}>
            <Text style={styles.manageBtnText}>Manage Subscriptions</Text>
          </TouchableOpacity>
        </View>

        {/* Save More */}
        <Text style={styles.sectionTitle}>Save More</Text>
        {saveMoreItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.saveMoreItem}>
            <View style={styles.saveMoreIconBg}>
              <Text style={styles.saveMoreIconText}>{item.icon}</Text>
            </View>
            <View style={styles.saveMoreDetails}>
              <Text style={styles.saveMoreTitle}>{item.title}</Text>
              <Text style={styles.saveMoreDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.exploreAllBtn}>
          <Text style={styles.exploreAllText}>Explore All Ways to Save</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
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
  heroCard: {
    backgroundColor: '#2C1A4D', // dark purple
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroContent: {
    flex: 1,
  },
  heroLabel: {
    color: '#BA68C8',
    fontSize: 12,
    fontWeight: '600',
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  heroSubText: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  exploreBtn: {
    backgroundColor: '#4C2B85',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  heroIllustration: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4C2B85',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationText: {
    fontSize: 30,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  viewAllText: {
    color: '#4ADE80',
    fontSize: 14,
  },
  offerCard: {
    backgroundColor: '#1C1E22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  offerLabel: {
    color: '#4FC3F7',
    fontSize: 12,
    fontWeight: '600',
  },
  offerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  offerDesc: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  cardVisual: {
    alignItems: 'flex-end',
    marginTop: -20,
  },
  mockCard: {
    width: 80,
    height: 50,
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  mockCardText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  applyBtn: {
    backgroundColor: '#2D3139',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  smallOfferCard: {
    backgroundColor: '#1C1E22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  offerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerDetails: {
    flex: 1,
  },
  smallOfferLabel: {
    color: '#FF8A65',
    fontSize: 12,
    fontWeight: '600',
  },
  smallOfferTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  smallOfferDesc: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  viewOfferBtn: {
    backgroundColor: '#2D3139',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  viewOfferText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  offerIconBg: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2D3139',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerIconText: {
    fontSize: 24,
  },
  subsCard: {
    backgroundColor: '#1C1E22',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2D3139',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subIconText: {
    fontSize: 20,
  },
  subDetails: {
    flex: 1,
  },
  subName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  subAmount: {
    color: '#64748B',
    fontSize: 12,
  },
  subDate: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  manageBtn: {
    backgroundColor: '#2D3139',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  manageBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  saveMoreItem: {
    backgroundColor: '#1C1E22',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveMoreIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2D3139',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  saveMoreIconText: {
    fontSize: 20,
  },
  saveMoreDetails: {
    flex: 1,
  },
  saveMoreTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  saveMoreDesc: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  arrowText: {
    color: '#64748B',
    fontSize: 20,
  },
  exploreAllBtn: {
    backgroundColor: '#2C1A4D',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  exploreAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
