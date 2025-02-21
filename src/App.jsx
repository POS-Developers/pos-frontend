import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import SearchFilter from "./components/SearchFilter";
import DropdownSection from "./components/DropdownSection";
import Menu from "./components/Menu";
import OrderSummary from "./components/OrderSummary";
import AddDish from "./components/AddDish";
import "./App.css";

const App = () => {
  const [dishes, setDishes] = useState([]);
  const [order, setOrder] = useState(() => JSON.parse(localStorage.getItem("orders")) || {});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [tables, setTables] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [activeTable, setActiveTable] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (search) params.Dish_Name = search;
        if (filter) params.Dish_Type = filter;

        const [dishesResponse, tablesResponse, employeesResponse] = await Promise.all([
          axios.get(`${env.VITE_API_URL}/Home/Dishes-list/`, { params }),
          axios.get(`${env.VITE_API_URL}/Home/Tables/`),
          axios.get(`${env.VITE_API_URL}/Home/Employe-list/`),
        ]);
        
        setDishes(dishesResponse.data);
        setTables(tablesResponse.data);
        setEmployees(employeesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search, filter]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(order));
  }, [order]);

  const modifyOrder = (id, quantityChange) => {
    if (!activeTable) return;
    setOrder((prevOrder) => {
      const tableOrder = prevOrder[activeTable] || [];
      const updatedTableOrder = tableOrder.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + quantityChange) } : item
      );
      return { ...prevOrder, [activeTable]: updatedTableOrder };
    });
  };

  const calculateTotal = () => {
    return (order[activeTable] || []).reduce((total, item) => total + item.Dish_Price * item.quantity, 0).toFixed(2);
  };

  const sendOrder = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee before placing the order.");
      return;
    }
    const formattedOrder = {
      employee: selectedEmployee,
      table: activeTable || null,
      total_amount: calculateTotal(),
      dishes: (order[activeTable] || []).map((item) => ({ dish: item.id, quantity: item.quantity })),
    };
    try {
      const response = await axios.post(`${process.env.VITE_API_URL}/Home/Bill-list/`, formattedOrder);
      alert("Order placed successfully! Bill Number: " + response.data.bill_number);
      setOrder((prev) => ({ ...prev, [activeTable]: [] }));
      localStorage.setItem("orders", JSON.stringify({ ...order, [activeTable]: [] }));
      setSelectedTable("");
      setSelectedEmployee("");
      setActiveTable("");
    } catch (err) {
      console.error("Error placing order:", err.response?.data || err.message);
      alert("Failed to place order.");
    }
  };

  return (
    <Router>
      <div className="pos-container">
        <nav>
          <Link to="/" className="home-link">
            <FaHome className="home-icon" /> Home
          </Link>
        </nav>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header order={order} viewOrder={setActiveTable} />
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
                <Menu dishes={dishes} addToOrder={(dish) => modifyOrder(dish.id, 1)} />
                <OrderSummary
                  activeTable={activeTable}
                  selectedEmployee={selectedEmployee}
                  currentTableOrder={order[activeTable] || []}
                  calculateTotal={calculateTotal}
                  removeFromOrder={(id) => modifyOrder(id, -1)}
                  sendOrder={sendOrder}
                  increaseQuantity={(id) => modifyOrder(id, 1)}
                  decreaseQuantity={(id) => modifyOrder(id, -1)}
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