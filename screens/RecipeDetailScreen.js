import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons"; 
import { useFavorites } from "../context/favorites-context";

export default function RecipeDetailScreen({ route }) {
  const { idMeal } = route.params;
  const [meal, setMeal] = useState(null);

  const { favoriteRecipes, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
      .then((res) => res.json())
      .then((data) => setMeal(data.meals[0]))
      .catch((err) => console.error("Error cargando detalle:", err));
  }, [idMeal]);

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  // Saber si ya está en favoritos
  const isFavorite = favoriteRecipes.some((fav) => fav.idMeal === meal.idMeal);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(meal.idMeal);
    } else {
      addFavorite(meal);
    }
  };

  // Ingredientes
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        name: ingredient,
        measure: measure,
        image: `https://www.themealdb.com/images/ingredients/${ingredient}.png`,
      });
    }
  }

  // URL de embed de YouTube
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    return url.replace("watch?v=", "embed/");
  };

  const youtubeUrl = getYoutubeEmbedUrl(meal.strYoutube);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.info}>
          {/* Botón de favoritos */}
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={32}
              color={isFavorite ? "red" : "gray"}
            />
          </TouchableOpacity>

          <Text style={styles.title}>{meal.strMeal}</Text>

          <Text style={styles.subtitle}>Ingredientes:</Text>
          {ingredients.map((item, index) => (
            <View key={index} style={styles.ingredientRow}>
              <Image source={{ uri: item.image }} style={styles.ingredientImage} />
              <Text style={styles.ingredientText}>
                {item.name} - {item.measure}
              </Text>
            </View>
          ))}

          <Text style={styles.subtitle}>Instrucciones:</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>
        </View>
      </View>

      {/* Video Tutorial embebido */}
      {youtubeUrl && (
        <>
          <Text style={styles.sectionTitle}>Video Tutorial</Text>
          {Platform.OS === "web" ? (
            <div style={{ width: "100%", height: 300 }}>
              <iframe
                width="100%"
                height="100%"
                src={youtubeUrl}
                title="Video Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <View style={styles.videoContainer}>
              <WebView
                style={styles.video}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: youtubeUrl }}
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    elevation: 3,
    marginBottom: 15,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  favoriteButton: {
    alignSelf: "flex-end",
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ingredientImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 14,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "justify",
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 15,
  },
  videoContainer: {
    height: 300,
    marginBottom: 20,
  },
  video: {
    flex: 1,
  },
});
