import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ListsScreen from '../screens/ListsScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { t, language } = useLanguage();

  return (
    <NavigationContainer key={language}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'alert';
            if (route.name === 'Today') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Calendar') iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'Lists') iconName = focused ? 'list' : 'list-outline';
            else if (route.name === 'Stats') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Today" component={HomeScreen} options={{ tabBarLabel: t.today }} />
        <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: t.calendar }} />
        <Tab.Screen name="Lists" component={ListsScreen} options={{ tabBarLabel: t.lists }} />
        <Tab.Screen name="Stats" component={StatsScreen} options={{ tabBarLabel: t.stats }} />
        <Tab.Screen name="Settings" component={SettingsStack} options={{ tabBarLabel: t.settings }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
