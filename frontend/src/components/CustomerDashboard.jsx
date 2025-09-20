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
    <div className="min-h-screen bg-neutral-white text-neutral-gray-dark font-sans">
      <header className="bg-neutral-gray-light py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-neutral-gray-dark">Car Rental System</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-neutral-gray-light rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-neutral-gray-dark">Book a Car</h2>
          {error && <div className="bg-red-accent text-neutral-white p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-lime text-neutral-gray-dark p-3 rounded mb-4">{success}</div>}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isExistingCustomer}
                onChange={() => setIsExistingCustomer(!isExistingCustomer)}
                className="mr-2 h-5 w-5"
                style={{ accentColor: '#A3E635' }}
              />
              <span className="text-neutral-gray-dark">Existing Customer</span>
            </label>
          </div>
          {isExistingCustomer ? (
            <div className="mb-4">
              <label className="block mb-1 text-neutral-gray-medium">Customer ID</label>
              <input
                type="text"
                value={customerID}
                onChange={(e) => setCustomerID(e.target.value)}
                placeholder="e.g., C001"
                className="w-full p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-neutral-gray-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>
              <div>
                <label className="block mb-1 text-neutral-gray-medium">License Number</label>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="Enter license number"
                  className="w-full p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>
              <div>
                <label className="block mb-1 text-neutral-gray-medium">Contact Info</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Enter contact info"
                  className="w-full p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-neutral-gray-medium">Car ID</label>
              <input
                type="text"
                value={carID}
                onChange={(e) => setCarID(e.target.value)}
                placeholder="e.g., CAR001"
                className="w-full p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 text-neutral-gray-medium">Start Date</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={startDate.day}
                  onChange={(e) => setStartDate({ ...startDate, day: e.target.value })}
                  placeholder="Day"
                  className="p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
                />
                <input
                  type="number"
                  value={startDate.month}
                  onChange={(e) => setStartDate({ ...startDate, month: e.target.value })}
                  placeholder="Month"
                  className="p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
                />
                <input
                  type="number"
                  value={startDate.year}
                  onChange={(e) => setStartDate({ ...startDate, year: e.target.value })}
                  placeholder="Year"
                  className="p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-neutral-gray-medium">End Date</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={endDate.day}
                  onChange={(e) => setEndDate({ ...endDate, day: e.target.value })}
                  placeholder="Day"
                  className="p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
                />
                <input
                  type="number"
                  value={endDate.month}
                  onChange={(e) => setEndDate({ ...endDate, month: e.target.value })}
                  placeholder="Month"
                  className="p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
                />
                <input
                  type="number"
                  value={endDate.year}
                  onChange={(e) => setEndDate({ ...endDate, year: e.target.value })}
                  placeholder="Year"
                  className="p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleBookCar}
            className="bg-lime text-neutral-gray-dark px-6 py-2 rounded-lg hover:bg-lime-dark transition-colors duration-200"
          >
            Book Car
          </button>
        </div>
        <div className="bg-neutral-gray-light rounded-lg shadow-sm p-6 mb-8">
          <button
            onClick={() => setShowCars(!showCars)}
            className="bg-lime text-neutral-gray-dark px-6 py-2 rounded-lg hover:bg-lime-dark transition-colors duration-200 mb-4"
          >
            {showCars ? 'Hide Available Cars' : 'View Available Cars'}
          </button>
          {showCars && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-lime text-neutral-gray-dark">
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Car ID</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Brand</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Model</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Type</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Year</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Capacity</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Rate/Day</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car, index) => (
                    <tr key={car.id} className={index % 2 === 0 ? 'bg-neutral-white hover:bg-neutral-gray-light' : 'bg-neutral-gray-light hover:bg-neutral-white'}>
                      <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{car.id}</td>
                      <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{car.brand}</td>
                      <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{car.model}</td>
                      <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{car.type}</td>
                      <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{car.year}</td>
                      <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{car.capacity}</td>
                      <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">${car.rate.toFixed(2)}</td>
                      <td className="border border-neutral-gray-medium p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${car.available ? 'bg-lime text-neutral-gray-dark' : 'bg-red-accent text-neutral-white'}`}>
                          {car.available ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="bg-neutral-gray-light rounded-lg shadow-sm p-6">
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
              className="bg-lime text-neutral-gray-dark px-6 py-2 rounded-lg hover:bg-lime-dark transition-colors duration-200"
            >
              {showBookings ? 'Hide Bookings' : 'View Bookings'}
            </button>
            {showBookings && (
              <input
                type="text"
                value={customerID}
                onChange={(e) => setCustomerID(e.target.value)}
                placeholder="Enter Customer ID"
                className="p-2 bg-neutral-gray-light border border-neutral-gray-medium rounded focus:outline-none focus:ring-2 focus:ring-lime"
              />
            )}
          </div>
          {showBookings && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-lime text-neutral-gray-dark">
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Booking ID</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Car ID</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Customer ID</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">Start Date</th>
                    <th className="border border-neutral-gray-medium p-2 text-left text-sm font-semibold">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter((booking) => !isExistingCustomer || booking.customerID === customerID)
                    .map((booking, index) => (
                      <tr key={booking.bookingID} className={index % 2 === 0 ? 'bg-neutral-white hover:bg-neutral-gray-light' : 'bg-neutral-gray-light hover:bg-neutral-white'}>
                        <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{booking.bookingID}</td>
                        <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{booking.carID}</td>
                        <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{booking.customerID}</td>
                        <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{booking.startDate.day}-{booking.startDate.month}-{booking.startDate.year}</td>
                        <td className="border border-neutral-gray-medium p-2 text-neutral-gray-dark text-sm">{booking.endDate.day}-{booking.endDate.month}-{booking.endDate.year}</td>
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