import { useState } from 'react';

const AdminDashboard = ({ cars, setCars, customers, setCustomers, bookings, setBookings, saveCar, saveCustomer, saveBooking, generateCustomerID, generateBookingID, dateLessThan }) => {
  const [view, setView] = useState('menu');
  const [formData, setFormData] = useState({
    id: '', brand: '', model: '', type: '', year: '', capacity: '', rate: '',
    name: '', license: '', contact: '',
    carID: '', customerID: '', startDay: '', startMonth: '', startYear: '', endDay: '', endMonth: '', endYear: '',
    updateCarID: '', updateField: '', updateValue: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      id: '', brand: '', model: '', type: '', year: '', capacity: '', rate: '',
      name: '', license: '', contact: '',
      carID: '', customerID: '', startDay: '', startMonth: '', startYear: '', endDay: '', endMonth: '', endYear: '',
      updateCarID: '', updateField: '', updateValue: ''
    });
  };

  const addCar = () => {
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
    saveCar({ id, brand, model, type, year: y, capacity: cap, rate: r });
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

  const addBooking = () => {
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
    saveBooking({ bookingID, carID, customerID, startDate, endDate });
    resetForm();
    setView('menu');
  };

  const updateCarField = () => {
    alert('Update car not implemented yet.');
    resetForm();
    setView('menu');
  };

  const deleteCar = () => {
    alert('Delete car not implemented yet.');
    resetForm();
    setView('menu');
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
          <input
            type="text"
            name="updateField"
            value={formData.updateField}
            onChange={handleInputChange}
            placeholder="Field to Update (e.g., brand, model)"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <input
            type="text"
            name="updateValue"
            value={formData.updateValue}
            onChange={handleInputChange}
            placeholder="New Value"
            className="border border-gray-300 p-2 m-2 rounded w-full"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={updateCarField}>
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
            name="updateCarID"
            value={formData.updateCarID}
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
    </div>
  );
};

export default AdminDashboard;