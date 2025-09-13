import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerDashboard from './CustomerDashboard';

const App = () => {
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);

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
  );
};

export default App;