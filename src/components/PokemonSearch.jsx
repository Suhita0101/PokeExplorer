import React from 'react';
import '../styles/components.css';

const PokemonSearch = ({ searchTerm, onSearchChange, selectedType, onTypeChange, availableTypes }) => {
  return (
    <div className="controls">
      {/* Search component */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Pokemon by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {/* Filter component */}
      <div className="filter">
        <label htmlFor="type-filter">Filter by Type:</label>
        <select 
          id="type-filter" 
          value={selectedType} 
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">All Types</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PokemonSearch;