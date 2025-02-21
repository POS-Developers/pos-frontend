import React from "react";
import "../style.css/Header.css";


const Header = ({ order, viewOrder }) => {
  return (
    <div className="header">
      <h1>Restaurant POS</h1>
      {Object.keys(order).map(
        (tableId) =>
          order[tableId].length > 0 && (
            <button key={tableId} className="table-button" onClick={() => viewOrder(tableId)}>
              Table {tableId} 🛒
            </button>
          )
      )}
    </div>
  );
};

export default Header;