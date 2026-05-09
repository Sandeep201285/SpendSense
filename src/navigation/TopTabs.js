import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import InsightsScreen from '../screens/InsightsScreen';
import BudgetingScreen from '../screens/BudgetingScreen';
import SecurityHubScreen from '../screens/SecurityHubScreen';
import { theme } from '../theme';
import { SafeAreaView, StatusBar, StyleSheet, Platform, View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { 
            backgroundColor: theme.colors.background, 
            borderBottomWidth: 1, 
            borderBottomColor: theme.colors.border,
            elevation: 0,
            shadowOpacity: 0
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text.muted,
          tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' }
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Insights" component={InsightsScreen} />
        <Tab.Screen name="Budgeting" component={BudgetingScreen} />
        <Tab.Screen name="Security Hub" component={SecurityHubScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  }
});
