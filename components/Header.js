// components/Header.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Asegúrate de tener el logo y una imagen placeholder para el avatar en tu carpeta assets
const Header = () => {
  const navigation = useNavigation();

  const handleAvatarPress = () => {
    // Navega a la pantalla Profile
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.headerContainer}>
      {/* Logotipo a la izquierda */}
      <Image
        source={require('../assets/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Avatar a la derecha */}
      <TouchableOpacity onPress={handleAvatarPress}>
        <Image
          source={require('../assets/Profile.png')}
          style={styles.avatar}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 120,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Header;
