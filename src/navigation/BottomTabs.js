import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import InsightsScreen from '../screens/InsightsScreen';
import ActivityScreen from '../screens/ActivityScreen';
import SaveScreen from '../screens/SaveScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // We use custom headers in screens
        tabBarStyle: { 
          backgroundColor: '#FFFFFF', 
          borderTopWidth: 1, 
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen} 
        options={{
          tabBarLabel: 'Insights',
        }}
      />
      <Tab.Screen 
        name="Activity" 
        component={ActivityScreen} 
        options={{
          tabBarLabel: 'Activity',
        }}
      />
      <Tab.Screen 
        name="Save" 
        component={SaveScreen} 
        options={{
          tabBarLabel: 'Save',
        }}
      />
    </Tab.Navigator>
  );
}
