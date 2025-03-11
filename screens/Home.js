// screens/Home.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import Header from '../components/Header';
import { openDB, createMenuTable, insertMenuItems, getMenuItems } from '../components/DB';
export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Función para obtener y transformar los datos del menú
  async function fetchMenuData() {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
      );
      if (!response.ok) {
        throw new Error('Error al obtener los datos del servidor');
      }
      const data = await response.json();
      // Transformamos la data agregando una propiedad "id" única para cada item
      const transformedData = data.menu.map((item, index) => ({ 
        id: index.toString(),
        ...item,
      }));
      setMenuItems(transformedData);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Renderiza cada item del menú
  const renderItem = ({ item }) => {
    // Construimos la URL de la imagen usando la propiedad "image"
    const imageUrl = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;

    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: imageUrl }} style={styles.itemImage} />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
    );
  };

  // Indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando menú...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con logo y avatar */}
      <Header />

      {/* Título de la pantalla */}
      <Text style={styles.headerTitle}>Little Lemon Menu</Text>

      {/* Listado del menú usando FlatList */}
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
  },
});
