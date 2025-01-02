import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated imports
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>  {/* Replacing 'Switch' with 'Routes' */}
          <Route path="/" element={<Login />} /> {/* Updated 'component' to 'element' */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Updated 'component' to 'element' */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
