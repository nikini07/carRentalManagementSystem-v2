import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard.jsx';
import CustomerDashboard from './components/CustomerDashboard.jsx';

function App() {
  const [role, setRole] = useState(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const carsRes = await axios.get('http://localhost:8080/cars');
      setCars(carsRes.data);
      const custRes = await axios.get('http://localhost:8080/customers');
      setCustomers(custRes.data);
      const bkRes = await axios.get('http://localhost:8080/bookings');
      setBookings(bkRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      alert('Failed to load data. Ensure the backend is running.');
    }
  };

  const saveCar = async (newCar) => {
    try {
      await axios.post('http://localhost:8080/cars', newCar);
      loadData();
    } catch (err) {
      console.error('Error saving car:', err);
      alert('Failed to save car.');
    }
  };

  const saveCustomer = async (newCust) => {
    try {
      const res = await axios.post('http://localhost:8080/customers', { ...newCust, id: generateCustomerID() });
      loadData();
      return res.data.id;
    } catch (err) {
      console.error('Error saving customer:', err);
      alert('Failed to save customer.');
      return null;
    }
  };

  const saveBooking = async (newBooking) => {
    try {
      await axios.post('http://localhost:8080/bookings', newBooking);
      loadData();
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Failed to save booking.');
    }
  };

  const generateCustomerID = () => {
    if (customers.length === 0) return 'C001';
    const maxID = customers.reduce((max, c) => Math.max(max, parseInt(c.id.substr(1))), 0);
    return 'C' + String(maxID + 1).padStart(3, '0');
  };

  const generateBookingID = () => {
    if (bookings.length === 0) return 'B001';
    const maxID = bookings.reduce((max, b) => Math.max(max, parseInt(b.bookingID.substr(1))), 0);
    return 'B' + String(maxID + 1).padStart(3, '0');
  };

  const dateLessThan = (d1, d2) => {
    if (d1.year !== d2.year) return d1.year < d2.year;
    if (d1.month !== d2.month) return d1.month < d2.month;
    return d1.day < d2.day;
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'customer') {
      setAuthenticated(true);
    }
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!role) {
    return (
      <div className="text-center mt-12">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Car Rental System</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded m-2 hover:bg-blue-600" onClick={() => handleRoleSelect('admin')}>
          Admin
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={() => handleRoleSelect('customer')}>
          Customer
        </button>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="text-center mt-12">
        <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-2 m-2 rounded w-64"
          placeholder="Enter admin password"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded m-2 hover:bg-blue-600" onClick={handleLogin}>
          Login
        </button>
      </div>
    );
  }

  const props = { cars, setCars, customers, setCustomers, bookings, setBookings, saveCar, saveCustomer, saveBooking, generateCustomerID, generateBookingID, dateLessThan };

  return role === 'admin' ? <AdminDashboard {...props} /> : <CustomerDashboard {...props} />;
}

export default App;