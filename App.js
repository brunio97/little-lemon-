// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store'; // Cambio aquí
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import SplashScreen from './screens/SplashScreen';
import Home from './screens/Home';  // Añadir esta línea

const Stack = createNativeStackNavigator();

export default function App() { 
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  // Leer desde SecureStore
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await SecureStore.getItemAsync('isOnboardingCompleted');
        setIsOnboardingCompleted(value === 'true');
      } catch (error) {
        console.error('Error reading SecureStore:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkOnboarding();
  }, []); 

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isOnboardingCompleted ? 'Home' : 'Onboarding'}
      >
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
          initialParams={{ setIsOnboardingCompleted }}
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
