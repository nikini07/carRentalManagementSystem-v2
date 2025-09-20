import { useState } from 'react';
import axios from 'axios';

const CustomerDashboard = ({ cars, customers, bookings, saveCustomer, saveBooking, generateCustomerID, generateBookingID, dateLessThan }) => {
  const [showForm, setShowForm] = useState(true);
  const [showCars, setShowCars] = useState(true);
  const [showBookings, setShowBookings] = useState(true);
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [formData, setFormData] = useState({
    customerID: '',
    name: '',
    license: '',
    contact: '',
    carID: '',
    startDay: '',
    startMonth: '',
    startYear: '',
    endDay: '',
    endMonth: '',
    endYear: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      customerID: '',
      name: '',
      license: '',
      contact: '',
      carID: '',
      startDay: '',
      startMonth: '',
      startYear: '',
      endDay: '',
      endMonth: '',
      endYear: ''
    });
    setError('');
    setSuccess('');
  };

  const handleBooking = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    const { customerID, name, license, contact, carID, startDay, startMonth, startYear, endDay, endMonth, endYear } = formData;

    if (!isExistingCustomer) {
      if (!name || !license || !contact) {
        setError('All customer fields are required.');
        setIsLoading(false);
        return;
      }
      const newCustomerID = generateCustomerID();
      try {
        await saveCustomer({ id: newCustomerID, name, license, contact });
      } catch (err) {
        setError('Failed to save customer: ' + (err.response?.data?.message || 'Network error'));
        setIsLoading(false);
        return;
      }
    } else if (!customerID || !customers.some((c) => c.id === customerID)) {
      setError('Invalid or non-existent Customer ID.');
      setIsLoading(false);
      return;
    }

    const car = cars.find((c) => c.id === carID && c.available);
    if (!car) {
      setError('Car not available or not found.');
      setIsLoading(false);
      return;
    }

    const startDate = { day: parseInt(startDay), month: parseInt(startMonth), year: parseInt(startYear) };
    const endDate = { day: parseInt(endDay), month: parseInt(endMonth), year: parseInt(endYear) };

    if (isNaN(startDate.day) || isNaN(startDate.month) || isNaN(startDate.year) || isNaN(endDate.day) || isNaN(endDate.month) || isNaN(endDate.year)) {
      setError('All date fields must be valid numbers.');
      setIsLoading(false);
      return;
    }

    if (dateLessThan(endDate, startDate)) {
      setError('End date cannot be before start date.');
      setIsLoading(false);
      return;
    }

    const bookingID = generateBookingID();
    try {
      await saveBooking({
        bookingID,
        carID,
        customerID: isExistingCustomer ? customerID : newCustomerID,
        startDate,
        endDate
      });
      setSuccess('Booking successful!');
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError('Failed to save booking: ' + (err.response?.data?.message || 'Network error'));
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-pure-white text-dark-neutral font-inter">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-accent text-off-white p-4 rounded-md mb-6 max-w-2xl mx-auto animate-slide-in" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-lime text-dark-neutral p-4 rounded-md mb-6 max-w-2xl mx-auto animate-slide-in" role="alert">
            {success}
          </div>
        )}
        {showForm && (
          <div className="bg-off-white rounded-md shadow-md p-6 mb-8 max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-dark-neutral">Book a Car</h2>
            <div className="mb-4">
              <label className="flex items-center space-x-2 text-base font-medium text-dark-neutral">
                <input
                  type="checkbox"
                  checked={isExistingCustomer}
                  onChange={() => setIsExistingCustomer(!isExistingCustomer)}
                  className="h-4 w-4 text-lime focus:ring-lime border-dark-neutral rounded"
                  disabled={isLoading}
                  aria-label="Toggle existing customer status"
                />
                <span>Existing Customer</span>
              </label>
            </div>
            <div className="space-y-4">
              {isExistingCustomer ? (
                <div className="flex flex-col">
                  <label className="block mb-1 text-base font-medium text-dark-neutral">Customer ID</label>
                  <input
                    type="text"
                    name="customerID"
                    value={formData.customerID}
                    onChange={handleInputChange}
                    placeholder="Customer ID"
                    className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                    disabled={isLoading}
                    aria-required="true"
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-col">
                    <label className="block mb-1 text-base font-medium text-dark-neutral">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                      disabled={isLoading}
                      aria-required="true"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block mb-1 text-base font-medium text-dark-neutral">License Number</label>
                    <input
                      type="text"
                      name="license"
                      value={formData.license}
                      onChange={handleInputChange}
                      placeholder="License Number"
                      className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                      disabled={isLoading}
                      aria-required="true"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="block mb-1 text-base font-medium text-dark-neutral">Contact Info</label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="Contact Info"
                      className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                      disabled={isLoading}
                      aria-required="true"
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col">
                <label className="block mb-1 text-base font-medium text-dark-neutral">Car ID</label>
                <input
                  type="text"
                  name="carID"
                  value={formData.carID}
                  onChange={handleInputChange}
                  placeholder="Car ID"
                  className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                  disabled={isLoading}
                  aria-required="true"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="block mb-1 text-base font-medium text-dark-neutral">Start Day</label>
                  <input
                    type="number"
                    name="startDay"
                    value={formData.startDay}
                    onChange={handleInputChange}
                    placeholder="Day"
                    className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                    disabled={isLoading}
                    aria-required="true"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block mb-1 text-base font-medium text-dark-neutral">Start Month</label>
                  <input
                    type="number"
                    name="startMonth"
                    value={formData.startMonth}
                    onChange={handleInputChange}
                    placeholder="Month"
                    className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                    disabled={isLoading}
                    aria-required="true"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block mb-1 text-base font-medium text-dark-neutral">Start Year</label>
                  <input
                    type="number"
                    name="startYear"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    placeholder="Year"
                    className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                    disabled={isLoading}
                    aria-required="true"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="block mb-1 text-base font-medium text-dark-neutral">End Day</label>
                  <input
                    type="number"
                    name="endDay"
                    value={formData.endDay}
                    onChange={handleInputChange}
                    placeholder="Day"
                    className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                    disabled={isLoading}
                    aria-required="true"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block mb-1 text-base font-medium text-dark-neutral">End Month</label>
                  <input
                    type="number"
                    name="endMonth"
                    value={formData.endMonth}
                    onChange={handleInputChange}
                    placeholder="Month"
                    className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                    disabled={isLoading}
                    aria-required="true"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block mb-1 text-base font-medium text-dark-neutral">End Year</label>
                  <input
                    type="number"
                    name="endYear"
                    value={formData.endYear}
                    onChange={handleInputChange}
                    placeholder="Year"
                    className="w-full p-2 bg-off-white border border-dark-neutral rounded-md ring-1 ring-dark-neutral focus:ring-2 focus:ring-lime focus:border-lime text-base text-dark-neutral"
                    disabled={isLoading}
                    aria-required="true"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
                onClick={() => setShowForm(false)}
                disabled={isLoading}
                aria-label="Cancel booking"
              >
                Cancel
              </button>
              <button
                className="bg-lime text-dark-neutral px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime transition-transform duration-200 transform hover:scale-105 disabled:opacity-50"
                onClick={handleBooking}
                disabled={isLoading}
                aria-label="Submit booking"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto text-dark-neutral" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Book Car'
                )}
              </button>
            </div>
          </div>
        )}
        <div className="bg-off-white rounded-md shadow-md p-6 mb-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-dark-neutral">Available Cars</h2>
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105"
              onClick={() => setShowCars(!showCars)}
              aria-label={showCars ? 'Hide available cars' : 'Show available cars'}
            >
              {showCars ? 'Hide' : 'View'}
            </button>
          </div>
          {showCars && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-spacing-0">
                <thead className="sticky top-0 bg-lime">
                  <tr>
                    <th className="p-3 text-left font-semibold text-base text-dark-neutral border-b border-dark-neutral">Car ID</th>
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
                  {cars.filter(car => car.available).map((car, index) => (
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
          )}
        </div>
        <div className="bg-off-white rounded-md shadow-md p-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-dark-neutral">Your Bookings</h2>
            <button
              className="bg-dark-neutral text-off-white px-4 py-2 rounded-md font-semibold uppercase hover:bg-light-lime hover:text-dark-neutral transition-transform duration-200 transform hover:scale-105"
              onClick={() => setShowBookings(!showBookings)}
              aria-label={showBookings ? 'Hide bookings' : 'Show bookings'}
            >
              {showBookings ? 'Hide' : 'View'}
            </button>
          </div>
          {showBookings && (
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
          )}
        </div>
      </div>
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

export default CustomerDashboard;