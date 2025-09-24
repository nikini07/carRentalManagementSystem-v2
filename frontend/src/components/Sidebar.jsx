// frontend/src/components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ isAdmin }) => (
  <aside className="w-64 bg-gray-800 text-white p-4">
    <h2 className="text-xl font-bold mb-4">Menu</h2>
    <ul>
      {isAdmin ? (
        <>
          <li className="mb-2"><a href="#" className="hover:underline">Manage Cars</a></li>
          <li className="mb-2"><a href="#" className="hover:underline">Manage Customers</a></li>
          <li className="mb-2"><a href="#" className="hover:underline">Manage Bookings</a></li>
          <li className="mb-2"><a href="#" className="hover:underline">View Invoices</a></li>
          <li className="mb-2"><a href="#" className="hover:underline">Statistics</a></li>
        </>
      ) : (
        <>
          <li className="mb-2"><a href="#" className="hover:underline">View Cars</a></li>
          <li className="mb-2"><a href="#" className="hover:underline">Book Car</a></li>
          <li className="mb-2"><a href="#" className="hover:underline">My Bookings</a></li>
        </>
      )}
    </ul>
  </aside>
);

export default Sidebar;