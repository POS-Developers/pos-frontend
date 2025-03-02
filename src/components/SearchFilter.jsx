import React from "react";
import "../style.css/SearchFilter.css";

const SearchFilter = ({ search, setSearch, filter, setFilter }) => {
  return (
    <div className="search-filter">
      <input type="text" placeholder="Search Dishes..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="Starter">Starter</option>
        <option value="Cold Drink">Cold Drink</option>
        <option value="Main Course">Main Course</option>
        <option value="Sweet">Sweet</option>
        <option value="Roti">Roti</option>
      </select>
    </div>
  );
};

export default SearchFilter;