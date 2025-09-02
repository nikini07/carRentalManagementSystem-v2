import { useState } from 'react';

const CustomerDashboard = ({ cars, customers, bookings, saveCustomer, saveBooking, generateCustomerID, generateBookingID, dateLessThan }) => {
  const [view, setView] = useState('menu');
  const [isExisting, setIsExisting] = useState(false);
  const [customerID, setCustomerID] = useState('');
  const [formData, setFormData] = useState({
    name: '', license: '', contact: '',
    carID: '', startDay: '', startMonth: '', startYear: '', endDay: '', endMonth: '', endYear: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '', license: '', contact: '',
      carID: '', startDay: '', startMonth: '', startYear: '', endDay: '', endMonth: '', endYear: ''
    });
    setCustomerID('');
    setIsExisting(false);
  };

  const bookCar = async () => {
    let custID = customerID;
    if (!isExisting) {
      const { name, license, contact } = formData;
      if (!name || !license || !contact) {
        alert('All fields required.');
        return;
      }
      custID = await saveCustomer({ name, license, contact });
      if (!custID) return;
    } else if (!customers.some((c) => c.id === custID)) {
      alert('Customer not found.');
      return;
    }

    const { carID, startDay, startMonth, startYear, endDay, endMonth, endYear } = formData;
    const car = cars.find((c) => c.id === carID && c.available);
    if (!car) {
      alert('Car not available or not found.');
      return;
    }
    const startDate = { day: parseInt(startDay), month: parseInt(startMonth), year: parseInt(startYear) };
    const endDate = { day: parseInt(endDay), month: parseInt(endMonth), year: parseInt(endYear) };
    if (dateLessThan(endDate, startDate)) {
      alert('End date cannot be before start date.');
      return;
    }
    const bookingID = generateBookingID();
    saveBooking({ bookingID, carID, customerID: custID, startDate, endDate });
    resetForm();
    setView('menu');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Customer Dashboard</h1>
      {view === 'menu' && (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('bookCar')}>
            Book Car
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('viewCars')}>
            View Available Cars
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setView('viewBookings')}>
            View Bookings
          </button>
        </div>
      )}
      {view === 'bookCar' && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Book a Car</h2>
          <div className="mb-4">
            <label className="block text-gray-700">
              <input
                type="checkbox"
                checked={isExisting}
                onChange={(e) => setIsExisting(e.target.checked)}
                className="mr-2"
              />
              Existing Customer
            </label>
          </div>
          {isExisting ? (
            <input
              type="text"
              value={customerID}
              onChange={(e) => setCustomerID(e.target.value)}
              placeholder="Customer ID"
              className="border border-gray-300 p-2 m-2 rounded w-full"
            />
          ) : (
            <>
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
            </>
          )}
          <input
            type="text"
            name="carID"
            value={formData.carID}
            onChange={handleInputChange}
            placeholder="Car ID"
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
          <button className="bg-green-500 text-white px-4 py-2 rounded m-2 hover:bg-green-600" onClick={bookCar}>
            Book Car
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded m-2 hover:bg-gray-600" onClick={() => setView('menu')}>
            Back
          </button>
        </div>
      )}
      {view === 'viewCars' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Available Cars</h2>
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
              </tr>
            </thead>
            <tbody>
              {cars.filter((car) => car.available).map((car) => (
                <tr key={car.id}>
                  <td className="border border-gray-300 p-2">{car.id}</td>
                  <td className="border border-gray-300 p-2">{car.brand}</td>
                  <td className="border border-gray-300 p-2">{car.model}</td>
                  <td className="border border-gray-300 p-2">{car.type}</td>
                  <td className="border border-gray-300 p-2">{car.year}</td>
                  <td className="border border-gray-300 p-2">{car.capacity}</td>
                  <td className="border border-gray-300 p-2">{car.rate.toFixed(2)}</td>
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
          <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
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
              {bookings.filter((bk) => bk.customerID === customerID).map((bk) => (
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

export default CustomerDashboard;