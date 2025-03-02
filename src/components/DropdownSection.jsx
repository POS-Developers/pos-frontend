import React from "react";
import "../style.css/DropdownSection.css";



const DropdownSection = ({ tables, selectedTable, setSelectedTable, setActiveTable, employees, selectedEmployee, setSelectedEmployee, order }) => {
  
  const handleTableChange = (e) => {
    const tableId = e.target.value;
    setSelectedTable(tableId);
    setActiveTable(tableId); // ✅ Update activeTable for Order Summary
  };

  return (
    <div className="dropdown-section">
      <label>Select Table:</label>
      <select value={selectedTable} onChange={handleTableChange}>
        <option value="">Select Table</option>
        {tables.map((table) => (
          <option key={table.id} value={table.id} disabled={order[table.id]?.length > 0}>
            Table {table.Table_Number} {order[table.id]?.length > 0 && "(Occupied)"}
          </option>
        ))}
      </select>

      <label>Select Employee:</label>
      <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
        <option value="">Select Employee</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.Employe_Name} ({employee.Employe_Position})
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSection;
