import React, { useState, useEffect } from 'react';
import PokemonSearch from './PokemonSearch';
import PokemonStats from './PokemonStats';
import PokemonCharts from './PokemonCharts';
import PokemonDisplay from './PokemonDisplay';
import '../styles/layout.css';

const Dashboard = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [availableTypes, setAvailableTypes] = useState([]);
  
  // Fetch initial Pokemon data
  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        setLoading(true);
        
        // Fetch list of first 30 Pokemon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=30');
        const data = await response.json();
        
        // Fetch details for each Pokemon
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            return await detailResponse.json();
          })
        );
        
        // Extract all types
        const types = new Set();
        pokemonDetails.forEach(pokemon => {
          pokemon.types.forEach(typeInfo => {
            types.add(typeInfo.type.name);
          });
        });
        
        setAvailableTypes(Array.from(types).sort());
        setPokemonData(pokemonDetails);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch Pokemon data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };
    
    fetchPokemonData();
  }, []);
  
  // Filter Pokemon based on search term and selected type
  const filteredPokemon = pokemonData.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || 
      pokemon.types.some(typeInfo => typeInfo.type.name === selectedType);
    
    return matchesSearch && matchesType;
  });

  if (loading) return (
    <div className="loading-container">
      <div className="pokeball-loading">
        <div className="pokeball">
          <div className="pokeball-button"></div>
        </div>
        <p className="loading">Loading Pokemon data</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="error">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      {error}
    </div>
  );

  return (
    <div className="dashboard">
      <PokemonSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        selectedType={selectedType} 
        onTypeChange={setSelectedType}
        availableTypes={availableTypes}
      />

      <PokemonStats pokemonData={filteredPokemon} />
      
      <PokemonCharts pokemonData={filteredPokemon} />
      
      <h2 className="results-heading">
        {filteredPokemon.length > 0 
          ? `Showing ${filteredPokemon.length} Pokémon`
          : 'No Pokémon found'
        }
      </h2>
      
      <PokemonDisplay pokemonData={filteredPokemon} />
    </div>
  );
};

export default Dashboard;