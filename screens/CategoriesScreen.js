import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  // 📌 Calculamos el ancho dinámico (3 columnas)
  const numColumns = 3;
  const { width } = Dimensions.get("window");
  const cardSize = width / numColumns - 15; // 👈 espacio entre cards

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.idCategory}
        numColumns={numColumns}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardSize, height: cardSize + 40 }]}
            onPress={() => navigation.navigate("Recipes", { category: item.strCategory })}
          >
            <Image source={{ uri: item.strCategoryThumb }} style={styles.image} />
            <Text style={styles.text}>{item.strCategory}</Text>
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
