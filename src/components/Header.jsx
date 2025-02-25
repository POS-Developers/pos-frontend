import React from "react";
import "../style.css/Header.css";
import PropTypes from "prop-types"; // Import prop-types for validation


const Header = ({ order, viewOrder }) => {
  return (
    <div className="header">
      <h1>Restaurant POS</h1>
      {Object.keys(order).map(
        (tableId) =>
          order[tableId].length > 0 && (
            <button
              key={tableId}
              className="table-button"
              onClick={() => viewOrder(tableId)}
              aria-label={`View order for Table ${tableId}`}
            >
              Table {tableId} 🛒
            </button>
          )
      )}
    </div>
  );
};

Header.propTypes = {
  order: PropTypes.object.isRequired,
  viewOrder: PropTypes.func.isRequired,
};

export default Header;


// const Header = ({ order, viewOrder, selectedTable }) => {
//   return (
//     <div className="header">
//       <h1>Restaurant POS</h1>
//       {Object.keys(order).map(
//         (tableId) =>
//           order[tableId].length > 0 && (
//             <button
//               key={tableId}
//               className={`table-button ${selectedTable === tableId ? "selected" : ""}`}
//               onClick={() => viewOrder(tableId)}
//               aria-label={`View order for Table ${tableId}`}
//             >
//               Table {tableId} 🛒
//             </button>
//           )
//       )}
//     </div>
//   );
// };

// Header.propTypes = {
//   order: PropTypes.object.isRequired,
//   viewOrder: PropTypes.func.isRequired,
//   selectedTable: PropTypes.string, // Track selected table
// };

// export default Header;
