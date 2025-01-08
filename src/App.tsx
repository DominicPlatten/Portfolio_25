import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { ProjectDetail } from './pages/ProjectDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { ProjectEdit } from './pages/admin/ProjectEdit';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-900">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/project/:id" element={<ProjectEdit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;