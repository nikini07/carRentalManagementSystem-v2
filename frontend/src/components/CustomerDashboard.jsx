import React, { useState } from 'react';

const CustomerDashboard = ({ cars, customers, bookings, saveCustomer, saveBooking, generateCustomerID, generateBookingID, dateLessThan }) => {
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [customerID, setCustomerID] = useState('');
  const [name, setName] = useState('');
  const [license, setLicense] = useState('');
  const [contact, setContact] = useState('');
  const [carID, setCarID] = useState('');
  const [startDate, setStartDate] = useState({ day: '', month: '', year: '' });
  const [endDate, setEndDate] = useState({ day: '', month: '', year: '' });
  const [showCars, setShowCars] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBookCar = async () => {
    setError('');
    setSuccess('');
    try {
      let custID = customerID;
      if (!isExistingCustomer) {
        if (!name || !license || !contact) {
          throw new Error('Please fill in all customer details.');
        }
        custID = generateCustomerID();
        await saveCustomer({ name, license, contact });
      }
      if (!carID || !startDate.day || !startDate.month || !startDate.year || !endDate.day || !endDate.month || !endDate.year) {
        throw new Error('Please fill in all booking details.');
      }
      const start = { day: parseInt(startDate.day), month: parseInt(startDate.month), year: parseInt(startDate.year) };
      const end = { day: parseInt(endDate.day), month: parseInt(endDate.month), year: parseInt(endDate.year) };
      if (dateLessThan(end, start)) {
        throw new Error('End date must not be before start date.');
      }
      const bookingID = generateBookingID();
      await saveBooking({ bookingID, carID, customerID: custID, startDate: start, endDate: end });
      setSuccess('Booking successful!');
      setCustomerID('');
      setName('');
      setLicense('');
      setContact('');
      setCarID('');
      setStartDate({ day: '', month: '', year: '' });
      setEndDate({ day: '', month: '', year: '' });
    } catch (err) {
      setError(err.message || 'Failed to save booking');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Car Rental System</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Book a Car</h2>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isExistingCustomer}
                onChange={() => setIsExistingCustomer(!isExistingCustomer)}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Existing Customer</span>
            </label>
          </div>
          {isExistingCustomer ? (
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Customer ID</label>
              <input
                type="text"
                value={customerID}
                onChange={(e) => setCustomerID(e.target.value)}
                placeholder="e.g., C001"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">License Number</label>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="Enter license number"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Contact Info</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter contact info"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Car ID</label>
              <input
                type="text"
                value={carID}
                onChange={(e) => setCarID(e.target.value)}
                placeholder="e.g., CAR001"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1">Start Date</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={startDate.day}
                  onChange={(e) => setStartDate({ ...startDate, day: e.target.value })}
                  placeholder="Day"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={startDate.month}
                  onChange={(e) => setStartDate({ ...startDate, month: e.target.value })}
                  placeholder="Month"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={startDate.year}
                  onChange={(e) => setStartDate({ ...startDate, year: e.target.value })}
                  placeholder="Year"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">End Date</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={endDate.day}
                  onChange={(e) => setEndDate({ ...endDate, day: e.target.value })}
                  placeholder="Day"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={endDate.month}
                  onChange={(e) => setEndDate({ ...endDate, month: e.target.value })}
                  placeholder="Month"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={endDate.year}
                  onChange={(e) => setEndDate({ ...endDate, year: e.target.value })}
                  placeholder="Year"
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleBookCar}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Book Car
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <button
            onClick={() => setShowCars(!showCars)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300 mb-4"
          >
            {showCars ? 'Hide Available Cars' : 'View Available Cars'}
          </button>
          {showCars && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border p-2 text-left">Car ID</th>
                    <th className="border p-2 text-left">Brand</th>
                    <th className="border p-2 text-left">Model</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Year</th>
                    <th className="border p-2 text-left">Capacity</th>
                    <th className="border p-2 text-left">Rate/Day</th>
                    <th className="border p-2 text-left">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="border p-2">{car.id}</td>
                      <td className="border p-2">{car.brand}</td>
                      <td className="border p-2">{car.model}</td>
                      <td className="border p-2">{car.type}</td>
                      <td className="border p-2">{car.year}</td>
                      <td className="border p-2">{car.capacity}</td>
                      <td className="border p-2">${car.rate.toFixed(2)}</td>
                      <td className="border p-2">{car.available ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => {
                if (!customerID && isExistingCustomer) {
                  setError('Please enter a Customer ID to view bookings.');
                  return;
                }
                setShowBookings(!showBookings);
                setError('');
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              {showBookings ? 'Hide Bookings' : 'View Bookings'}
            </button>
            {showBookings && (
              <input
                type="text"
                value={customerID}
                onChange={(e) => setCustomerID(e.target.value)}
                placeholder="Enter Customer ID"
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
          {showBookings && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border p-2 text-left">Booking ID</th>
                    <th className="border p-2 text-left">Car ID</th>
                    <th className="border p-2 text-left">Customer ID</th>
                    <th className="border p-2 text-left">Start Date</th>
                    <th className="border p-2 text-left">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter((booking) => !isExistingCustomer || booking.customerID === customerID)
                    .map((booking) => (
                      <tr key={booking.bookingID} className="hover:bg-gray-50">
                        <td className="border p-2">{booking.bookingID}</td>
                        <td className="border p-2">{booking.carID}</td>
                        <td className="border p-2">{booking.customerID}</td>
                        <td className="border p-2">{booking.startDate.day}-{booking.startDate.month}-{booking.startDate.year}</td>
                        <td className="border p-2">{booking.endDate.day}-{booking.endDate.month}-{booking.endDate.year}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;