import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstScreen from './components/FirstScreen';
import ForgotPassword from './components/ForgotPassword'; // Create this for the forgot password route

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
