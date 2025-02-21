
import React from "react";
import "../style.css/OrderSummary.css";

const OrderSummary = ({ activeTable, selectedEmployee, currentTableOrder, calculateTotal, removeFromOrder, sendOrder, increaseQuantity, decreaseQuantity }) => {
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>
      <p><strong>Table:</strong> {activeTable ? `Table ${activeTable}` : "Not Selected"}</p>
      <p><strong>Employee:</strong> {selectedEmployee || "Not Selected"}</p>
      {currentTableOrder.length === 0 ? (
        <p>No items in the order.</p>
      ) : (
        <ul>
          {currentTableOrder.map((item) => (
            <li key={item.id} className="order-item">
              <span>{item.Dish_Name} (x{item.quantity}) - ₹{(item.Dish_Price * item.quantity).toFixed(2)}</span>
              <div className="order-controls">
              <button className="quantity-btn decrease" onClick={() => decreaseQuantity(item.id)}>-</button>
              <span className="quantity-display">{item.quantity}</span>
              <button className="quantity-btn increase" onClick={() => increaseQuantity(item.id)}>+</button>
              <button className="remove-btn" onClick={() => removeFromOrder(item.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ₹{calculateTotal()}</h3>
      <button className="send-order" onClick={sendOrder}>Send Order</button>
    </div>
  );
  
};

export default OrderSummary;