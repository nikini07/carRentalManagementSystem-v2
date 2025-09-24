// frontend/src/components/Layout.jsx
import React from 'react';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-100">
    {children}
  </div>
);

export default Layout;