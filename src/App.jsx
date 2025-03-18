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
import ContactSupport from "./components/ContactSupport";
import FloatingButton from "./components/FloatingButton";
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

        setDishes(dishesResponse.data || []);
        setTables(tablesResponse.data || []);
        setEmployees(employeesResponse.data || []);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };
    fetchData();
  }, [search, filter]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(order));
  }, [order]);

  useEffect(() => {
    if (selectedTable && (!order[selectedTable] || order[selectedTable].length === 0)) {
      setSelectedTable("");
      setSelectedEmployee("");
      setActiveTable("");
    }
  }, [order]);

  const modifyOrder = useCallback((dish, action) => {
    if (!selectedTable) {
      alert("❌ Please select a table first.");
      return;
    }

    setOrder((prevOrder) => {
      const updatedOrder = { ...prevOrder };
      const tableOrder = updatedOrder[selectedTable] ? [...updatedOrder[selectedTable]] : [];
      const dishIndex = tableOrder.findIndex((item) => item.id === dish.id);

      if (action === "add") {
        dishIndex !== -1 ? (tableOrder[dishIndex].quantity += 1) : tableOrder.push({ ...dish, quantity: 1 });
      } else if (action === "increase" && dishIndex !== -1) {
        tableOrder[dishIndex].quantity += 1;
      } else if (action === "decrease" && dishIndex !== -1) {
        tableOrder[dishIndex].quantity -= 1;
        if (tableOrder[dishIndex].quantity === 0) tableOrder.splice(dishIndex, 1);
      }

      updatedOrder[selectedTable] = tableOrder.length ? tableOrder : undefined;
      return updatedOrder;
    });
  }, [selectedTable]);

  const calculateTotal = useCallback(() => {
    return order[selectedTable]?.reduce((total, item) => total + item.Dish_Price * item.quantity, 0) || 0;
  }, [order, selectedTable]);

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
      console.error("❌ Error sending order:", error);
      alert("❌ Failed to place order. Please try again.");
    }
  }, [selectedTable, selectedEmployee, order]);

  const handleViewOrder = (tableId) => {
    setActiveTable(tableId);
    setSelectedTable(tableId);
  };

  return (
    <Router>
      <div className="pos-container">
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
                <Menu dishes={dishes} addToOrder={(dish) => modifyOrder(dish, "add")} />
                <OrderSummary
                  selectedTable={activeTable || selectedTable}
                  selectedEmployee={selectedEmployee}
                  currentTableOrder={order[activeTable || selectedTable] || []}
                  calculateTotal={calculateTotal}
                  removeFromOrder={(dish) => modifyOrder(dish, "decrease")}
                  sendOrder={sendOrder}
                  increaseQuantity={(dish) => modifyOrder(dish, "increase")}
                  decreaseQuantity={(dish) => modifyOrder(dish, "decrease")}
                />
                <FloatingButton />
              </>
            }
          />
          <Route path="/add-dish" element={<AddDish />} />
          <Route path="/contact-support" element={<ContactSupport />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;