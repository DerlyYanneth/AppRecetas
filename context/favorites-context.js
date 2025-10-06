import React, { createContext, useState, useContext } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  const addFavorite = (recipe) => {
    setFavoriteRecipes((prev) => [...prev, recipe]);
  };

  const removeFavorite = (idMeal) => {
    setFavoriteRecipes((prev) =>
      prev.filter((recipe) => recipe.idMeal !== idMeal)
    );
  };

  const isFavorite = (idMeal) => {
    return favoriteRecipes.some((recipe) => recipe.idMeal === idMeal);
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteRecipes, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
