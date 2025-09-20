import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, customersRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:8080/cars'),
          axios.get('http://localhost:8080/customers'),
          axios.get('http://localhost:8080/bookings')
        ]);
        setCars(carsRes.data);
        setCustomers(customersRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data: ' + (error.response?.data?.message || 'Network error'));
      }
    };
    fetchData();
  }, []);

  const saveCar = async (car) => {
    try {
      const response = await axios.post('http://localhost:8080/cars', car);
      if (response.data.status === 'success') {
        setCars([...cars, car]);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save car');
    }
  };

  const saveCustomer = async (customer) => {
    try {
      const response = await axios.post('http://localhost:8080/customers', customer);
      if (response.data.status === 'success') {
        setCustomers([...customers, { id: response.data.id, ...customer }]);
        return response.data.id;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save customer');
    }
  };

  const saveBooking = async (booking) => {
    try {
      const response = await axios.post('http://localhost:8080/bookings', booking);
      if (response.data.status === 'success') {
        setBookings([...bookings, booking]);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save booking');
    }
  };

  const deleteCar = async (id) => {
    try {
      const response = await axios.post('http://localhost:8080/deleteCar', { id });
      if (response.data.status === 'success') {
        setCars(cars.filter((car) => car.id !== id));
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete car');
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await axios.post('http://localhost:8080/deleteCustomer', { id });
      if (response.data.status === 'success') {
        setCustomers(customers.filter((customer) => customer.id !== id));
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete customer');
    }
  };

  const deleteBooking = async (id) => {
    try {
      const response = await axios.post('http://localhost:8080/deleteBooking', { id });
      if (response.data.status === 'success') {
        setBookings(bookings.filter((booking) => booking.bookingID !== id));
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete booking');
    }
  };

  const generateCustomerID = () => {
    const maxID = customers.reduce((max, c) => {
      const num = parseInt(c.id.slice(1)) || 0;
      return Math.max(max, num);
    }, 0);
    return `C${String(maxID + 1).padStart(3, '0')}`;
  };

  const generateBookingID = () => {
    const maxID = bookings.reduce((max, b) => {
      const num = parseInt(b.bookingID.slice(1)) || 0;
      return Math.max(max, num);
    }, 0);
    return `B${String(maxID + 1).padStart(3, '0')}`;
  };

  const dateLessThan = (date1, date2) => {
    return (
      date1.year < date2.year ||
      (date1.year === date2.year && date1.month < date2.month) ||
      (date1.year === date2.year && date1.month === date2.month && date1.day < date2.day)
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="bg-gray-800 p-4 flex justify-center gap-4">
        <button
          onClick={() => setIsAdmin(false)}
          className={`px-4 py-2 rounded ${!isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}
        >
          Customer Dashboard
        </button>
        <button
          onClick={() => setIsAdmin(true)}
          className={`px-4 py-2 rounded ${isAdmin ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}
        >
          Admin Dashboard
        </button>
      </div>
      {isAdmin ? (
        <AdminDashboard
          cars={cars}
          customers={customers}
          bookings={bookings}
          setCars={setCars}
          setCustomers={setCustomers}
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
      ) : (
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
    </div>
  );
};

export default App;