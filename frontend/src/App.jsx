// src/App.jsx
import { useState, useEffect } from 'react';
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

  const loadData = () => {
    const carsData = localStorage.getItem('cars');
    if (carsData) {
      setCars(parseCars(carsData));
    }
    const customersData = localStorage.getItem('customers');
    if (customersData) {
      setCustomers(parseCustomers(customersData));
    }
    const bookingsData = localStorage.getItem('bookings');
    if (bookingsData) {
      setBookings(parseBookings(bookingsData));
    }
  };

  const saveData = () => {
    localStorage.setItem('cars', serializeCars(cars));
    localStorage.setItem('customers', serializeCustomers(customers));
    localStorage.setItem('bookings', serializeBookings(bookings));
  };

  const parseCars = (data) => {
    const lines = data.split('\n').filter((l) => l.trim());
    return lines.map((line) => {
      const [carID, brand, model, type, year, capacity, ratePerDay, available] = line.split(' ');
      return { carID, brand, model, type, year: parseInt(year), capacity: parseInt(capacity), ratePerDay: parseFloat(ratePerDay), available: available === 'true' };
    });
  };

  const serializeCars = (carsList) => {
    return carsList.map((c) => `${c.carID} ${c.brand} ${c.model} ${c.type} ${c.year} ${c.capacity} ${c.ratePerDay.toFixed(2)} ${c.available}`).join('\n');
  };

  const parseCustomers = (data) => {
    const lines = data.split('\n').filter((l) => l.trim());
    return lines.map((line) => {
      const [customerID, name, licenseNumber, contactInfo] = line.split(' ');
      return { customerID, name, licenseNumber, contactInfo };
    });
  };const serializeCustomers = (custList) => {
    return custList.map((c) => `${c.customerID} ${c.name} ${c.licenseNumber} ${c.contactInfo}`).join('\n');
  };

  const parseBookings = (data) => {
    const lines = data.split('\n').filter((l) => l.trim());
    return lines.map((line) => {
      const [bookingID, carID, customerID, startStr, endStr] = line.split(' ');
      const [startDay, startMonth, startYear] = startStr.split('-').map(Number);
      const [endDay, endMonth, endYear] = endStr.split('-').map(Number);
      return {
        bookingID,
        carID,
        customerID,
        startDate: { day: startDay, month: startMonth, year: startYear },
        endDate: { day: endDay, month: endMonth, year: endYear },
      };
    });
  };

  const serializeBookings = (bkList) => {
    return bkList
      .map((b) => `${b.bookingID} ${b.carID} ${b.customerID} ${b.startDate.day}-${b.startDate.month}-${b.startDate.year} ${b.endDate.day}-${b.endDate.month}-${b.endDate.year}`)
      .join('\n');
  };

  const generateCustomerID = () => {
    if (customers.length === 0) return 'C001';
    const maxID = customers.reduce((max, c) => Math.max(max, parseInt(c.customerID.substr(1))), 0);
    return 'C' + String(maxID + 1).padStart(3, '0');
  };const generateBookingID = () => {
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
      <button className="bg-blue-500 text-white px-4 py-2 rounded m-2 hover:bg-blue-600" onClick={() => handleRoleSelect('admin')}>Admin</button>
      <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={() => handleRoleSelect('customer')}>Customer</button>
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
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded m-2 hover:bg-blue-600" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

  const props = { cars, setCars, customers, setCustomers, bookings, setBookings, saveData, generateCustomerID, generateBookingID, dateLessThan };

  return role === 'admin' ? <AdminDashboard {...props} /> : <CustomerDashboard {...props} />;
}

export default App;