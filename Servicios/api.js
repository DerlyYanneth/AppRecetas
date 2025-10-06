const API_URL = "https://www.themealdb.com/api/json/v1/1/";

export const getCategories = async () => {
  const res = await fetch(`${API_URL}categories.php`);
  return res.json();
};

export const getRecipesByCategory = async (category) => {
  const res = await fetch(`${API_URL}filter.php?c=${category}`);
  return res.json();
};

export const getRecipeDetail = async (idMeal) => {
  const res = await fetch(`${API_URL}lookup.php?i=${idMeal}`);
  return res.json();
};
