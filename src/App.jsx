import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './authContext';
import ProjectRoutes from './Routes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <ProjectRoutes />
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
