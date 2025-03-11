// screens/Profile.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Button,
  ScrollView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import Checkbox from 'expo-checkbox';

const Profile = ({ route, navigation }) => {
  // Estados editables para perfil
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Estados para checkboxes de notificaciones por email (Paso 5)
  const [newsletter, setNewsletter] = useState(false);
  const [promotions, setPromotions] = useState(false);

  // Cargar datos del SecureStore
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedFirstName = await SecureStore.getItemAsync('firstName');
        const storedEmail = await SecureStore.getItemAsync('email');
        const storedLastName = await SecureStore.getItemAsync('lastName');
        const storedPhone = await SecureStore.getItemAsync('phone');
        const storedImage = await SecureStore.getItemAsync('profileImage');
        const storedNewsletter = await SecureStore.getItemAsync('newsletter');
        const storedPromotions = await SecureStore.getItemAsync('promotions');

        setFirstName(storedFirstName || '');
        setEmail(storedEmail || '');
        setLastName(storedLastName || '');
        setPhone(storedPhone || '');
        setImageUri(storedImage || null);
        setNewsletter(storedNewsletter === 'true');
        setPromotions(storedPromotions === 'true');
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    loadProfileData();
  }, []);

  // Validar el teléfono (asegurarse que tenga 10 dígitos)
  useEffect(() => {
    const digits = phone.replace(/\D/g, '');
    setIsPhoneValid(digits.length === 10);
  }, [phone]);

  // Función para seleccionar imagen de avatar
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitas permitir acceso a la galería.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImageUri(selectedUri);
    }
  };

  // Paso 6: Guardar cambios en SecureStore
  const handleSaveChanges = async () => {
    try {
      await SecureStore.setItemAsync('firstName', firstName.trim());
      await SecureStore.setItemAsync('email', email.trim());
      await SecureStore.setItemAsync('lastName', lastName.trim());
      await SecureStore.setItemAsync('phone', phone.trim());
      if (imageUri) {
        await SecureStore.setItemAsync('profileImage', imageUri);
      }
      await SecureStore.setItemAsync('newsletter', newsletter.toString());
      await SecureStore.setItemAsync('promotions', promotions.toString());
      Alert.alert('Success', 'Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      Alert.alert('Error', 'There was an error saving your changes.');
    }
  };

  // Paso 7: Logout (limpiar datos y volver a Onboarding)
  const handleLogout = async () => {
    try {
      // Borrar las claves usadas en el SecureStore
      await SecureStore.deleteItemAsync('isOnboardingCompleted');
      await SecureStore.deleteItemAsync('firstName');
      await SecureStore.deleteItemAsync('email');
      await SecureStore.deleteItemAsync('lastName');
      await SecureStore.deleteItemAsync('phone');
      await SecureStore.deleteItemAsync('profileImage');
      await SecureStore.deleteItemAsync('newsletter');
      await SecureStore.deleteItemAsync('promotions');
      // Actualizar el estado en App.js (si se pasó la función)
      if (route.params && route.params.setIsOnboardingCompleted) {
        route.params.setIsOnboardingCompleted(false);
      }
      // Reiniciar la navegación para mostrar Onboarding
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Could not log out.');
    }
  };

  // Generar iniciales de forma segura para el placeholder del avatar
  const initials = `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.initialsBackground]}>
            <Text style={styles.initials}>{initials || 'NA'}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Campos editables */}
      <Text style={styles.fieldLabel}>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.fieldLabel}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.fieldLabel}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.fieldLabel}>Phone</Text>
      <MaskedTextInput
        mask="(999) 999-9999"
        style={styles.input}
        placeholder="Phone (e.g. 1234567890)"
        value={phone}
        onChangeText={(text, rawText) => setPhone(rawText)}
        keyboardType="phone-pad"
      />
      {!isPhoneValid && phone.length > 0 && (
        <Text style={styles.errorText}>Invalid phone number</Text>
      )}

      {/* Paso 5: Checkboxes para notificaciones por email */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={newsletter}
          onValueChange={setNewsletter}
          color={newsletter ? '#4630EB' : undefined}
        />
        <Text style={styles.checkboxLabel}>Receive Newsletter</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={promotions}
          onValueChange={setPromotions}
          color={promotions ? '#4630EB' : undefined}
        />
        <Text style={styles.checkboxLabel}>Receive Promotional Emails</Text>
      </View>

      {/* Botón para guardar cambios (Paso 6) */}
      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={handleSaveChanges} />
      </View>

      {/* Botón para Logout (Paso 7) */}
      <View style={styles.buttonContainer}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  initialsBackground: {
    backgroundColor: '#d0d4dc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  fieldLabel: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginVertical: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
});

export default Profile;
