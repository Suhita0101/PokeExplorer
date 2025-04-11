import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PokemonSearch from './PokemonSearch';
import '../styles/components.css';
import '../styles/detail.css';

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        setLoading(true);
        
        // Fetch Pokemon details
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        
        // Fetch types for sidebar
        const typesResponse = await fetch('https://pokeapi.co/api/v2/type');
        const typesData = await typesResponse.json();
        
        setAvailableTypes(typesData.results.map(type => type.name).sort());
        setPokemon(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch Pokemon data. Please try again later.');
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };
    
    fetchPokemonDetail();
  }, [id]);

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

  if (!pokemon) return null;

  const primaryType = pokemon.types[0].type.name;

  return (
    <div className="dashboard">
      <div className="detail-container">
        <div className="sidebar">
          <Link to="/" className="back-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </Link>
          
          <PokemonSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
            selectedType={selectedType} 
            onTypeChange={setSelectedType}
            availableTypes={availableTypes}
          />
        </div>
        
        <div className="detail-content">
          <div className="pokemon-detail-card" data-type={primaryType}>
            <div className="detail-header">
              <div className="detail-image-container">
                <img src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
                  alt={pokemon.name} className="detail-image" />
              </div>
              
              <div className="detail-title-container">
                <h1 className="detail-title">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
                <p className="detail-id">#{pokemon.id.toString().padStart(3, '0')}</p>
                
                <div className="type-badges detail-types">
                  {pokemon.types.map(typeInfo => (
                    <span 
                      key={typeInfo.type.name}
                      className={`type-badge ${typeInfo.type.name}`}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h2 className="section-title">Base Stats</h2>
              <div className="stats-bars">
                {pokemon.stats.map(stat => (
                  <div key={stat.stat.name} className="stat-row">
                    <div className="stat-name">{formatStatName(stat.stat.name)}</div>
                    <div className="stat-value-numeric">{stat.base_stat}</div>
                    <div className="stat-bar-container">
                      <div 
                        className="stat-bar" 
                        style={{ 
                          width: `${Math.min(100, (stat.base_stat / 150) * 100)}%`,
                          backgroundColor: getStatColor(stat.stat.name)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="detail-section">
              <h2 className="section-title">Physical Characteristics</h2>
              <div className="detail-physical-grid">
                <div className="physical-item">
                  <h3>Height</h3>
                  <p>{(pokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div className="physical-item">
                  <h3>Weight</h3>
                  <p>{(pokemon.weight / 10).toFixed(1)} kg</p>
                </div>
                <div className="physical-item">
                  <h3>Base Experience</h3>
                  <p>{pokemon.base_experience || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="detail-section">
              <h2 className="section-title">Abilities</h2>
              <div className="abilities-list">
                {pokemon.abilities.map(abilityInfo => (
                  <div key={abilityInfo.ability.name} className="ability-item">
                    <h3>{formatAbilityName(abilityInfo.ability.name)}</h3>
                    {abilityInfo.is_hidden && <span className="hidden-badge">Hidden</span>}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="detail-section">
              <h2 className="section-title">Move Pool</h2>
              <div className="moves-list">
                {pokemon.moves.slice(0, 15).map(moveInfo => (
                  <div key={moveInfo.move.name} className="move-badge">
                    {formatMoveName(moveInfo.move.name)}
                  </div>
                ))}
                {pokemon.moves.length > 15 && (
                  <div className="move-badge more-moves">
                    +{pokemon.moves.length - 15} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for formatting
function formatStatName(statName) {
  switch (statName) {
    case 'hp': return 'HP';
    case 'attack': return 'Attack';
    case 'defense': return 'Defense';
    case 'special-attack': return 'Sp. Atk';
    case 'special-defense': return 'Sp. Def';
    case 'speed': return 'Speed';
    default: return statName.charAt(0).toUpperCase() + statName.slice(1);
  }
}

function getStatColor(statName) {
  switch (statName) {
    case 'hp': return '#ff5959';
    case 'attack': return '#f5ac78';
    case 'defense': return '#fae078';
    case 'special-attack': return '#9db7f5';
    case 'special-defense': return '#a7db8d';
    case 'speed': return '#fa92b2';
    default: return '#a8a878';
  }
}

function formatAbilityName(name) {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatMoveName(name) {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export default PokemonDetail;