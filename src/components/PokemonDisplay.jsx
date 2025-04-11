import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const PokemonDisplay = ({ pokemonData }) => {
  return (
    <div className="item-list">
      {pokemonData.length > 0 ? (
        pokemonData.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))
      ) : (
        <p className="no-results">No Pokemon found matching your criteria.</p>
      )}
    </div>
  );
};

// Card component merged into PokemonDisplay file
const PokemonCard = ({ pokemon }) => {
  // Get the primary type for card background
  const primaryType = pokemon.types[0].type.name;

  return (
    <Link to={`/pokemon/${pokemon.id}`} className="card-link">
      <div className="card" data-type={primaryType}>
        <div className="card-image">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
        <div className="card-content">
          <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
          
          <div className="type-badges">
            {pokemon.types.map(typeInfo => (
              <span 
                key={typeInfo.type.name}
                className={`type-badge ${typeInfo.type.name}`}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
          
          <div className="card-details">
            <p>Height: {pokemon.height / 10}m</p>
            <p>Weight: {pokemon.weight / 10}kg</p>
            <p>Base Experience: {pokemon.base_experience || 'N/A'}</p>
            <p>Abilities: {pokemon.abilities.map(ability => 
              ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)
            ).join(', ')}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PokemonDisplay;