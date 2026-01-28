import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

import TodayScreen from '../screens/TodayScreen';
import ListsScreen from '../screens/ListsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import PremiumScreen from '../screens/PremiumScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'اليوم') iconName = focused ? 'today' : 'today-outline';
          else if (route.name === 'القوائم') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'الإحصائيات') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          else if (route.name === 'بريميوم') iconName = focused ? 'diamond' : 'diamond-outline';
          else if (route.name === 'الإعدادات') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={route.name === 'بريميوم' ? '#FFD700' : color} />;
        },
      })}
    >
      <Tab.Screen name="اليوم" component={TodayScreen} />
      <Tab.Screen name="القوائم" component={ListsScreen} />
      <Tab.Screen name="بريميوم" component={PremiumScreen} />
      <Tab.Screen name="الإحصائيات" component={AnalyticsScreen} />
      <Tab.Screen name="الإعدادات" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
