import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import PokemonDetail from './components/PokemonDetail'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App