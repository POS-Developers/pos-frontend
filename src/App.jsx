import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

import Header from "./components/Header";
import SearchFilter from "./components/SearchFilter";
import DropdownSection from "./components/DropdownSection";
import Menu from "./components/Menu";
import OrderSummary from "./components/OrderSummary";
import AddDish from "./components/AddDish";

import "./App.css";

const App = () => {
  const [dishes, setDishes] = useState([]);
  const [order, setOrder] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : {};
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [tables, setTables] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [activeTable, setActiveTable] = useState(""); // Track the active table being viewed

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const params = {};
        if (search) params.Dish_Name = search;
        if (filter) params.Dish_Type = filter;

        const [dishesResponse, tablesResponse, employeesResponse] = await Promise.all([
          axios.get(`${backendUrl}/Home/Dishes-list/`, { params: Object.keys(params).length ? params : null }),
          axios.get(`${backendUrl}/Home/Tables/`),
          axios.get(`${backendUrl}/Home/Employe-list/`)
        ]);

        setDishes(dishesResponse.data);
        setTables(tablesResponse.data);
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error.message || error);
      }
    };

    fetchData();
  }, [search, filter]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(order));
  }, [order]);


  // Reset selectedTable and selectedEmployee if the order is empty for that table
  useEffect(() => {
    if (selectedTable && (!order[selectedTable] || order[selectedTable].length === 0)) {
      setSelectedTable("");
      setSelectedEmployee("");
      setActiveTable("");
    }
  }, [order]);

  
  const addToOrder = useCallback((dish) => {
    if (!selectedTable) {
      alert("❌ Please select a table first.");
      return;
    }
  
    setOrder((prevOrder) => {
      // Create a new order object (immutability)
      const updatedOrder = { ...prevOrder };
  
      // Ensure the table has an array (new array to avoid mutating state)
      const tableOrder = updatedOrder[selectedTable] ? [...updatedOrder[selectedTable]] : [];
  
      // Find if the dish already exists in the table's order
      const existingItemIndex = tableOrder.findIndex((item) => item.id === dish.id);
      if (existingItemIndex !== -1) {
        // Update quantity immutably
        tableOrder[existingItemIndex] = { ...tableOrder[existingItemIndex], quantity: tableOrder[existingItemIndex].quantity + 1 };
      } else {
        // Add new dish
        tableOrder.push({ ...dish, quantity: 1 });
      }
  
      // Update the order state
      updatedOrder[selectedTable] = tableOrder;
  
      return updatedOrder;
    });
  }, [selectedTable]);
  

  // Increase the quantity of a dish in the selected table's order
  const increaseQuantity = useCallback((dishId) => {
    setOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
      if (updatedOrder[selectedTable]) {
        updatedOrder[selectedTable] = updatedOrder[selectedTable].map((item) =>
          item.id === dishId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return updatedOrder;
    });
  }, [selectedTable]);

  // Decrease the quantity of a dish in the selected table's order
  const decreaseQuantity = useCallback((dishId) => {
    setOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
      if (updatedOrder[selectedTable]) {
        updatedOrder[selectedTable] = updatedOrder[selectedTable]
          .map((item) => (item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => item.quantity > 0);

        if (updatedOrder[selectedTable].length === 0) {
          delete updatedOrder[selectedTable];
          setSelectedTable("");
          setSelectedEmployee("");
        }
      }
      return updatedOrder;
    });
  }, [selectedTable]);

  // Remove a dish from the selected table's order
  const removeFromOrder = useCallback((dishId) => {
    setOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
      if (updatedOrder[selectedTable]) {
        updatedOrder[selectedTable] = updatedOrder[selectedTable].filter((item) => item.id !== dishId);
        if (updatedOrder[selectedTable].length === 0) {
          delete updatedOrder[selectedTable];
          setSelectedTable("");
          setSelectedEmployee("");
        }
      }
      return updatedOrder;
    });
  }, [selectedTable]);

  // Calculate the total price for the selected table's order
  const calculateTotal = useCallback(() => {
    return order[selectedTable]?.reduce((total, item) => total + item.Dish_Price * item.quantity, 0) || 0;
  }, [order, selectedTable]);

  // Send the order to the backend
  const sendOrder = useCallback(async () => {
    if (!selectedTable || !selectedEmployee || !order[selectedTable]?.length) {
      alert("❌ Please select a table, employee, and add items to the order.");
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      await axios.post(`${backendUrl}/Home/Submit-Order/`, {
        table: selectedTable,
        employee: selectedEmployee,
        items: order[selectedTable]
      });

      alert("✅ Order placed successfully!");
      setOrder((prevOrder) => {
        const updatedOrder = { ...prevOrder };
        delete updatedOrder[selectedTable];
        return updatedOrder;
      });
    } catch (error) {
      console.error("❌ Error sending order:", error.message || error);
      alert("❌ Failed to place order. Please try again.");
    }
  }, [selectedTable, selectedEmployee, order]);

  // Function to set the active table when a table button is clicked in the Header
  const handleViewOrder = (tableId) => {
    setActiveTable(tableId);
    setSelectedTable(tableId); // Optionally, set the selected table as well
  };

  return (
    <Router>
      <div className="pos-container">
        <nav>
          <Link to="/" className="home-link">
            <FaHome className="home-icon" /> Home
          </Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header order={order} viewOrder={handleViewOrder} />
                <SearchFilter search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />
                <DropdownSection
                  tables={tables}
                  selectedTable={selectedTable}
                  setSelectedTable={setSelectedTable}
                  employees={employees}
                  selectedEmployee={selectedEmployee}
                  setSelectedEmployee={setSelectedEmployee}
                  order={order}
                />
                <Menu dishes={dishes} addToOrder={addToOrder} />
                <OrderSummary
                  selectedTable={activeTable || selectedTable} // Display orders for the active table
                  selectedEmployee={selectedEmployee}
                  currentTableOrder={order[activeTable || selectedTable] || []} // Use activeTable if set
                  calculateTotal={calculateTotal}
                  removeFromOrder={removeFromOrder}
                  sendOrder={sendOrder}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                />
              </>
            }
          />
          <Route path="/add-dish" element={<AddDish />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
