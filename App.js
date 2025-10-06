import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";


// Screens
import HomeScreen from "./screens/HomeScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import RecipesScreen from "./screens/RecipesScreen";
import RecipeDetailScreen from "./screens/RecipeDetailScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import CreateRecipeScreen from "./screens/CreateRecipeScreen";
import Recipes from "./screens/Recipes";

// Provider
import { FavoritesProvider } from "./context/favorites-context";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 🔹 Tabs principales
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Categories") {
            iconName = "list";
          } else if (route.name === "CreateRecipe") {
            return <Text style={{ fontSize: 22 }}>🍳</Text>;
          } else if (route.name === "Favorites") {
            iconName = "heart";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Inicio" }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: "Categorías" }}
      />
      <Tab.Screen
        name="CreateRecipe"
        component={CreateRecipeScreen}
        options={{ title: "Crear" }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: "Favoritos" }}
      />
    </Tab.Navigator>
  );
}

// 🔹 App principal
export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* Tabs principales */}
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          {/* Detalle de receta */}
          <Stack.Screen
            name="RecipeDetail"
            component={RecipeDetailScreen}
            options={{ title: "Detalle de la receta" }}
          />
          {/* Recipes dentro de categorías */}
          <Stack.Screen
            name="Recipes"
            component={RecipesScreen}
            options={{ title: "Recetas" }}
          />
          <Stack.Screen
            name="UserRecipes"
            component={Recipes}
            options={{ title: "Mis Recetas" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
