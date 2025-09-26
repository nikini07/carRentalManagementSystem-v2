// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Navbar, Sidebar } from './components';
import { LoginPage, AdminDashboard, CustomerDashboard } from './pages';
import { useApi } from './hooks/useApi';
import './index.css';

const App = () => {
  const { api } = useApi();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, customersRes, bookingsRes, invoicesRes] = await Promise.all([
        api.get('/cars'),
        api.get('/customers'),
        api.get('/bookings'),
        api.get('/invoices'),
      ]);
      setCars(carsRes.data);
      setCustomers(customersRes.data);
      setBookings(bookingsRes.data);
      setInvoices(invoicesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = (role) => {
    if (role === 'admin') {
      const password = prompt('Admin Password:');
      if (password === 'admin123' && attempts < 5) {
        setIsAdmin(true);
        setUserRole('admin');
        setAttempts(0);
      } else {
        setAttempts(attempts + 1);
        if (attempts >= 4) {
          alert('Max attempts exceeded. Redirecting to login.');
          setUserRole(null);
        }
      }
    } else {
      setIsAdmin(false);
      setUserRole('customer');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsAdmin(false);
  };

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout>
        <Navbar onLogout={handleLogout} />
        {userRole === 'admin' && (
          <Sidebar isAdmin={true} />
        )}
        <Routes>
          <Route path="/" element={
            userRole === 'admin' ? 
            <AdminDashboard 
              cars={cars} 
              customers={customers} 
              bookings={bookings} 
              invoices={invoices}
              onRefresh={fetchData}
              api={api}
            /> : 
            <CustomerDashboard 
              cars={cars} 
              bookings={bookings}
              onRefresh={fetchData}
              api={api}
            />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;