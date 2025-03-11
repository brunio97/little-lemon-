import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import logo from '../assets/Logo.png';

const Onboarding = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Validar el nombre
  const validateName = (text) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const isValid = nameRegex.test(text) && text.trim() !== '';
    setIsNameValid(isValid);
    setName(text);
  };

  // Validar el correo electrónico
  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(text);
    setIsEmailValid(isValid);
    setEmail(text);
  };

  const handleComplete = async () => {
    try {
      // Guardar bandera de onboarding completado
      await SecureStore.setItemAsync('isOnboardingCompleted', 'true');
      // Guardar los datos para transferirlos automáticamente
      await SecureStore.setItemAsync('firstName', name.trim());
      await SecureStore.setItemAsync('email', email.trim());
      // Actualizar estado en App.js
      route.params?.setIsOnboardingCompleted(true);
      // Navegar a Profile
      navigation.navigate('Profile');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el estado');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logotipo (10% del espacio) */}
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      {/* Contenido principal (80% del espacio) */}
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Let us get to know you</Text>
        <Text style={styles.labelText}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={validateName}
        />
        <Text style={styles.labelText}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={validateEmail}
        />
      </View>

      {/* Botón (10% del espacio) */}
      <View style={styles.buttonContainer}>
        <Button
          title="Siguiente"
          onPress={handleComplete}
          disabled={!isNameValid || !isEmailValid}
        />
      </View>
    </View>
  );
};

// Estilos (se mantienen igual)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f4f4',
  },
  logo: {
    height: 50,
  },
  contentContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#d0d4dc',
  },
  headerText: {
    flex: 0.4,
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  labelText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f8f4f4',
  },
});

export default Onboarding;
