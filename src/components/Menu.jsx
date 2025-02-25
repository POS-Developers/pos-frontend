import React from "react";
import { useNavigate } from "react-router-dom";
import "../style.css/Menu.css";


// const Menu = ({ dishes, addToOrder }) => {
//   const navigate = useNavigate();
//   return (
//     <div className="menu-section">
//       <h1 className="title">Menu</h1>
//       <button className="add-dish-btn" onClick={() => window.open("/add-dish", "_blank")}>
//          Add Dish
//       </button>

      
      
//       <div className="dish-grid">
//         {dishes.map((dish) => (
//           <div key={dish.id} className="dish-card" onClick={() => addToOrder(dish)}>
//             <img className="dish-image" src={dish.Dish_Image} alt={dish.Dish_Name} />
//             <h2>{dish.Dish_Name}</h2>
//             <p><strong>Price:</strong> ₹{dish.Dish_Price.toFixed(2)}</p>
//           </div>
//         ))}
//       </div>
      
//     </div>
//   );
// };

// export default Menu;
const Menu = ({ dishes, addToOrder }) => {
  const navigate = useNavigate();
  return (
    <div className="menu-section">
      <h1 className="title">Menu</h1>
      <button className="add-dish-btn" onClick={() => window.open("/add-dish", "_blank")}>
         Add Dish
      </button>

      <div className="dish-grid">
        {dishes.map((dish) => (
          <div key={dish.id} className="dish-card">
          <img className="dish-image" src={dish.Dish_Image} alt={dish.Dish_Name} />
          <h2>{dish.Dish_Name}</h2>
          <p><strong>Price:</strong> ₹{dish.Dish_Price.toFixed(2)}</p>
          <button onClick={() => addToOrder(dish)}>Add to Order</button>
    </div>
  ))}
</div>

    </div>
  );
};

export default Menu;