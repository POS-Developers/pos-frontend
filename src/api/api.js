const API_URL = process.env.VITE_API_URL
;

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/products/`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
