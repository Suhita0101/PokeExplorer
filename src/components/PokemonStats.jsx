import React from 'react';
import '../styles/layout.css';

const PokemonStats = ({ pokemonData }) => {
  // Calculate statistics
  const totalPokemon = pokemonData.length;
  
  // Average weight calculation
  const averageWeight = pokemonData.length 
    ? (pokemonData.reduce((sum, pokemon) => sum + pokemon.weight, 0) / pokemonData.length / 10).toFixed(1)
    : 0;
  
  // Type distribution
  const typeCount = {};
  pokemonData.forEach(pokemon => {
    pokemon.types.forEach(typeInfo => {
      const typeName = typeInfo.type.name;
      typeCount[typeName] = (typeCount[typeName] || 0) + 1;
    });
  });
  
  // Find most common type
  let mostCommonType = '';
  let maxCount = 0;
  
  Object.entries(typeCount).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonType = type;
    }
  });
  
  // Calculate average base experience
  const averageBaseExp = pokemonData.length 
    ? Math.round(pokemonData.reduce((sum, pokemon) => sum + (pokemon.base_experience || 0), 0) / pokemonData.length)
    : 0;

  return (
    <div className="stats">
      <h2>Pokémon Insights</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Collection Size</h3>
          <p className="stat-value">{totalPokemon}</p>
        </div>
        <div className="stat-card">
          <h3>Average Weight</h3>
          <p className="stat-value">{averageWeight} kg</p>
        </div>
        <div className="stat-card">
          <h3>Most Common Type</h3>
          <p className="stat-value">
            {mostCommonType ? mostCommonType.charAt(0).toUpperCase() + mostCommonType.slice(1) : 'N/A'}
          </p>
        </div>
        <div className="stat-card">
          <h3>Avg Base Experience</h3>
          <p className="stat-value">{averageBaseExp}</p>
        </div>
      </div>
    </div>
  );
};

export default PokemonStats;