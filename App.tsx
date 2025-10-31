import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { UetdsProvider } from './src/contexts/UetdsContext';
import AuthScreen from './src/screens/auth/AuthScreen';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import { theme } from './src/styles/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <UetdsProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator initialRouteName="Auth">
                <Stack.Screen 
                  name="Auth" 
                  component={AuthScreen} 
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="Dashboard" 
                  component={DashboardScreen} 
                  options={{ headerShown: false }} 
                />
              </Stack.Navigator>
            </NavigationContainer>
          </UetdsProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}