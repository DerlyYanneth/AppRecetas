import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  push,
  remove,
} from "firebase/database";

// 🔹 Configuración de Firebase (la misma que tu ejemplo)
const firebaseConfig = {
  apiKey: "AIzaSyChtZauysI_JvAB3lxUhh2OHWPUOe1ZsbY",
  authDomain: "practica-aefa9.firebaseapp.com",
  databaseURL: "https://practica-aefa9-default-rtdb.firebaseio.com",
  projectId: "practica-aefa9",
  storageBucket: "practica-aefa9.firebasestorage.app",
  messagingSenderId: "137770492743",
  appId: "1:137770492743:web:bd507c84b55e823378a262",
  measurementId: "G-1DDT4FR7BE",
};

// 🔹 Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function CreateRecipeScreen() {
  const [titulo, setTitulo] = useState("");
  const [imagen, setImagen] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [recetas, setRecetas] = useState([]);

  useEffect(() => {
    // Referencia a la colección 'recetas'
    const recetasRef = ref(database, "recetas");

    // Escuchar los cambios en tiempo real
    const unsubscribe = onValue(recetasRef, (snapshot) => {
      const data = snapshot.val() || {};
      const lista = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setRecetas(lista);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Agregar receta a Firebase
  const agregarReceta = () => {
    if (!titulo || !imagen || !ingredientes || !instrucciones) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    const recetasRef = ref(database, "recetas");

    push(recetasRef, {
      titulo,
      imagen,
      ingredientes,
      instrucciones,
      fechaCreacion: new Date().toISOString(),
    });

    Alert.alert("Éxito", "Receta agregada correctamente");

    setTitulo("");
    setImagen("");
    setIngredientes("");
    setInstrucciones("");
  };

  // 🔹 Eliminar receta
  const eliminarReceta = (id) => {
    const recetaRef = ref(database, `recetas/${id}`);
    remove(recetaRef);
  };

  // 🔹 Renderizar receta individual
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imagen ? (
        <Image source={{ uri: item.imagen }} style={styles.imagen} />
      ) : null}
      <Text style={styles.cardTitulo}>{item.titulo}</Text>
      <Text style={styles.cardTexto}>
        <Text style={styles.negrita}>Ingredientes:</Text> {item.ingredientes}
      </Text>
      <Text style={styles.cardTexto}>
        <Text style={styles.negrita}>Instrucciones:</Text> {item.instrucciones}
      </Text>
      <Button
        title="Eliminar"
        onPress={() => eliminarReceta(item.id)}
        color="#F44336"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Crear Nueva Receta</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={styles.input}
        placeholder="URL de la Imagen"
        value={imagen}
        onChangeText={setImagen}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ingredientes (separados por comas)"
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Instrucciones"
        value={instrucciones}
        onChangeText={setInstrucciones}
        multiline
      />

      <Button title="Agregar Receta" onPress={agregarReceta} color="#4CAF50" />

      <Text style={styles.subtitulo}>Lista de Recetas</Text>

      <FlatList
        data={recetas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 3,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardTexto: {
    fontSize: 14,
    marginBottom: 5,
  },
  negrita: {
    fontWeight: "bold",
  },
  imagen: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
});
