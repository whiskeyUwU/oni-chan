import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';
import Watch from './pages/Watch';
import SearchPage from './pages/Search';
import AZList from './pages/AZList';
import MostPopular from './pages/MostPopular';

function App() {
  return (
    <Router>
      <div className="bg-dark text-white min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/watch/:episodeId" element={<Watch />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/az-list" element={<AZList />} />
          <Route path="/most-popular" element={<MostPopular />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
