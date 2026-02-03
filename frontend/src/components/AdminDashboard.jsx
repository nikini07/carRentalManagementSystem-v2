import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ name: '', type: '', pricePerDay: '' });
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    if (password === 'admin123') {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchData();
    }
  }, [loggedIn]);

  const fetchData = async () => {
    try {
      const [vehRes, custRes, bookRes] = await Promise.all([
        axios.get('http://localhost:5000/vehicles'),
        axios.get('http://localhost:5000/customers'),
        axios.get('http://localhost:5000/bookings')
      ]);
      setVehicles(vehRes.data);
      setCustomers(custRes.data);
      setBookings(bookRes.data);
    } catch (err) {
      setMessage('Error fetching data: ' + err.message);
    }
  };

  const handleAddVehicle = async () => {
    try {
      await axios.post('http://localhost:5000/vehicles', newVehicle);
      setMessage('Vehicle added successfully');
      setNewVehicle({ name: '', type: '', pricePerDay: '' });
      fetchData();
    } catch (err) {
      setMessage('Error adding vehicle: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-blue-200">
        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="border border-gray-300 p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white p-3 w-full rounded hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>
      {message && <p className={`text-center mb-4 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vehicles Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Vehicles</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Price/Day</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{v.id}</td>
                  <td className="p-2 border">{v.name}</td>
                  <td className="p-2 border">{v.type}</td>
                  <td className="p-2 border text-center">${v.pricePerDay}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className="text-xl font-medium mt-6 mb-2">Add New Vehicle</h3>
          <input name="name" value={newVehicle.name} onChange={handleChange} placeholder="Name" className="border p-2 w-full mb-2 rounded" />
          <input name="type" value={newVehicle.type} onChange={handleChange} placeholder="Type" className="border p-2 w-full mb-2 rounded" />
          <input name="pricePerDay" type="number" value={newVehicle.pricePerDay} onChange={handleChange} placeholder="Price per Day" className="border p-2 w-full mb-2 rounded" />
          <button onClick={handleAddVehicle} className="bg-green-600 text-white p-2 w-full rounded hover:bg-green-700 transition duration-300">Add Vehicle</button>
        </div>

        {/* Customers Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Customers</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{c.id}</td>
                  <td className="p-2 border">{c.name}</td>
                  <td className="p-2 border">{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bookings Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Bookings</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Vehicle</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Dates</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{b.id}</td>
                  <td className="p-2 border">{b.vehicleName}</td>
                  <td className="p-2 border">{b.customerName}</td>
                  <td className="p-2 border">{b.startDate.toDateString()} - {b.endDate.toDateString()}</td>
                  <td className="p-2 border text-center">${b.totalPrice}</td>
                  <td className="p-2 border text-center">
                    <a href={`http://localhost:5000/invoice/${b.id}`} download className="text-blue-600 hover:underline">Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;