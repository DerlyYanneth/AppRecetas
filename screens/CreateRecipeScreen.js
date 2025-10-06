import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import firebaseConfig from "../Servicios/Firebase"; // ✅ tu configuración

// 🔹 Inicializar Firebase solo una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export default function CreateRecipeScreen({ navigation }) {
  const [titulo, setTitulo] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [imagen, setImagen] = useState("");

  // 🔹 Botón superior derecho "Ver recetas"
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Ver recetas"
          color="#4CAF50"
          onPress={() => navigation.navigate("UserRecipes")}
        />
      ),
    });
  }, [navigation]);

  const guardarReceta = async () => {
      // 💾 Guardar receta en Firestore Database
    try {
      if (!titulo || !ingredientes || !instrucciones || !imagen) {
        Alert.alert("Error", "Por favor completa todos los campos.");
        return;
      }

      await addDoc(collection(db, "recetas"), {
        titulo,
        ingredientes,
        instrucciones,
        imagen,
        fechaCreacion: new Date().toISOString(),
      });

      Alert.alert("✅ Éxito", "La receta fue guardada correctamente.");
      setTitulo("");
      setIngredientes("");
      setInstrucciones("");
      setImagen("");
      navigation.navigate("UserRecipes");
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", "No se pudo guardar la receta.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Crear Nueva Receta 🍳</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Ensalada César"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Ingredientes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Ej: Lechuga, pollo, aderezo..."
        multiline
        value={ingredientes}
        onChangeText={setIngredientes}
      />

      <Text style={styles.label}>Instrucciones</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Describe los pasos de la receta"
        multiline
        value={instrucciones}
        onChangeText={setInstrucciones}
      />

      <Text style={styles.label}>URL de la Imagen</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: https://misrecetas.com/ensalada.jpg"
        value={imagen}
        onChangeText={setImagen}
      />

      {imagen ? (
        <Image source={{ uri: imagen }} style={styles.preview} />
      ) : null}

      <View style={{ marginVertical: 15 }} />

      <Button title="Guardar Receta" onPress={guardarReceta} color="#4CAF50" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: "#fafafa",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
});
