import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/857/857681.png" }}
        style={styles.logo}
      />
      <Text style={styles.title}>¡Bienvenido a la App de Recetas! 🍲</Text>
      <Text style={styles.subtitle}>
        Explora categorías, recetas, guarda tus favoritos y aprende a cocinar con videos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
  },
});
