import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

export default function RecipesScreen({ route, navigation }) {
  const { category } = route.params;
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((res) => res.json())
      .then((data) => setRecipes(data.meals || []))
      .catch((err) => console.error("Error cargando recetas:", err));
  }, [category]);

  const numColumns = 3;
  const { width } = Dimensions.get("window");
  const cardSize = width / numColumns - 15; 

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardSize, height: cardSize + 40 }]}
            onPress={() => navigation.navigate("RecipeDetail", { idMeal: item.idMeal })}
          >
            <Image source={{ uri: item.strMealThumb }} style={styles.image} />
            <Text style={styles.text}>{item.strMeal}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "75%", 
    resizeMode: "cover",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
});
