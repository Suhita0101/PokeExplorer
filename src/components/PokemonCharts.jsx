import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         PieChart, Pie, Cell } from 'recharts';
import '../styles/charts.css';

const PokemonCharts = ({ pokemonData }) => {
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [statAverages, setStatAverages] = useState([]);
  
  useEffect(() => {
    if (pokemonData.length === 0) return;
    
    // Calculate type distribution
    const typeCount = {};
    pokemonData.forEach(pokemon => {
      pokemon.types.forEach(typeInfo => {
        const typeName = typeInfo.type.name;
        typeCount[typeName] = (typeCount[typeName] || 0) + 1;
      });
    });
    
    const typeData = Object.entries(typeCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    })).sort((a, b) => b.value - a.value);
    
    setTypeDistribution(typeData);
    
    // Calculate stat averages
    const stats = {
      hp: 0,
      attack: 0,
      defense: 0,
      'special-attack': 0,
      'special-defense': 0,
      speed: 0
    };
    
    pokemonData.forEach(pokemon => {
      pokemon.stats.forEach(stat => {
        stats[stat.stat.name] += stat.base_stat;
      });
    });
    
    const statData = Object.entries(stats).map(([name, total]) => ({
      name: formatStatName(name),
      value: Math.round(total / pokemonData.length)
    }));
    
    setStatAverages(statData);
    
  }, [pokemonData]);
  
  // Colors for the pie chart
  const COLORS = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#AB83A1',
    '#F9C80E', '#F86624', '#EA3546', '#662E9B', '#43BCCD',
    '#5FAD56', '#4D9DE0', '#E15FED', '#3F5E5A', '#6B2D5C'
  ];

  return (
    <div className="charts-container">
      <h2 className="charts-heading">Data Visualizations</h2>
      
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Type Distribution</h3>
          <div className="chart-description">
            Visualizes the distribution of Pokémon types in the current selection.
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Pokémon`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="chart-card">
          <h3 className="chart-title">Average Base Stats</h3>
          <div className="chart-description">
            Compares the average values of each base stat across all selected Pokémon.
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={statAverages}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'Average Value']} />
                <Bar dataKey="value" fill="#8B5CF6" barSize={35} radius={[5, 5, 0, 0]}>
                  {statAverages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getStatColor(getOriginalStatName(entry.name))} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
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

function getOriginalStatName(formattedName) {
  switch (formattedName) {
    case 'HP': return 'hp';
    case 'Attack': return 'attack';
    case 'Defense': return 'defense';
    case 'Sp. Atk': return 'special-attack';
    case 'Sp. Def': return 'special-defense';
    case 'Speed': return 'speed';
    default: return formattedName.toLowerCase();
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

export default PokemonCharts;