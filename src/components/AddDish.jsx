import React, { useState } from "react";
import axios from "axios";
import "../style.css/AddDish.css";
import { useNavigate } from "react-router-dom";

const AddDish = () => {
  const [dishData, setDishData] = useState({
    Dish_Name: "",
    Dish_Quantity: "Full",
    Dish_Price: "",
    Dish_Food_Type: "Chicken",
    Dish_Type: "Main Course",
    Dish_Information: "",
    Dish_Image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDishData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setDishData((prev) => ({ ...prev, Dish_Image: e.target.files[0] }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!dishData.Dish_Image) {
      setError("Please upload a dish image.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.keys(dishData).forEach((key) => {
      formData.append(key, dishData[key]);
    });

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/Home/Dishes-list/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Dish added successfully!");
      setTimeout(() => navigate("/"), 1000); // Delay for better UX
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add dish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-dish-container">
      <h2>Add New Dish</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Dish_Name"
          placeholder="Dish Name"
          value={dishData.Dish_Name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="Dish_Price"
          placeholder="Price"
          value={dishData.Dish_Price}
          onChange={handleChange}
          required
        />
        <select name="Dish_Quantity" value={dishData.Dish_Quantity} onChange={handleChange}>
          <option value="Full">Full</option>
          <option value="Half">Half</option>
        </select>
        <select name="Dish_Food_Type" value={dishData.Dish_Food_Type} onChange={handleChange}>
          <option value="Chicken">Chicken</option>
          <option value="Mutton">Mutton</option>
          <option value="Veg">Veg</option>
        </select>
        <select name="Dish_Type" value={dishData.Dish_Type} onChange={handleChange}>
          <option value="Main Course">Main Course</option>
          <option value="Starter">Starter</option>
          <option value="Sweet">Sweet</option>
          <option value="Cold Drink">Cold Drink</option>
          <option value="Roti">Roti</option>
        </select>
        <textarea
          name="Dish_Information"
          placeholder="Dish Information"
          value={dishData.Dish_Information}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Dish"}
        </button>
      </form>
    </div>
  );
};

export default AddDish;
