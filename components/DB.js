import * as SQLite from 'expo-sqlite';

// Función para abrir la base de datos de forma asíncrona
const openDB = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('little_lemon');
    console.log("Database opened successfully.");
    return db;
  } catch (error) {
    console.error("Error opening database:", error);
  }
};

// Función para crear la tabla si no existe
export async function createTable() {
  const db = await openDB();
  if (!db) return;
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );
    `);
    console.log("Table created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

// Llamar a la función para inicializar la base de datos
createTable();

export { openDB };
