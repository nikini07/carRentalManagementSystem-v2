// frontend/src/components/Navbar.jsx
import React from 'react';

const Navbar = ({ onLogout }) => (
  <nav className="bg-blue-600 text-white p-4 flex justify-between">
    <h1 className="text-lg font-bold">Car Rental System</h1>
    <button onClick={onLogout} className="bg-red-500 px-4 py-2 rounded">
      Logout
    </button>
  </nav>
);

export default Navbar;