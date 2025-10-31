import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from 'react-native-paper';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import SeferlerScreen from '../screens/seferler/SeferlerScreen';
import YolcularScreen from '../screens/yolcular/YolcularScreen';
import PersonellerScreen from '../screens/personeller/PersonellerScreen';
import AraclarScreen from '../screens/araclar/AraclarScreen';
import GruplarScreen from '../screens/gruplar/GruplarScreen';
import RaporlarScreen from '../screens/raporlar/RaporlarScreen';
import AyarlarScreen from '../screens/ayarlar/AyarlarScreen';
import ProfilScreen from '../screens/profil/ProfilScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Seferler':
              iconName = 'bus';
              break;
            case 'Yolcular':
              iconName = 'people';
              break;
            case 'Personeller':
              iconName = 'account-group';
              break;
            case 'Araclar':
              iconName = 'car';
              break;
            case 'Gruplar':
              iconName = 'group-work';
              break;
            case 'Raporlar':
              iconName = 'bar-chart';
              break;
            case 'Ayarlar':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Ana Sayfa' }}
      />
      <Tab.Screen
        name="Seferler"
        component={SeferlerScreen}
        options={{ title: 'Seferler' }}
      />
      <Tab.Screen
        name="Yolcular"
        component={YolcularScreen}
        options={{ title: 'Yolcular' }}
      />
      <Tab.Screen
        name="Personeller"
        component={PersonellerScreen}
        options={{ title: 'Personeller' }}
      />
      <Tab.Screen
        name="Araclar"
        component={AraclarScreen}
        options={{ title: 'Araçlar' }}
      />
      <Tab.Screen
        name="Gruplar"
        component={GruplarScreen}
        options={{ title: 'Gruplar' }}
      />
      <Tab.Screen
        name="Raporlar"
        component={RaporlarScreen}
        options={{ title: 'Raporlar' }}
      />
      <Tab.Screen
        name="Ayarlar"
        component={AyarlarScreen}
        options={{ title: 'Ayarlar' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profil"
        component={ProfilScreen}
        options={{ title: 'Profil' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;