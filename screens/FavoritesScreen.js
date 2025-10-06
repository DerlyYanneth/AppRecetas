import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useFavorites } from "../context/favorites-context";

export default function FavoritesScreen({ navigation }) {
  const { favoriteRecipes } = useFavorites();

  if (favoriteRecipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tienes recetas favoritas todavía ❤️</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favoriteRecipes}
      keyExtractor={(item) => item.idMeal}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("RecipeDetail", { idMeal: item.idMeal })}
        >
          <Image source={{ uri: item.strMealThumb }} style={styles.image} />
          <Text style={styles.title}>{item.strMeal}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "gray" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  title: { fontSize: 16, fontWeight: "bold" },
});
