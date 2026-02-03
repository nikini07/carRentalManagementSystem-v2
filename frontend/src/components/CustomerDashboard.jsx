import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', vehicleId: '', start: '', end: '' });
  const [message, setMessage] = useState('');
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('http://localhost:5000/vehicles/available');
      setVehicles(res.data);
    } catch (err) {
      setMessage('Error fetching vehicles: ' + err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage('');
    setBookingId(null);
    // Check availability for selected dates
    try {
      const availRes = await axios.get(`http://localhost:5000/vehicles/available?start=${form.start}&end=${form.end}`);
      const selectedVehicle = availRes.data.find(v => v.id === parseInt(form.vehicleId));
      if (!selectedVehicle) {
        return setMessage('Error: Vehicle not available in selected dates');
      }
      const res = await axios.post('http://localhost:5000/bookings', form);
      if (res.data.success) {
        setBookingId(res.data.bookingId);
        setMessage('Booking successful! Download your invoice below.');
        fetchVehicles(); // Refresh availability
      }
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Customer Dashboard</h1>
      {message && <p className={`text-center mb-4 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
      <h2 className="text-3xl font-semibold mb-6 text-gray-700">Vehicle Availability</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className={`p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 ${
              v.available ? 'bg-green-100 border-green-300 border' : 'bg-red-100 border-red-300 border'
            }`}
          >
            <h3 className="text-xl font-bold mb-2 text-gray-800">{v.name}</h3>
            <p className="text-gray-600 mb-1">{v.type}</p>
            <p className="text-gray-600 mb-2">${v.pricePerDay} / day</p>
            <p className={`font-medium ${v.available ? 'text-green-700' : 'text-red-700'}`}>
              {v.available ? 'Available' : 'Not Available'}
            </p>
          </div>
        ))}
      </div>
      <h2 className="text-3xl font-semibold my-8 text-gray-700">Book a Vehicle</h2>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="border border-gray-300 p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="border border-gray-300 p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          name="vehicleId"
          value={form.vehicleId}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.type})
            </option>
          ))}
        </select>
        <input
          name="start"
          type="date"
          value={form.start}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          name="end"
          type="date"
          value={form.end}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white p-3 w-full rounded hover:bg-green-700 transition duration-300"
        >
          Book Now
        </button>
        {bookingId && (
          <a
            href={`http://localhost:5000/invoice/${bookingId}`}
            download
            className="block mt-4 bg-blue-600 text-white p-3 text-center rounded hover:bg-blue-700 transition duration-300"
          >
            Download Invoice
          </a>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;