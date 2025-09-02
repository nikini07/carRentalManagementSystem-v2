import { useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ cars, setCars, customers, setCustomers, bookings, setBookings, saveCar, saveCustomer, saveBooking, generateCustomerID, generateBookingID, dateLessThan }) => {
  const [view, setView] = useState('menu');
  const [formData, setFormData] = useState({
    id: '', brand: '', model: '', type: '', year: '', capacity: '', rate: '',
    name: '', license: '', contact: '',
    carID: '', customerID: '', startDay: '', startMonth: '', startYear: '', endDay: '', endMonth: '', endYear: '',
    updateCarID: '', updateCarField: '', updateCarValue: '',
    updateCustomerID: '', updateCustomerField: '', updateCustomerValue: '',
    updateBookingID: '', updateBookingField: '', updateBookingValue: '',
    updateBookingStartDay: '', updateBookingStartMonth: '', updateBookingStartYear: '',
    updateBookingEndDay: '', updateBookingEndMonth: '', updateBookingEndYear: '',
    deleteCarID: '', deleteCustomerID: '', deleteBookingID: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      id: '', brand: '', model: '', type: '', year: '', capacity: '', rate: '',
      name: '', license: '', contact: '',
      carID: '', customerID: '', startDay: '', startMonth: '', startYear: '', endDay: '', endMonth: '', endYear: '',
      updateCarID: '', updateCarField: '', updateCarValue: '',
      updateCustomerID: '', updateCustomerField: '', updateCustomerValue: '',
      updateBookingID: '', updateBookingField: '', updateBookingValue: '',
      updateBookingStartDay: '', updateBookingStartMonth: '', updateBookingStartYear: '',
      updateBookingEndDay: '', updateBookingEndMonth: '', updateBookingEndYear: '',
      deleteCarID: '', deleteCustomerID: '', deleteBookingID: ''
    });
  };

  const addCar = async () => {
    const { id, brand, model, type, year, capacity, rate } = formData;
    if (!id || !/^[A-Za-z]\d*$/.test(id)) {
      alert('Invalid Car ID. Must start with a letter followed by digits.');
      return;
    }
    if (!brand || !model || !type) {
      alert('Brand, Model, Type cannot be empty.');
      return;
    }
    const y = parseInt(year);
    if (isNaN(y) || y < 1900 || y > 2025) {
      alert('Invalid year.');
      return;
    }
    const cap = parseInt(capacity);
    if (isNaN(cap) || cap <= 0) {
      alert('Invalid capacity.');
      return;
    }
    const r = parseFloat(rate);
    if (isNaN(r) || r <= 0) {
      alert('Invalid rate.');
      return;
    }
    await saveCar({ id, brand, model, type, year: y, capacity: cap, rate: r });
    resetForm();
    setView('menu');
  };

  const addCustomer = async () => {
    const { name, license, contact } = formData;
    if (!name || !license || !contact) {
      alert('All fields required.');
      return;
    }
    await saveCustomer({ name, license, contact });
    resetForm();
    setView('menu');
  };

  const addBooking = async () => {
    const { carID, customerID, startDay, startMonth, startYear, endDay, endMonth, endYear } = formData;
    const car = cars.find((c) => c.id === carID && c.available);
    if (!car) {
      alert('Car not available or not found.');
      return;
    }
    if (!customers.some((c) => c.id === customerID)) {
      alert('Customer not found.');
      return;
    }
    const startDate = { day: parseInt(startDay), month: parseInt(startMonth), year: parseInt(startYear) };
    const endDate = { day: parseInt(endDay), month: parseInt(endMonth), year: parseInt(endYear) };
    if (dateLessThan(endDate, startDate)) {
      alert('End date cannot be before start date.');
      return;
    }
    const bookingID = generateBookingID();
    await saveBooking({ bookingID, carID, customerID, startDate, endDate });
    resetForm();
    setView('menu');
  };

  const updateCar = async () => {
    const { updateCarID, updateCarField, updateCarValue } = formData;
    if (!updateCarID || !updateCarField || !updateCarValue) {
      alert('All fields required.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/updateCar', {
        id: updateCarID,
        field: updateCarField,
        value: updateCarValue
      });
      alert('Car updated successfully.');
      const res = await axios.get('http://localhost:8080/cars');
      setCars(res.data);
      resetForm();
      setView('menu');
    } catch (err) {
      alert('Failed to update car: ' + err.response.data.message);
    }
  };

  const deleteCar = async () => {
    const { deleteCarID } = formData;
    if (!deleteCarID) {
      alert('Car ID required.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/deleteCar', { id: deleteCarID });
      alert('Car deleted successfully.');
      const res = await axios.get('http://localhost:8080/cars');
      setCars(res.data);
      resetForm();
      setView('menu');
    } catch (err) {
      alert('Failed to delete car: ' + err.response.data.message);
    }
  };

  const updateCustomer = async () => {
    const { updateCustomerID, updateCustomerField, updateCustomerValue } = formData;
    if (!updateCustomerID || !updateCustomerField || !updateCustomerValue) {
      alert('All fields required.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/updateCustomer', {
        id: updateCustomerID,
        field: updateCustomerField,
        value: updateCustomerValue
      });
      alert('Customer updated successfully.');
      const res = await axios.get('http://localhost:8080/customers');
      setCustomers(res.data);
      resetForm();
      setView('menu');
    } catch (err) {
      alert('Failed to update customer: ' + err.response.data.message);
    }
  };

  const deleteCustomer = async () => {
    const { deleteCustomerID } = formData;
    if (!deleteCustomerID) {
      alert('Customer ID required.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/deleteCustomer', { id: deleteCustomerID });
      alert('Customer deleted successfully.');
      const res = await axios.get('http://localhost:8080/customers');
      setCustomers(res.data);
      resetForm();
      setView('menu');
    } catch (err) {
      alert('Failed to delete customer: ' + err.response.data.message);
    }
  };

  const updateBooking = async () => {
    const { updateBookingID, updateBookingField, updateBookingValue, updateBookingStartDay, updateBookingStartMonth, updateBookingStartYear, updateBookingEndDay, updateBookingEndMonth, updateBookingEndYear } = formData;
    if (!updateBookingID || !updateBookingField) {
      alert('Booking ID and field required.');
      return;
    }
    if ((updateBookingField === 'startDate' || updateBookingField === 'endDate') && (!updateBookingStartDay || !updateBookingStartMonth || !updateBookingStartYear || !updateBookingEndDay || !updateBookingEndMonth || !updateBookingEndYear)) {
      alert('Date fields required for date update.');
      return;
    }
    if (updateBookingField !== 'startDate' && updateBookingField !== 'endDate' && !updateBookingValue) {
      alert('Value required for non-date fields.');
      return;
    }
    try {
      const payload = {
        id: updateBookingID,
        field: updateBookingField,
        value: updateBookingField === 'startDate' || updateBookingField === 'endDate' ? '' : updateBookingValue,
        dateValue: updateBookingField === 'startDate' ? {
          day: parseInt(updateBookingStartDay),
          month: parseInt(updateBookingStartMonth),
          year: parseInt(updateBookingStartYear)
        } : updateBookingField === 'endDate' ? {
          day: parseInt(updateBookingEndDay),
          month: parseInt(updateBookingEndMonth),
          year: parseInt(updateBookingEndYear)
        } : {}
      };
      await axios.post('http://localhost:8080/updateBooking', payload);
      alert('Booking updated successfully.');
      const res = await axios.get('http://localhost:8080/bookings');
      setBookings(res.data);
      resetForm();
      setView('menu');
    } catch (err) {
      alert('Failed to update booking: ' + err.response.data.message);
    }
  };

  const deleteBooking = async () => {
    const { deleteBookingID } = formData;
    if (!deleteBookingID) {
      alert('Booking ID required.');
      return;
    }
    try {
      await axios.post('http://localhost:8080/deleteBooking', { id: deleteBookingID });
      alert('Booking deleted successfully.');
      const res = await axios.get('http://localhost:8080/bookings');
      setBookings(res.data);
      resetForm();
      setView('menu');
    } catch (err) {
      alert('Failed to delete booking: ' + err.response.data.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
      {view === 'menu' && (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('addCar')}>
            Add Car
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('addCustomer')}>
            Add Customer
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('addBooking')}>
            Add Booking
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('updateCar')}>
            Update Car
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('deleteCar')}>
            Delete Car
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('updateCustomer')}>
            Update Customer
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('deleteCustomer')}>
            Delete Customer
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('updateBooking')}>
            Update Booking
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('deleteBooking')}>
            Delete Booking
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('viewCars')}>
            View Cars
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('viewCustomers')}>
            View Customers
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('viewBookings')}>
            View Bookings
          </button>
        </div>
      )}
      {view === 'addCar' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Car</h2>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            placeholder="Car ID"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            placeholder="Brand"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            placeholder="Model"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            placeholder="Type"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="Year"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            placeholder="Capacity"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="number"
            name="rate"
            value={formData.rate}
            onChange={handleInputChange}
            placeholder="Rate per Day"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={addCar}>
            Add Car
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'addCustomer' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Customer</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="text"
            name="license"
            value={formData.license}
            onChange={handleInputChange}
            placeholder="License Number"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Contact Info"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={addCustomer}>
            Add Customer
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'addBooking' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add Booking</h2>
          <input
            type="text"
            name="carID"
            value={formData.carID}
            onChange={handleInputChange}
            placeholder="Car ID"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="text"
            name="customerID"
            value={formData.customerID}
            onChange={handleInputChange}
            placeholder="Customer ID"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="number"
            name="startDay"
            value={formData.startDay}
            onChange={handleInputChange}
            placeholder="Start Day"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="number"
            name="startMonth"
            value={formData.startMonth}
            onChange={handleInputChange}
            placeholder="Start Month"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="number"
            name="startYear"
            value={formData.startYear}
            onChange={handleInputChange}
            placeholder="Start Year"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="number"
            name="endDay"
            value={formData.endDay}
            onChange={handleInputChange}
            placeholder="End Day"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="number"
            name="endMonth"
            value={formData.endMonth}
            onChange={handleInputChange}
            placeholder="End Month"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="number"
            name="endYear"
            value={formData.endYear}
            onChange={handleInputChange}
            placeholder="End Year"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={addBooking}>
            Add Booking
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'updateCar' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Update Car</h2>
          <input
            type="text"
            name="updateCarID"
            value={formData.updateCarID}
            onChange={handleInputChange}
            placeholder="Car ID"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <select
            name="updateCarField"
            value={formData.updateCarField}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 m-2 rounded w-full"
          >
            <option value="">Select Field</option>
            <option value="brand">Brand</option>
            <option value="model">Model</option>
            <option value="type">Type</option>
            <option value="year">Year</option>
            <option value="capacity">Capacity</option>
            <option value="ratePerDay">Rate per Day</option>
            <option value="available">Available (yes/no)</option>
          </select>
          <input
            type="text"
            name="updateCarValue"
            value={formData.updateCarValue}
            onChange={handleInputChange}
            placeholder="New Value"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={updateCar}>
            Update Car
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'deleteCar' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Delete Car</h2>
          <input
            type="text"
            name="deleteCarID"
            value={formData.deleteCarID}
            onChange={handleInputChange}
            placeholder="Car ID"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <button className="bg-red-500 text-white px-4 py-2 rounded m-2 hover:bg-red-600" onClick={deleteCar}>
            Delete Car
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'updateCustomer' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Update Customer</h2>
          <input
            type="text"
            name="updateCustomerID"
            value={formData.updateCustomerID}
            onChange={handleInputChange}
            placeholder="Customer ID"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <select
            name="updateCustomerField"
            value={formData.updateCustomerField}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 m-2 rounded w-full"
          >
            <option value="">Select Field</option>
            <option value="name">Name</option>
            <option value="license">License Number</option>
            <option value="contact">Contact Info</option>
          </select>
          <input
            type="text"
            name="updateCustomerValue"
            value={formData.updateCustomerValue}
            onChange={handleInputChange}
            placeholder="New Value"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={updateCustomer}>
            Update Customer
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'deleteCustomer' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Delete Customer</h2>
          <input
            type="text"
            name="deleteCustomerID"
            value={formData.deleteCustomerID}
            onChange={handleInputChange}
            placeholder="Customer ID"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <button className="bg-red-500 text-white px-4 py-2 rounded m-2 hover:bg-red-600" onClick={deleteCustomer}>
            Delete Customer
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'updateBooking' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Update Booking</h2>
          <input
            type="text"
            name="updateBookingID"
            value={formData.updateBookingID}
            onChange={handleInputChange}
            placeholder="Booking ID"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <select
            name="updateBookingField"
            value={formData.updateBookingField}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 m-2 rounded w-full"
          >
            <option value="">Select Field</option>
            <option value="customerID">Customer ID</option>
            <option value="carID">Car ID</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
          </select>
          {formData.updateBookingField === 'startDate' || formData.updateBookingField === 'endDate' ? (
            <>
              <input
                type="number"
                name={formData.updateBookingField === 'startDate' ? 'updateBookingStartDay' : 'updateBookingEndDay'}
                value={formData.updateBookingField === 'startDate' ? formData.updateBookingStartDay : formData.updateBookingEndDay}
                onChange={handleInputChange}
                placeholder={formData.updateBookingField === 'startDate' ? 'Start Day' : 'End Day'}
                className="border border-gray-300 p-2 m-2 rounded w-full"
              />
              <input
                type="number"
                name={formData.updateBookingField === 'startDate' ? 'updateBookingStartMonth' : 'updateBookingEndMonth'}
                value={formData.updateBookingField === 'startDate' ? formData.updateBookingStartMonth : formData.updateBookingEndMonth}
                onChange={handleInputChange}
                placeholder={formData.updateBookingField === 'startDate' ? 'Start Month' : 'End Month'}
                className="border border-gray-300 p-2 m-2 rounded w-full"
              />
              <input
                type="number"
                name={formData.updateBookingField === 'startDate' ? 'updateBookingStartYear' : 'updateBookingEndYear'}
                value={formData.updateBookingField === 'startDate' ? formData.updateBookingStartYear : formData.updateBookingEndYear}
                onChange={handleInputChange}
                placeholder={formData.updateBookingField === 'startDate' ? 'Start Year' : 'End Year'}
                className="border border-gray-300 p-2 m-2 rounded w-full"
              />
            </>
          ) : (
            <input
              type="text"
              name="updateBookingValue"
              value={formData.updateBookingValue}
              onChange={handleInputChange}
              placeholder="New Value"
              className="border border-gray-300 p-2 m-2 rounded w-full"
            />
          )}
          <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={updateBooking}>
            Update Booking
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'deleteBooking' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Delete Booking</h2>
          <input
            type="text"
            name="deleteBookingID"
            value={formData.deleteBookingID}
            onChange={handleInputChange}
            placeholder="Booking ID"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <button className="bg-red-500 text-white px-4 py-2 rounded m-2 hover:bg-red-600" onClick={deleteBooking}>
            Delete Booking
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'viewCars' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">All Cars</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Brand</th>
                <th className="border border-gray-300 p-2">Model</th>
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Year</th>
                <th className="border border-gray-300 p-2">Capacity</th>
                <th className="border border-gray-300 p-2">Rate/Day</th>
                <th className="border border-gray-300 p-2">Available</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td className="border border-gray-300 p-2">{car.id}</td>
                  <td className="border border-gray-300 p-2">{car.brand}</td>
                  <td className="border border-gray-300 p-2">{car.model}</td>
                  <td className="border border-gray-300 p-2">{car.type}</td>
                  <td className="border border-gray-300 p-2">{car.year}</td>
                  <td className="border border-gray-300 p-2">{car.capacity}</td>
                  <td className="border border-gray-300 p-2">{car.rate.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">{car.available ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'viewCustomers' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">All Customers</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">License</th>
                <th className="border border-gray-300 p-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id}>
                  <td className="border border-gray-300 p-2">{cust.id}</td>
                  <td className="border border-gray-300 p-2">{cust.name}</td>
                  <td className="border border-gray-300 p-2">{cust.license}</td>
                  <td className="border border-gray-300 p-2">{cust.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'viewBookings' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Booking ID</th>
                <th className="border border-gray-300 p-2">Car ID</th>
                <th className="border border-gray-300 p-2">Customer ID</th>
                <th className="border border-gray-300 p-2">Start Date</th>
                <th className="border border-gray-300 p-2">End Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((bk) => (
                <tr key={bk.bookingID}>
                  <td className="border border-gray-300 p-2">{bk.bookingID}</td>
                  <td className="border border-gray-300 p-2">{bk.carID}</td>
                  <td className="border border-gray-300 p-2">{bk.customerID}</td>
                  <td className="border border-gray-300 p-2">{`${bk.startDate.day}-${bk.startDate.month}-${bk.startDate.year}`}</td>
                  <td className="border border-gray-300 p-2">{`${bk.endDate.day}-${bk.endDate.month}-${bk.endDate.year}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;