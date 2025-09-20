import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';

const App = () => {
  const [view, setView] = useState('customer');
  const [password, setPassword] = useState('');
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, customersRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:8080/cars'),
          axios.get('http://localhost:8080/customers'),
          axios.get('http://localhost:8080/bookings'),
        ]);
        setCars(carsRes.data);
        setCustomers(customersRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const saveCar = async (car) => {
    await axios.post('http://localhost:8080/addCar', car);
    const res = await axios.get('http://localhost:8080/cars');
    setCars(res.data);
  };

  const saveCustomer = async (customer) => {
    await axios.post('http://localhost:8080/addCustomer', customer);
    const res = await axios.get('http://localhost:8080/customers');
    setCustomers(res.data);
  };

  const saveBooking = async (booking) => {
    await axios.post('http://localhost:8080/addBooking', booking);
    const res = await axios.get('http://localhost:8080/bookings');
    setBookings(res.data);
    const carsRes = await axios.get('http://localhost:8080/cars');
    setCars(carsRes.data);
  };

  const deleteCar = async (id) => {
    await axios.delete(`http://localhost:8080/deleteCar/${id}`);
    const res = await axios.get('http://localhost:8080/cars');
    setCars(res.data);
  };

  const deleteCustomer = async (id) => {
    await axios.delete(`http://localhost:8080/deleteCustomer/${id}`);
    const res = await axios.get('http://localhost:8080/customers');
    setCustomers(res.data);
  };

  const deleteBooking = async (id) => {
    await axios.delete(`http://localhost:8080/deleteBooking/${id}`);
    const res = await axios.get('http://localhost:8080/bookings');
    setBookings(res.data);
    const carsRes = await axios.get('http://localhost:8080/cars');
    setCars(carsRes.data);
  };

  const generateCustomerID = () => {
    const id = `C${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    return customers.some((c) => c.id === id) ? generateCustomerID() : id;
  };

  const generateBookingID = () => {
    const id = `B${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    return bookings.some((b) => b.bookingID === id) ? generateBookingID() : id;
  };

  const dateLessThan = (date1, date2) => {
    const d1 = new Date(date1.year, date1.month - 1, date1.day);
    const d2 = new Date(date2.year, date2.month - 1, date2.day);
    return d1 < d2;
  };

  const handleAdminAccess = () => {
    if (isLocked) {
      setPasswordError('Access locked due to too many attempts.');
      return;
    }
    if (password === 'admin123') {
      setView('admin');
      setPassword('');
      setPasswordError('');
      setPasswordAttempts(0);
    } else {
      const newAttempts = passwordAttempts + 1;
      setPasswordAttempts(newAttempts);
      setPasswordError(`Incorrect password. ${5 - newAttempts} attempt(s) left.`);
      setPassword('');
      if (newAttempts >= 5) {
        setIsLocked(true);
        setPasswordError('Too many attempts. Access locked.');
      }
    }
  };

  const handleLogout = () => {
    setView('customer');
    setPassword('');
    setPasswordError('');
    setPasswordAttempts(0);
    setIsLocked(false);
  };

  return (
    <div className="min-h-screen bg-pure-white font-inter">
      <nav className="bg-off-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dark-neutral">Car Rental System</h1>
          <div className="space-x-4">
            <button
              className={`px-4 py-2 rounded-md font-semibold uppercase text-dark-neutral transition-transform duration-200 transform hover:scale-105 ${view === 'customer' ? 'bg-lime' : 'bg-dark-neutral text-off-white'}`}
              onClick={() => setView('customer')}
              data-tooltip="Switch to Customer Dashboard"
            >
              Customer
            </button>
            <button
              className={`px-4 py-2 rounded-md font-semibold uppercase text-dark-neutral transition-transform duration-200 transform hover:scale-105 ${view === 'admin' ? 'bg-lime' : 'bg-dark-neutral text-off-white'}`}
              onClick={() => setView('password')}
              data-tooltip="Switch to Admin Dashboard"
            >
              Admin
            </button>
            {(view === 'admin' || view === 'password') && (
              <button
                className="px-4 py-2 rounded-md font-semibold uppercase bg-red-accent text-off-white transition-transform duration-200 transform hover:scale-105"
                onClick={handleLogout}
                data-tooltip="Log out"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      {view === 'password' && (
        <div className="container mx-auto px-4 py-8 max-w-md">
          <div className="bg-off-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Admin Login</h2>
            {passwordError && (
              <div className="bg-red-accent text-off-white p-3 rounded-md mb-4 animate-slide-in">
                {passwordError}
              </div>
            )}
            <div className="mb-4">
              <label className="block mb-1 text-dark-neutral font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-dark-neutral"
                disabled={isLocked}
              />
            </div>
            <button
              className="w-full bg-lime text-dark-neutral px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={handleAdminAccess}
              disabled={isLocked}
            >
              Login
            </button>
          </div>
        </div>
      )}
      {view === 'admin' && (
        <AdminDashboard
          cars={cars}
          setCars={setCars}
          customers={customers}
          setCustomers={setCustomers}
          bookings={bookings}
          setBookings={setBookings}
          saveCar={saveCar}
          saveCustomer={saveCustomer}
          saveBooking={saveBooking}
          generateCustomerID={generateCustomerID}
          generateBookingID={generateBookingID}
          dateLessThan={dateLessThan}
          deleteCar={deleteCar}
          deleteCustomer={deleteCustomer}
          deleteBooking={deleteBooking}
        />
      )}
      {view === 'customer' && (
        <CustomerDashboard
          cars={cars}
          customers={customers}
          bookings={bookings}
          saveCustomer={saveCustomer}
          saveBooking={saveBooking}
          generateCustomerID={generateCustomerID}
          generateBookingID={generateBookingID}
          dateLessThan={dateLessThan}
        />
      )}
      <style jsx>{`
        [data-tooltip] {
          position: relative;
        }
        [data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #434738;
          color: #F4F6F0;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default App;