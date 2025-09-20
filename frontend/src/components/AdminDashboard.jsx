import { useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ cars, setCars, customers, setCustomers, bookings, setBookings, saveCar, saveCustomer, saveBooking, generateCustomerID, generateBookingID, dateLessThan, deleteCar, deleteCustomer, deleteBooking }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
    setSuccess('');
    setError('');
  };

  const addCar = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const { id, brand, model, type, year, capacity, rate } = formData;
    if (!id || !/^[A-Za-z]\d*$/.test(id)) {
      setError('Invalid Car ID. Must start with a letter followed by digits.');
      setIsLoading(false);
      return;
    }
    if (!brand || !model || !type) {
      setError('Brand, Model, Type cannot be empty.');
      setIsLoading(false);
      return;
    }
    const y = parseInt(year);
    if (isNaN(y) || y < 1900 || y > 2025) {
      setError('Invalid year.');
      setIsLoading(false);
      return;
    }
    const cap = parseInt(capacity);
    if (isNaN(cap) || cap <= 0) {
      setError('Invalid capacity.');
      setIsLoading(false);
      return;
    }
    const r = parseFloat(rate);
    if (isNaN(r) || r <= 0) {
      setError('Invalid rate.');
      setIsLoading(false);
      return;
    }
    try {
      await saveCar({ id, brand, model, type, year: y, capacity: cap, rate: r });
      setSuccess('Car added successfully.');
      resetForm();
      setView('menu');
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const addCustomer = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const { name, license, contact } = formData;
    if (!name || !license || !contact) {
      setError('All fields required.');
      setIsLoading(false);
      return;
    }
    try {
      await saveCustomer({ name, license, contact });
      setSuccess('Customer added successfully.');
      resetForm();
      setView('menu');
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const addBooking = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const { carID, customerID, startDay, startMonth, startYear, endDay, endMonth, endYear } = formData;
    const car = cars.find((c) => c.id === carID && c.available);
    if (!car) {
      setError('Car not available or not found.');
      setIsLoading(false);
      return;
    }
    if (!customers.some((c) => c.id === customerID)) {
      setError('Customer not found.');
      setIsLoading(false);
      return;
    }
    const startDate = { day: parseInt(startDay), month: parseInt(startMonth), year: parseInt(startYear) };
    const endDate = { day: parseInt(endDay), month: parseInt(endMonth), year: parseInt(endYear) };
    if (dateLessThan(endDate, startDate)) {
      setError('End date cannot be before start date.');
      setIsLoading(false);
      return;
    }
    const bookingID = generateBookingID();
    try {
      await saveBooking({ bookingID, carID, customerID, startDate, endDate });
      setSuccess('Booking added successfully.');
      resetForm();
      setView('menu');
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  };

  const updateCar = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const { updateCarID, updateCarField, updateCarValue } = formData;
    if (!updateCarID || !updateCarField || !updateCarValue) {
      setError('All fields required.');
      setIsLoading(false);
      return;
    }
    try {
      await axios.post('http://localhost:8080/updateCar', {
        id: updateCarID,
        field: updateCarField,
        value: updateCarValue
      });
      setSuccess('Car updated successfully.');
      const res = await axios.get('http://localhost:8080/cars');
      setCars(res.data);
      resetForm();
      setView('menu');
    } catch (err) {
      setError('Failed to update car: ' + (err.response?.data?.message || 'Network error'));
    }
    setIsLoading(false);
  };

  const handleDeleteCar = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const { deleteCarID } = formData;
    if (!deleteCarID) {
      setError('Car ID required.');
      setIsLoading(false);
      return;
    }
    try {
      await deleteCar(deleteCarID);
      setSuccess('Car deleted successfully.');
      resetForm();
      setView('menu');
    } catch (err) {
      setError('Failed to delete car: ' + (err.response?.data?.message || 'Network error'));
    }
    setIsLoading(false);
  };

  const handleDeleteCustomer = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const { deleteCustomerID } = formData;
    if (!deleteCustomerID) {
      setError('Customer ID required.');
      setIsLoading(false);
      return;
    }
    try {
      await deleteCustomer(deleteCustomerID);
      setSuccess('Customer deleted successfully.');
      resetForm();
      setView('menu');
    } catch (err) {
      setError('Failed to delete customer: ' + (err.response?.data?.message || 'Network error'));
    }
    setIsLoading(false);
  };

  const handleDeleteBooking = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const { deleteBookingID } = formData;
    if (!deleteBookingID) {
      setError('Booking ID required.');
      setIsLoading(false);
      return;
    }
    try {
      await deleteBooking(deleteBookingID);
      setSuccess('Booking deleted successfully.');
      resetForm();
      setView('menu');
    } catch (err) {
      setError('Failed to delete booking: ' + (err.response?.data?.message || 'Network error'));
    }
    setIsLoading(false);
  };

  const updateCustomer = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const { updateCustomerID, updateCustomerField, updateCustomerValue } = formData;
    if (!updateCustomerID || !updateCustomerField || !updateCustomerValue) {
      setError('All fields required.');
      setIsLoading(false);
      return;
    }
    try {
      await axios.post('http://localhost:8080/updateCustomer', {
        id: updateCustomerID,
        field: updateCustomerField,
        value: updateCustomerValue
      });
      setSuccess('Customer updated successfully.');
      const res = await axios.get('http://localhost:8080/customers');
      setCustomers(res.data);
      resetForm();
      setView('menu');
    } catch (err) {
      setError('Failed to update customer: ' + (err.response?.data?.message || 'Network error'));
    }
    setIsLoading(false);
  };

  const updateBooking = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const { updateBookingID, updateBookingField, updateBookingValue, updateBookingStartDay, updateBookingStartMonth, updateBookingStartYear, updateBookingEndDay, updateBookingEndMonth, updateBookingEndYear } = formData;
    if (!updateBookingID || !updateBookingField) {
      setError('Booking ID and field required.');
      setIsLoading(false);
      return;
    }
    if ((updateBookingField === 'startDate' || updateBookingField === 'endDate') && (!updateBookingStartDay || !updateBookingStartMonth || !updateBookingStartYear || !updateBookingEndDay || !updateBookingEndMonth || !updateBookingEndYear)) {
      setError('Date fields required for date update.');
      setIsLoading(false);
      return;
    }
    if (updateBookingField !== 'startDate' && updateBookingField !== 'endDate' && !updateBookingValue) {
      setError('Value required for non-date fields.');
      setIsLoading(false);
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
      setSuccess('Booking updated successfully.');
      const res = await axios.get('http://localhost:8080/bookings');
      setBookings(res.data);
      resetForm();
      setView('menu');
    } catch (err) {
      setError('Failed to update booking: ' + (err.response?.data?.message || 'Network error'));
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 bg-pure-white min-h-screen text-dark-neutral font-inter">
      <h1 className="text-4xl font-bold mb-8 text-center text-dark-neutral">Admin Dashboard</h1>
      {success && <div className="bg-lime text-dark-neutral p-3 rounded-md mb-6 max-w-2xl mx-auto animate-slide-in">{success}</div>}
      {error && <div className="bg-red-accent text-off-white p-3 rounded-md mb-6 max-w-2xl mx-auto animate-slide-in">{error}</div>}
      {view === 'menu' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { label: 'Add Car', view: 'addCar', tooltip: 'Add a new car to the system' },
            { label: 'Add Customer', view: 'addCustomer', tooltip: 'Register a new customer' },
            { label: 'Add Booking', view: 'addBooking', tooltip: 'Create a new booking' },
            { label: 'Update Car', view: 'updateCar', tooltip: 'Modify car details' },
            { label: 'Delete Car', view: 'deleteCar', tooltip: 'Remove a car' },
            { label: 'Update Customer', view: 'updateCustomer', tooltip: 'Edit customer information' },
            { label: 'Delete Customer', view: 'deleteCustomer', tooltip: 'Remove a customer' },
            { label: 'Update Booking', view: 'updateBooking', tooltip: 'Modify booking details' },
            { label: 'Delete Booking', view: 'deleteBooking', tooltip: 'Cancel a booking' },
            { label: 'View Cars', view: 'viewCars', tooltip: 'List all cars' },
            { label: 'View Customers', view: 'viewCustomers', tooltip: 'List all customers' },
            { label: 'View Bookings', view: 'viewBookings', tooltip: 'List all bookings' },
          ].map((item) => (
            <button
              key={item.view}
              className="bg-lime text-dark-neutral px-4 py-3 rounded-md shadow-md font-semibold uppercase hover:bg-light-lime transition-transform duration-200 transform hover:scale-105 focus:ring-2 focus:ring-lime focus:outline-none disabled:opacity-50"
              onClick={() => setView(item.view)}
              disabled={isLoading}
              data-tooltip={item.tooltip}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-dark-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                item.label
              )}
            </button>
          ))}
        </div>
      )}
      {view === 'addCar' && (
        <div className="max-w-md mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Add New Car</h2>
          <div className="space-y-4">
            {[
              { name: 'id', placeholder: 'Car ID (e.g., A123)', type: 'text' },
              { name: 'brand', placeholder: 'Brand', type: 'text' },
              { name: 'model', placeholder: 'Model', type: 'text' },
              { name: 'type', placeholder: 'Type', type: 'text' },
              { name: 'year', placeholder: 'Year', type: 'number' },
              { name: 'capacity', placeholder: 'Capacity', type: 'number' },
              { name: 'rate', placeholder: 'Rate per Day', type: 'number' },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-base font-medium mb-1 text-dark-neutral">{field.placeholder}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={() => setView('menu')}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="bg-lime text-dark-neutral px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={addCar}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-dark-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Add Car'
              )}
            </button>
          </div>
        </div>
      )}
      {view === 'addCustomer' && (
        <div className="max-w-md mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Add New Customer</h2>
          <div className="space-y-4">
            {[
              { name: 'name', placeholder: 'Name', type: 'text' },
              { name: 'license', placeholder: 'License Number', type: 'text' },
              { name: 'contact', placeholder: 'Contact Info', type: 'text' },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-base font-medium mb-1 text-dark-neutral">{field.placeholder}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={() => setView('menu')}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="bg-lime text-dark-neutral px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={addCustomer}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-dark-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Add Customer'
              )}
            </button>
          </div>
        </div>
      )}
      {view === 'addBooking' && (
        <div className="max-w-md mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Add New Booking</h2>
          <div className="space-y-4">
            {[
              { name: 'carID', placeholder: 'Car ID', type: 'text' },
              { name: 'customerID', placeholder: 'Customer ID', type: 'text' },
              { name: 'startDay', placeholder: 'Start Day', type: 'number' },
              { name: 'startMonth', placeholder: 'Start Month', type: 'number' },
              { name: 'startYear', placeholder: 'Start Year', type: 'number' },
              { name: 'endDay', placeholder: 'End Day', type: 'number' },
              { name: 'endMonth', placeholder: 'End Month', type: 'number' },
              { name: 'endYear', placeholder: 'End Year', type: 'number' },
            ].map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-base font-medium mb-1 text-dark-neutral">{field.placeholder}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={() => setView('menu')}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="bg-lime text-dark-neutral px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={addBooking}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-dark-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Add Booking'
              )}
            </button>
          </div>
        </div>
      )}
      {view === 'updateCar' && (
        <div className="max-w-md mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Update Car</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-base font-medium mb-1 text-dark-neutral">Car ID</label>
              <input
                type="text"
                name="updateCarID"
                value={formData.updateCarID}
                onChange={handleInputChange}
                placeholder="Car ID"
                className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-base font-medium mb-1 text-dark-neutral">Field to Update</label>
              <select
                name="updateCarField"
                value={formData.updateCarField}
                onChange={handleInputChange}
                className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                disabled={isLoading}
              >
                <option value="">Select Field</option>
                <option value="brand">Brand</option>
                <option value="model">Model</option>
                <option value="type">Type</option>
                <option value="year">Year</option>
                <option value="capacity">Capacity</option>
                <option value="rate">Rate per Day</option>
                <option value="available">Available (yes/no)</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-base font-medium mb-1 text-dark-neutral">New Value</label>
              <input
                type="text"
                name="updateCarValue"
                value={formData.updateCarValue}
                onChange={handleInputChange}
                placeholder="New Value"
                className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={() => setView('menu')}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="bg-lime text-dark-neutral px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={updateCar}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-dark-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Update Car'
              )}
            </button>
          </div>
        </div>
      )}
      {view === 'deleteCar' && (
        <div className="max-w-md mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Delete Car</h2>
          <div className="flex flex-col">
            <label className="text-base font-medium mb-1 text-dark-neutral">Car ID</label>
            <input
              type="text"
              name="deleteCarID"
              value={formData.deleteCarID}
              onChange={handleInputChange}
              placeholder="Car ID"
              className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={() => setView('menu')}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="bg-red-accent text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-red-accent-dark transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={handleDeleteCar}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-off-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Delete Car'
              )}
            </button>
          </div>
        </div>
      )}
      {view === 'updateCustomer' && (
        <div className="max-w-md mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Update Customer</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-base font-medium mb-1 text-dark-neutral">Customer ID</label>
              <input
                type="text"
                name="updateCustomerID"
                value={formData.updateCustomerID}
                onChange={handleInputChange}
                placeholder="Customer ID"
                className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-base font-medium mb-1 text-dark-neutral">Field to Update</label>
              <select
                name="updateCustomerField"
                value={formData.updateCustomerField}
                onChange={handleInputChange}
                className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                disabled={isLoading}
              >
                <option value="">Select Field</option>
                <option value="name">Name</option>
                <option value="license">License Number</option>
                <option value="contact">Contact Info</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-base font-medium mb-1 text-dark-neutral">New Value</label>
              <input
                type="text"
                name="updateCustomerValue"
                value={formData.updateCustomerValue}
                onChange={handleInputChange}
                placeholder="New Value"
                className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={() => setView('menu')}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="bg-lime text-dark-neutral px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={updateCustomer}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-dark-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Update Customer'
              )}
            </button>
          </div>
        </div>
      )}
      {view === 'deleteCustomer' && (
        <div className="max-w-md mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Delete Customer</h2>
          <div className="flex flex-col">
            <label className="text-base font-medium mb-1 text-dark-neutral">Customer ID</label>
            <input
              type="text"
              name="deleteCustomerID"
              value={formData.deleteCustomerID}
              onChange={handleInputChange}
              placeholder="Customer ID"
              className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={() => setView('menu')}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="bg-red-accent text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-red-accent-dark transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={handleDeleteCustomer}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-off-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Delete Customer'
              )}
            </button>
          </div>
        </div>
      )}
      {view === 'updateBooking' && (
        <div className="max-w-md mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Update Booking</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-base font-medium mb-1 text-dark-neutral">Booking ID</label>
              <input
                type="text"
                name="updateBookingID"
                value={formData.updateBookingID}
                onChange={handleInputChange}
                placeholder="Booking ID"
                className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-base font-medium mb-1 text-dark-neutral">Field to Update</label>
              <select
                name="updateBookingField"
                value={formData.updateBookingField}
                onChange={handleInputChange}
                className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                disabled={isLoading}
              >
                <option value="">Select Field</option>
                <option value="customerID">Customer ID</option>
                <option value="carID">Car ID</option>
                <option value="startDate">Start Date</option>
                <option value="endDate">End Date</option>
              </select>
            </div>
            {formData.updateBookingField === 'startDate' || formData.updateBookingField === 'endDate' ? (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-base font-medium mb-1 text-dark-neutral">{formData.updateBookingField === 'startDate' ? 'Start Day' : 'End Day'}</label>
                  <input
                    type="number"
                    name={formData.updateBookingField === 'startDate' ? 'updateBookingStartDay' : 'updateBookingEndDay'}
                    value={formData.updateBookingField === 'startDate' ? formData.updateBookingStartDay : formData.updateBookingEndDay}
                    onChange={handleInputChange}
                    placeholder={formData.updateBookingField === 'startDate' ? 'Start Day' : 'End Day'}
                    className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-base font-medium mb-1 text-dark-neutral">{formData.updateBookingField === 'startDate' ? 'Start Month' : 'End Month'}</label>
                  <input
                    type="number"
                    name={formData.updateBookingField === 'startDate' ? 'updateBookingStartMonth' : 'updateBookingEndMonth'}
                    value={formData.updateBookingField === 'startDate' ? formData.updateBookingStartMonth : formData.updateBookingEndMonth}
                    onChange={handleInputChange}
                    placeholder={formData.updateBookingField === 'startDate' ? 'Start Month' : 'End Month'}
                    className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-base font-medium mb-1 text-dark-neutral">{formData.updateBookingField === 'startDate' ? 'Start Year' : 'End Year'}</label>
                  <input
                    type="number"
                    name={formData.updateBookingField === 'startDate' ? 'updateBookingStartYear' : 'updateBookingEndYear'}
                    value={formData.updateBookingField === 'startDate' ? formData.updateBookingStartYear : formData.updateBookingEndYear}
                    onChange={handleInputChange}
                    placeholder={formData.updateBookingField === 'startDate' ? 'Start Year' : 'End Year'}
                    className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                    disabled={isLoading}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <label className="text-base font-medium mb-1 text-dark-neutral">New Value</label>
                <input
                  type="text"
                  name="updateBookingValue"
                  value={formData.updateBookingValue}
                  onChange={handleInputChange}
                  placeholder="New Value"
                  className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={() => setView('menu')}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="bg-lime text-dark-neutral px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={updateBooking}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-dark-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Update Booking'
              )}
            </button>
          </div>
        </div>
      )}
      {view === 'deleteBooking' && (
        <div className="max-w-md mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Delete Booking</h2>
          <div className="flex flex-col">
            <label className="text-base font-medium mb-1 text-dark-neutral">Booking ID</label>
            <input
              type="text"
              name="deleteBookingID"
              value={formData.deleteBookingID}
              onChange={handleInputChange}
              placeholder="Booking ID"
              className="bg-off-white text-dark-neutral border border-dark-neutral p-2 rounded-md ring-1 ring-dark-neutral text-base focus:ring-2 focus:ring-lime focus:border-lime"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={() => setView('menu')}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="bg-red-accent text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-red-accent-dark transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
              onClick={handleDeleteBooking}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-off-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Delete Booking'
              )}
            </button>
          </div>
        </div>
      )}
      {view === 'viewCars' && (
        <div className="max-w-7xl mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">All Cars</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-spacing-0">
              <thead className="sticky top-0 bg-lime">
                <tr>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">ID</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Brand</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Model</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Type</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Year</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Capacity</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Rate/Day</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Available</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car, index) => (
                  <tr key={car.id} className={`hover:bg-light-lime ${index % 2 === 0 ? 'bg-pure-white' : 'bg-off-white'}`}>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{car.id}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{car.brand}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{car.model}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{car.type}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{car.year}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{car.capacity}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">${car.rate.toFixed(2)}</td>
                    <td className="p-3 border-b border-dark-neutral">
                      <span className={`px-2 py-1 rounded-full text-sm ${car.available ? 'bg-lime text-dark-neutral' : 'bg-red-accent text-off-white'}`}>
                        {car.available ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105"
              onClick={() => setView('menu')}
            >
              Back
            </button>
          </div>
        </div>
      )}
      {view === 'viewCustomers' && (
        <div className="max-w-7xl mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">All Customers</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-spacing-0">
              <thead className="sticky top-0 bg-lime">
                <tr>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">ID</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Name</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">License</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Contact</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust, index) => (
                  <tr key={cust.id} className={`hover:bg-light-lime ${index % 2 === 0 ? 'bg-pure-white' : 'bg-off-white'}`}>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{cust.id}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{cust.name}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{cust.license}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{cust.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105"
              onClick={() => setView('menu')}
            >
              Back
            </button>
          </div>
        </div>
      )}
      {view === 'viewBookings' && (
        <div className="max-w-7xl mx-auto bg-off-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">All Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-spacing-0">
              <thead className="sticky top-0 bg-lime">
                <tr>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Booking ID</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Car ID</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Customer ID</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Start Date</th>
                  <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">End Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((bk, index) => (
                  <tr key={bk.bookingID} className={`hover:bg-light-lime ${index % 2 === 0 ? 'bg-pure-white' : 'bg-off-white'}`}>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{bk.bookingID}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{bk.carID}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{bk.customerID}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{`${bk.startDate.day}-${bk.startDate.month}-${bk.startDate.year}`}</td>
                    <td className="p-3 text-dark-neutral text-base border-b border-dark-neutral">{`${bk.endDate.day}-${bk.endDate.month}-${bk.endDate.year}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105"
              onClick={() => setView('menu')}
            >
              Back
            </button>
          </div>
        </div>
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

export default AdminDashboard;